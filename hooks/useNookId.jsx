'use client'
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

export const useNookUUID = () => {
  const [nookId, setNookId] = useState(null);

  useEffect(() => {
    const storedUUID = localStorage.getItem("nookUUID");
    if (storedUUID) {
      setNookId(storedUUID);
    } else {
      const newUUID = uuid();
      localStorage.setItem("nookUUID", newUUID);
      setNookId(newUUID);
    }
  }, []);

  return nookId;
};