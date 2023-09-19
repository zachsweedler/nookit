import React from "react";
import { useFormContext } from "react-hook-form";
import SearchInput from "@/styles/SearchInput";
import { locationTypes } from "@/utils/locationTypes";
import { Section } from "./Styles";

export default function LocationType({id}) {
   const {
      formState: { errors },
      register,
      watch,
      setValue,
   } = useFormContext();

   return (
      <Section id={id}>
         <SearchInput
            fieldName="location_type"
            label="Location Type"
            register={register}
            errors={errors}
            results={locationTypes}
            setValue={setValue}
            watch={watch}
            id={id}
         />
      </Section>
   );
}
