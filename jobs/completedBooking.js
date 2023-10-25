import { client } from "@/trigger";
import { intervalTrigger } from "@trigger.dev/sdk";
import { Stripe } from "@trigger.dev/stripe";
import { Supabase } from "@trigger.dev/supabase";

const stripe = new Stripe({
   id: "stripe",
   apiKey: process.env.NEXT_PUBLIC_STRIPE_TEST_KEY,
});

const supabase = new Supabase({
   id: "supabase",
   supabaseUrl: `https://aocthgqmtpklqubodylf.supabase.co`,
   supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

client.defineJob({
   id: "create-payment-intent-for-completed-bookings",
   name: "Create Payment Intent for Completed Bookings",
   version: "1.0.0",
   integrations: {
      stripe,
      supabase,
   },
   trigger: intervalTrigger({ seconds: 21600 }), // Run every hour
   run: async (payload, io, ctx) => {
      
      // Fetch accepted bookings where end_date is less than or equal to current date
      const completedBookings = await io.supabase.runTask(
         "fetch-completed-bookings",
         async (supabaseClient) => {
            const { data, error } = await supabaseClient
               .from("bookings")
               .select("*, nooks(price_type)")
               .lte("end_date", payload.ts.toISOString())
               .eq("status", "accepted");
            if (error) {
               await io.logger.error("Failed to fetch completed bookings:", {
                  error,
               });
               throw error;
            }
            await io.logger.info("booking data", data);
            return data;
         }
      );

      for (const booking of completedBookings) {

         const updatedBooking = await io.supabase.runTask(
            "update-status-to-completed",
            async (supabaseClient) => {
               const { data, error } = await supabaseClient
                  .from("bookings")
                  .update('status', 'completed')
                  .eq("id", booking.id);
               if (error) {
                  await io.logger.error("Failed to update booking:", {
                     error,
                  });
                  throw error;
               }
               await io.logger.info("booking data", data);
               return data;
            }
         );

         await io.sendEvent(["send-booking-charge", updatedBooking.id], {
           id: `${updatedBooking.id}:charge`,
           name: "booking.charge",
           payload: {
             id: booking.id
           }
         })

       }

   },
});
