import { client } from "@/trigger";
import { intervalTrigger } from "@trigger.dev/sdk";
import { Stripe } from "@trigger.dev/stripe";
import { Supabase } from "@trigger.dev/supabase";

const stripe = new Stripe({
  id: "stripe",
  apiKey: process.env.STRIPE_SECRET_KEY,
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
    trigger: intervalTrigger({ seconds: 3600 }), // Run every hour
    run: async (payload, io, ctx) => {
      
      const currentDate = new Date().toISOString()

      // Fetch accepted bookings where end_date is less than or equal to current date
      const bookings = await io.supabase.runTask(
        "fetch-completed-bookings",
        async (supabaseClient) => {
          const { data, error } = await supabaseClient
            .from("bookings")
            .select("*")
            .lte("end_date", currentDate)
            .eq("status", "accepted")
          if (error) {
            await io.logger.error("Failed to fetch completed bookings:", { error });
            throw error;
          }
          await io.logger.info('booking data', data)
          return data;
        }
      );

  
      // For each completed booking, create a payment intent and update the booking with the payment_intent_id
      for (const booking of bookings) {
        const paymentIntent = await io.stripe.runTask(
          "create-payment-intent",
          async (stripeClient) => {
            const { data, error } = await stripeClient.paymentIntents.create({
              automatic_payment_methods: {
                enabled: true,
              },
              currency: "usd",
              amount: booking.booking_price_total_before_taxes, // $100 + $30 guest fee = $130
              application_fee_amount: booking.processing_fee, // $130 - $30 host fee = $100 to platform before fees || right now, host fee mirrors what the guest pays as a processing fee.
              customer: booking.guest_customer_id,
              transfer_data: {
                destination: booking.host_connect_account_id,
              },
            });
            if (error) {
              await io.logger.error("Failed to create payment intent:", { error });
              throw error;
            }
            return data;
          }
        );
  
        const updateBookingTable = await io.supabase.runTask(
          "update-booking-with-payment-intent",
          async (supabaseClient) => {
            const { data, error } = await supabaseClient
              .from("bookings")
              .update({ 
                payment_intent_id: paymentIntent.id,
                status: "completed"
              })
              .eq("id", booking.id);
            if (error) {
              throw error;
            } 
            return  data;
          }
        );

      }
    },
  });