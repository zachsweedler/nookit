import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { useUserSession } from "./useUserSession";

export const useProfileId = async () => {

   const supabase = createServerComponentClient({ cookies });

   const session = await useUserSession(supabase)

   const {data} = await supabase.from('profiles').select('id').eq('user_id', session?.user?.id)

   const profileId = data && data.length > 0 ? data[0].id : [];

   return profileId;

};
