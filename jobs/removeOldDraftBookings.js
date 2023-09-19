import { client } from "@/trigger";
import { supabase } from "@/utils/triggerdev";
import { intervalTrigger } from "@trigger.dev/sdk";

client.defineJob({
   id: "remove-old-draft-requests",
   name: "Remove Old Draft Requests from Bookings Table",
   version: "1.0.0",
   integrations: {
      supabase,
   },
   trigger: intervalTrigger({ seconds: 3600 }), // Run every hour
   run: async (payload, io, ctx) => {

      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 30);

      const thirtyDaysAgo = currentDate.toISOString();

      // Fetch active bookings where end_date is 30 days old
      const bookings = await io.supabase.runTask(
         "fetch-month-old-bookings",
         async (supabaseClient) => {
            const { data, error } = await supabaseClient
               .from("bookings")
               .delete()
               .lte("end_date", thirtyDaysAgo)
               .eq("status", "active");
            return data;
         }
      );
   },
});
