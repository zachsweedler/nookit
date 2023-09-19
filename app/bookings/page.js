import { useUserSession } from "@/hooks/server-side/useUserSession";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
import BookingsTabs from "@/components/bookings-page/BookingTabs";

export const dynamic = "force-dynamic";

export default async function Bookings() {
   const supabase = createServerComponentClient({ cookies });
   const session = await useUserSession(supabase);

   if (!session) {
      redirect("/login");
   }

    return (
        <>
         <BookingsTabs/>
        </>
    )
}



