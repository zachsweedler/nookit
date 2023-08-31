"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export const useWaitlistId = () => {
   const [waitlistId, setWaitlistId] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         if (user) {
            const { data } = await supabase
               .from("waitlist")
               .select("id")
               .eq("user_id", user?.id);
            setWaitlistId(data[0]?.id);
         }
      };
      fetchData();
   }, []);

   return waitlistId;
};
