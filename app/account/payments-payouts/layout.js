import { useUserSession } from "@/hooks/server-side/useUserSession";
import Container from "@/styles/Containers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
import PayPayoutTabs from "@/components/account-page/payments-payouts/PayPayoutTabs";
export const dynamic = 'force-dynamic'

export default async function PaymentsPayouts({children}) {

   const supabase = createServerComponentClient({ cookies });
   const session = await useUserSession(supabase);

   if (!session) {
      redirect("/login");
   }

   return (
      <Container
         size="md"
         style={{
            margin: "130px auto",
            display: "flex",
            flexDirection: "column",
            rowGap: "50px",
         }}
      >
         <PayPayoutTabs />
         {children}
      </Container>
   );
}
