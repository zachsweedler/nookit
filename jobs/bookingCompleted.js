// import { client } from "@/trigger";
// import { Resend } from "@trigger.dev/resend";
// import { SupabaseManagement } from "@trigger.dev/supabase";

// const supabaseManagement = new SupabaseManagement({
//    id: "supabase-management",
//  });
 
//  const supabaseTriggers = supabaseManagement.db(
//    process.env.NEXT_PUBLIC_SUPABASE_URL
//  );
 
// const resend = new Resend({
//    id: "resend",
//    apiKey: process.env.RESEND_API_KEY,
// });

// client.defineJob({
//    id: "booking-completed",
//    name: "Notify Guest and Host Booking is Completed",
//    version: "1.0.0",
//    integrations: {
//       resend,
//    },
//    trigger: supabaseTriggers.onUpdated({
//       // Trigger this job whenever a booking status is changed from accepted to completed.
//       schema: "public",
//       table: "bookings",
//       filter: {
//          old_record: {
//             status: ["accepted"],
//          },
//          record: {
//             status: ["completed"],
//          },
//       },
//    }),
//    run: async (payload, io, ctx) => {
//       if (!payload.record.status) {
//          return;
//        }
   
//        const email = await io.resend.sendEmail("email", {
//          to: payload.record.email,
//          subject: `Your Booking is Completed!`,
//          text: `Congrats! Your booking is completed. Expect a payout soon.`,
//          from: 'Nookit <team@nookit.app>',
//          react: ({})
//        });
   
//        return {
//          email,
//        };

//    },
// });
