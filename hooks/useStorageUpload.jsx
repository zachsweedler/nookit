'use clietn'
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export const useStorageUpload = (userId, nookId, isNookPhotos) => {

  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file) => {

    if (userId && nookId) {

      setLoading(true);
      
      const path = `${userId}/nooks/${nookId}/${isNookPhotos ? "nook" : "space"}/${file?.name}`;
      const { data, error } = await supabase.storage
        .from("user-images")
        .upload(path, file, { upsert: true });

      setLoading(false);

      if (error) {
        console.error("Error uploading file", error);
        return null;
      } else {
        console.log("Successfully uploaded file", data);
        return data.path;
      }
    }

    return null;

  };

  return { handleImageUpload, loading };
};