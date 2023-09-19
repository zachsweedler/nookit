"use client";
import { useState, useEffect } from "react";

export const useCustomerId = (supabase) => {
   const [customerId, setCustomerId] = useState(null);
   
   useEffect(() => {
      const fetchCustomerId = async () => {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         if (user) {
            const { data } = await supabase
               .from("stripe_customers")
               .select("customer_id")
               .eq("user_id", user?.id);
            setCustomerId(data[0]?.id);
         }
      };
      fetchCustomerId();
   }, [supabase]);

   return customerId;
};
