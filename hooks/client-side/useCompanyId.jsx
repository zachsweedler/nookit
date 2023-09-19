"use client";
import { useState, useEffect } from "react";

export const useCompanyId = (supabase) => {
   const [companyId, setCompanyId] = useState();
   
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
            setCompanyId(data[0].id);
         }
      };
      fetchCompany();
   }, [supabase]);

   return companyId;
};
