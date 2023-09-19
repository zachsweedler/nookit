import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import Input from "@/styles/Input";
import { setFormValues } from "@/slices/nookFormSlice";
import { Section } from "./Styles";
import { Para } from "@/styles/Typography";

export default function NookPrice({ id }) {
   const dispatch = useDispatch();

   const {
      formState: { errors },
      register,
      watch,
   } = useFormContext();

   const price = watch("daily_rate");
   useEffect(() => {
      dispatch(setFormValues({ daily_rate: price }));
   }, [price, dispatch]);

   return (
      <Section id={id}>
         <Input
            fieldName="daily_rate"
            label="Daily Booking Rate"
            adornmentLeft={(<Para size="textmd" weight="regular">$</Para>)}
            register={register}
            errors={errors}
            id={id}
         />
      </Section>
   );
}
