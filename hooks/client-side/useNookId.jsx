"use client";
import { setNookId } from "@/slices/nookFormSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

export const useNookUUID = () => {
   const dispatch = useDispatch();
   const { id } = useSelector((state) => state.nookForm.formValues);

   useEffect(() => {
      const storedUUID = localStorage.getItem("nookUUID");
      if (id) {
         dispatch(setNookId(id));
      } else if (storedUUID) {
         dispatch(setNookId(storedUUID));
      } else {
         const newUUID = uuid();
         localStorage.setItem("nookUUID", newUUID);
         dispatch(setNookId(newUUID));
      }
   }, [dispatch, id]);

   return id;
};
