"use client";
import { useState, useEffect } from "react";

export const useProfileId = (supabase) => {
   const [profileId, setProfileId] = useState();
   
   useEffect(() => {
      const fetchProfile = async () => {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         if (user) {
            const { data } = await supabase
               .from("profiles")
               .select("id")
               .eq("user_id", user?.id);
            setProfileId(data[0].id);
         }
      };
      fetchProfile();
   }, [supabase]);

   return profileId;
};
