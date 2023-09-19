import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setFormValues } from "@/slices/nookFormSlice";
import Textarea from "@/styles/Textarea";
import { Section } from "./Styles";

export default function NookAbout({id}) {
   const dispatch = useDispatch();

   const {
      formState: { errors },
      register,
      watch,
   } = useFormContext();

   const about = watch("about");

   useEffect(() => {
      dispatch(setFormValues({ about: about }));
   }, [about, dispatch]);

   return (
      <Section id={id}>
         <Textarea
            fieldName="about"
            label="About"
            register={register}
            errors={errors}
            id={id}
         />
      </Section>
   );
}
