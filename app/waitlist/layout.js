import React from "react";
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function Apply({ children }) {

    const supabase = createServerComponentClient({ cookies })

    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();
    if (error) {
        console.log("error getting session", error);
    }

    if (!session) {
        redirect("/sign-in");
    }

    return <>{session && <>{children}</>}</>;
}

export default Apply;
