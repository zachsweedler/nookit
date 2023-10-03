import RequestForm from "@/components/search-nooks/request-booking/RequestForm";
import { useUserSession } from "@/hooks/server-side/useUserSession";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
export const dynamic = "force-dynamic";

export const metadata = {
   title: "Nookit | Request Booking",
};

export default async function BookingRequest() {
   const supabase = createServerComponentClient({ cookies });
   const session = await useUserSession(supabase);

   if (!session) {
      redirect("/login");
   }

   return (
      <>
         <RequestForm />
      </>
   );
}
