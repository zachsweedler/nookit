import Booking from "@/components/bookings-page/view-booking/Booking";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
import { useUserSession } from "@/hooks/server-side/useUserSession";

export default async function ViewBooking () {

    const supabase = createServerComponentClient({ cookies });
    const session = await useUserSession(supabase);
 
    if (!session) {
       redirect("/login");
    }

    return (
        <>
            <Booking/>
        </>
    )
}
