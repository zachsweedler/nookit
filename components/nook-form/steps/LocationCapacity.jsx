import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import Input from "@/styles/Input";
import { setFormValues } from "@/slices/nookFormSlice";
import { Section } from "./Styles";

export default function LocationCapacity({id}) {
   const dispatch = useDispatch();

   const {
      formState: { errors },
      register,
      watch,
   } = useFormContext();

   const locationMaxCapacity = watch("location_max_capacity");
   useEffect(() => {
      dispatch(setFormValues({ location_max_capacity: locationMaxCapacity }));
   }, [locationMaxCapacity, dispatch]);

   return (
      <Section id={id}>
         <Input
            id={id}
            fieldName="location_max_capacity"
            label="Max Capacity (ppl.)"
            register={register}
            errors={errors}
         />
      </Section>
   );
}
