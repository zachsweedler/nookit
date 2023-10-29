"use client";
import { setLocationId } from "@/slices/nookFormSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

export const useLocationUUID = () => {
   const dispatch = useDispatch();
   const { location_id } = useSelector((state) => state.nookForm.formValues);

   useEffect(() => {
      const storedUUID = localStorage.getItem("locationUUID");
      if (location_id) {
         dispatch(setLocationId(location_id));
      } else if (storedUUID) {
         dispatch(setLocationId(storedUUID));
      } else {
         const newUUID = uuid();
         localStorage.setItem("locationUUID", newUUID);
         dispatch(setLocationId(newUUID));
      }
   }, [dispatch, location_id]);
   return location_id;
};
