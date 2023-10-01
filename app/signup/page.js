import { AuthGrid } from "@/components/auth-page/AuthGrid";
import { cookies } from 'next/headers'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserSession } from "@/hooks/server-side/useUserSession";
import { redirect } from "next/navigation";
import SignUp from "@/components/auth-page/SignUp";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nookit | Sign Up",
};

export default async function SignIn() {
  const supabase = createServerComponentClient({ cookies });
  const session = await useUserSession(supabase);

  if (session) {
     redirect("/");
  }

  return (
    <main>
      <AuthGrid>
        <SignUp/>
      </AuthGrid>
    </main>
  );
}
