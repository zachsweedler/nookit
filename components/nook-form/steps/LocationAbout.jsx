import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setFormValues } from "@/slices/nookFormSlice";
import Textarea from "@/styles/Textarea";
import { Section } from "./Styles";

export default function LocationAbout({id}) {
   const dispatch = useDispatch();

   const {
      formState: { errors },
      register,
      watch,
   } = useFormContext();

   const about = watch("location_about");

   useEffect(() => {
      dispatch(setFormValues({ location_about: about }));
   }, [about, dispatch]);

   return (
      <Section id={id}>
         <Textarea
            fieldName="location_about"
            label="About Your Location"
            register={register}
            errors={errors}
            id={id}
         />
      </Section>
   );
}
