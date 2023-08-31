"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export const useCompanyId = () => {
   const [companyId, setCompanyId] = useState(null);

   useEffect(() => {
      const fetchCompany = async () => {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         if (user) {
            const { data } = await supabase
               .from("company_profiles")
               .select("id")
               .eq("user_id", user?.id);
            setCompanyId(data[0]?.id);
         }
      };

      fetchCompany();
   }, []);

   return companyId;
};
