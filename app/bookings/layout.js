import { useUserSession } from "@/hooks/server-side/useUserSession";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import BookingsTabs from "@/components/bookings-page/BookingTabs";
import Container from "@/styles/Containers";
export const dynamic = "force-dynamic";

export default async function Bookings({ children }) {
   const supabase = createServerComponentClient({ cookies });
   const session = await useUserSession(supabase);

   if (!session) {
      redirect("/login");
   }

   return (
      <Container
         size="xl"
         style={{
            margin: "130px auto",
            display: "flex",
            flexDirection: "column",
            rowGap: "50px",
         }}
      >
         <BookingsTabs />
         {children}
      </Container>
   );
}
