import Footer from "@/components/page-home/footer/Footer";
import DashClient from "@/components/waitlist-portal/DashClient";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Nookit | Waitlist",
  };

export default async function Dash() {

  const supabase = createServerComponentClient({ cookies })
  const {
      data: { session },
      error,
  } = await supabase.auth.getSession();
  if (error) {
      console.log("error getting session", error);
  }

//   if (!session) {
//       redirect("/sign-in");
//   }

   return (
    <>
        <DashClient session={session}/>
        <Footer color="brandcolor"/>
    </>
   );
}
