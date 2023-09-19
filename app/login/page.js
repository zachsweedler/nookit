import { AuthGrid } from "@/components/auth-page/AuthGrid";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import AuthForm from "@/components/auth-page/AuthForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nookit | Sign In / Sign Up",
};

export default async function SignIn() {

  const supabase = createServerComponentClient({ cookies })
  const { data: {session}} = await supabase.auth.getSession();
  
  if (session) {
    redirect('/')
  }

  return (
    <main>
      <AuthGrid>
        <AuthForm/>
      </AuthGrid>
    </main>
  );
}
