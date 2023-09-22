import FormTabs from "@/components/account-page/payments-payouts/FormTabs";
import { useUserSession } from "@/hooks/server-side/useUserSession";
import Container from "@/styles/Containers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
export const dynamic = 'force-dynamic'

export default async function PaymentsPayouts() {

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
         <FormTabs />
      </Container>
   );
}
