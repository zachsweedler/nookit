import NookForm from "@/components/nook-form/NookForm";
import { useUserSession } from "@/hooks/server-side/useUserSession";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

export const metadata = {
   title: "Nookit | View My Nook",
};

export default async function ViewMyNook() {
   const supabase = createServerComponentClient({ cookies });
   const session = await useUserSession(supabase);

   if (!session) {
      redirect("/login");
   }

   return (
      <>
         <NookForm />
      </>
   );
}
