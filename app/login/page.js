import { AuthGrid } from "@/components/auth-page/AuthGrid";
import { cookies } from 'next/headers'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserSession } from "@/hooks/server-side/useUserSession";
import { redirect } from "next/navigation";
import Login from "@/components/auth-page/Login";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nookit | Login",
};

export default async function LogIn() {
  const supabase = createServerComponentClient({ cookies });
  const session = await useUserSession(supabase);

  if (session) {
     redirect("/");
  }

  return (
    <main>
      <AuthGrid>
        <Login/>
      </AuthGrid>
    </main>
  );
}
