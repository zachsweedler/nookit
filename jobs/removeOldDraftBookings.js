import { client } from "@/trigger";
import { intervalTrigger } from "@trigger.dev/sdk";
import { Supabase } from "@trigger.dev/supabase";

const supabase = new Supabase({
   id: "supabase",
   supabaseUrl: `https://aocthgqmtpklqubodylf.supabase.co`,
   supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
 });

client.defineJob({
   id: "remove-old-draft-requests",
   name: "Remove Old Draft Requests from Bookings Table",
   version: "1.0.0",
   integrations: {
      supabase,
   },
   trigger: intervalTrigger({ seconds: 3600 }), // Run every hour
   run: async (payload, io, ctx) => {

      const currentDate = payload.ts;
      currentDate.setDate(currentDate.getDate() - 30);
      const thirtyDaysAgo = currentDate.toISOString();

      // Fetch active bookings where end_date is 30 days old
      const bookings = await io.supabase.runTask(
         "fetch-month-old-bookings",
         async (supabaseClient) => {
            await io.logger.info('thirty days ago', thirtyDaysAgo)
            const { data, error } = await supabaseClient
               .from("bookings")
               .delete()
               .lte("created_at", thirtyDaysAgo)
               .eq("status", "draft")
               .select();
            if (error) {
               await io.logger.error('error getting draft bookings', error)
            } else {
               if (data && data.length > 0) {
                  await io.logger.info('draft bookings to delete', data)
               } else {
                  await io.logger.info('no draft bookings to delete!', data)
               }
            }
            return data;
         }
      );
   },
});
