import { AuthGrid } from "@/components/pages-auth/AuthGrid";
import SignInForm from "@/components/pages-auth/SignInForm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";
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
        <SignInForm/>
      </AuthGrid>
    </main>
  );
}
