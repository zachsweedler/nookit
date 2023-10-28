import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import Input from "@/styles/Input";
import { setFormValues } from "@/slices/nookFormSlice";
import { Section } from "./Styles";

export default function LocationName({id}) {
   
   const dispatch = useDispatch();
   const {
      formState: { errors },
      register,
      watch,
   } = useFormContext();

   const locationName = watch("location_name");

   useEffect(() => {
      dispatch(setFormValues({ location_name: locationName }));
   }, [locationName, dispatch]);

   return (
      <Section id={id}>
         <Input
            fieldName="location_name"
            label="Location Name"
            register={register}
            errors={errors}
            id={id}
         />
      </Section>
   );
}
