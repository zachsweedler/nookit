import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Members () {

    const supabase = createServerComponentClient({ cookies })

    const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.log("error getting session", error);
      }
    
      if (!session) {
        redirect('/sign-in')
      } 
    
      const { data, error: statusError } = await supabase
        .from("waitlist")
        .select("is_submitted")
        .eq("user_id", session?.user?.id);
      if (statusError) {
        console.log("error getting avatar", statusError);
      } else {
        console.log("status submitted", data);
      }
    
      const status = data && data.length > 0 ? data[0].status : null;
    
      if (!status) {
        redirect('/apply/dash')
      }

    return <></>
}