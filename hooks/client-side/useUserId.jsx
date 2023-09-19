'use client'
import { useState, useEffect } from "react";

export const useUserId = (supabase) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
    };

    fetchUser();
  }, [supabase]);

  return userId;
};