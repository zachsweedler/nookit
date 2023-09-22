import { AuthGrid } from "@/components/auth-page/AuthGrid";
import AuthForm from "@/components/auth-page/AuthForm";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nookit | Sign In / Sign Up",
};

export default async function SignIn() {

  return (
    <main>
      <AuthGrid>
        <AuthForm/>
      </AuthGrid>
    </main>
  );
}
