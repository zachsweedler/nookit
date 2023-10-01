import { AuthGrid } from "@/components/auth-page/AuthGrid";
import ForgotPass from "@/components/auth-page/ForgotPass";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nookit | Forgot Password",
};

export default async function LogIn() {
  return (
    <main>
      <AuthGrid>
        <ForgotPass/>
      </AuthGrid>
    </main>
  );
}
