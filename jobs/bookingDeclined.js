import { DeclinedBooking } from "@/emails/DeclinedBooking";
import { client } from "@/trigger";
import { Resend } from "@trigger.dev/resend";
import { Supabase, SupabaseManagement } from "@trigger.dev/supabase";

const supabaseManagement = new SupabaseManagement({
   id: "supabase-management",
});

const supabaseTriggers = supabaseManagement.db(
   process.env.NEXT_PUBLIC_SUPABASE_URL
);

const resend = new Resend({
   id: "resend",
   apiKey: process.env.RESEND_API_KEY,
});

const supabase = new Supabase({
   id: "supabase",
   supabaseUrl: `https://aocthgqmtpklqubodylf.supabase.co`,
   supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

client.defineJob({
   id: "booking-declined",
   name: "Notify Guest and Host Booking is Declined",
   version: "1.0.0",
   integrations: {
      resend,
      supabase,
   },
   trigger: supabaseTriggers.onUpdated({
      schema: "public",
      table: "bookings",
      filter: {
         old_record: {
            status: ["pending"],
         },
         record: {
            status: ["declined"],
         },
      },
   }),
   run: async (payload, io, ctx) => {

      await io.logger.info("payload", payload);
      
      const hostData = await io.supabase.runTask(
         "fetch-host-data",
         async (supabaseClient) => {
            const { data, error } = await supabaseClient
               .from("company_profiles")
               .select("email, name, logo")
               .eq("id", payload.record.host_company_id);
            if (error) {
               await io.logger.error("error getting host data", error);
            } else {
               await io.logger.info("host data retrieved", data);
            }
            return data[0];
         }
      );

      const guestData = await io.supabase.runTask(
         "fetch-guest-data",
         async (supabaseClient) => {
            const { data, error } = await supabaseClient
               .from("company_profiles")
               .select("email, name, logo")
               .eq("id", payload.record.guest_company_id);
            if (error) {
               await io.logger.error("error getting guest data", error);
            } else {
               await io.logger.info("guest data retrieved", data);
            }
            return data[0];
         }
      );

      const locationData = await io.supabase.runTask(
         "fetch-location-data",
         async (supabaseClient) => {
            const { data, error } = await supabaseClient
               .from("nooks")
               .select("location_name, location_address, location_images")
               .eq("id", payload.record.nook_id);
            if (error) {
               await io.logger.error("error getting location data", error);
            } else {
               await io.logger.info("location data retrieved", data);
            }
            return data[0];
         }
      );

      const hostEmail = await io.resend.sendEmail("email-host", {
         to: [hostData.email],
         subject: `Your booking request from ${guestData.name} was declined.`,
         from: "Nookit <team@nookit.app>",
         react: DeclinedBooking({
            forGuest: false,
            guestMailto: `mailto:${guestData.email}`,
            guestLogo: guestData.logo,
            guestName: guestData.name,
            hostMailto: `mailto:${hostData.email}`,
            hostLogo: hostData.logo,
            hostName: hostData.name,
            locationName: locationData.location_name,
            locationAddress: locationData.locaton_address,
            locationImage: `user-images/${locationData.location_images?.[0]}`,
            startDate: payload.record.start_date,
            endDate: payload.record.end_date,
            dailyRate: payload.record.daily_rate,
            daysCount: payload.record.days_count,
            bookingPrice: payload.record.booking_price,
            processingFee: payload.record.processing_fee
         })
      });
     

      const guestEmail = await io.resend.sendEmail("email-guest", {
         to: [guestData.email],
         subject: `Your booking request to ${hostData.name} was declined.`,
         from: "Nookit <team@nookit.app>",
         react: DeclinedBooking({
            forGuest: true,
            guestMailto: `mailto:${guestData.email}`,
            guestLogo: guestData.logo,
            guestName: guestData.name,
            hostMailto: `mailto:${hostData.email}`,
            hostLogo: hostData.logo,
            hostName: hostData.name,
            locationName: locationData.location_name,
            locationAddress: locationData.locaton_address,
            locationImage: `user-images/${locationData.location_images?.[0]}`,
            startDate: payload.record.start_date,
            endDate: payload.record.end_date,
            dailyRate: payload.record.daily_rate,
            daysCount: payload.record.days_count,
            bookingPrice: payload.record.booking_price,
            processingFee: payload.record.processing_fee
         })
      });

   },
});
