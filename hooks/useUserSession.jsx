"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export const useUserSession = () => {
   const [session, setSession] = useState(null);

   useEffect(() => {
      const fetchSession = async () => {
         const {
            data: { session },
         } = await supabase.auth.getSession();
         if (session) {
            setSession(true);
         } else {
            setSession(false);
         }
      };
      fetchSession();
   }, []);

   return session;
};
