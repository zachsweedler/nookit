import ProfileForm from "@/components/account-page/profile-form/ProfileForm";
import { useUserSession } from "@/hooks/server-side/useUserSession";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
export const dynamic = 'force-dynamic'

export default async function Profile () {

    const supabase = createServerComponentClient({ cookies });
    const session = await useUserSession(supabase);
 
    if (!session) {
       redirect("/login");
    }

    return (
        <>
           <ProfileForm/>
        </>
    )
}

