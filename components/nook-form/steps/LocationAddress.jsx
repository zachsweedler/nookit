import React from "react";
import { useFormContext } from "react-hook-form";
import { AddressAutofill } from "@mapbox/search-js-react";
import { autoFillTheme } from "@/styles/mapbox/AutoFillTheme";
import { useDispatch, useSelector } from "react-redux";
import { setFormValues } from "@/slices/nookFormSlice";
import "../../../styles/mapbox/AutoFill.css";
import Input from "@/styles/Input";
import { styled } from "styled-components";
import { Section } from "./Styles";

export default function LocationAddress({id}) {
   const dispatch = useDispatch();

   const {
      formState: { errors },
      register,
      getValues,
      setValue,
   } = useFormContext();

   const reduxFormState = useSelector((state) => state.nookForm.formValues);

   const handleAddressSelect = async (res) => {
      const feature = await res.features[0];
      const {
         geometry: { coordinates },
         properties: {
            full_address,
            address_line1,
            address_level2,
            address_level1,
            country_code,
            postcode,
         },
      } = feature;
      setValue("location_full_address", full_address);
      setValue("location_address", address_line1);
      setValue("location_state_code", address_level1);
      setValue("location_city", address_level2);
      setValue("location_zip", postcode);
      setValue("location_country", country_code);
      setValue("location_longitude", coordinates[0]);
      setValue("location_latitude", coordinates[1]);
      setValue(
         "location_geo_point",
         `POINT(${coordinates[0]} ${coordinates[1]})`
      );
      const {
         location_full_address,
         location_type,
         location_address,
         location_state_code,
         location_city,
         location_zip,
         location_country,
         location_longitude,
         location_latitude,
         location_geo_point,
      } = getValues();
      dispatch(
         setFormValues({
            ...reduxFormState,
            location_full_address,
            location_type,
            location_address,
            location_state_code,
            location_city,
            location_zip,
            location_country,
            location_longitude,
            location_latitude,
            location_geo_point,
         })
      );
   };

   return (
      <Section id={id}>
         <AddressAutofill
            accessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
            onRetrieve={(res) => handleAddressSelect(res)}
            theme={autoFillTheme}
            options={{ language: "en" }}
            style={{ width: "inherit" }}
         >
            <Input
               fieldName="location_full_address"
               label="Address"
               register={register}
               errors={errors}
            />
         </AddressAutofill>
         <input type="hidden" {...register("location_address")} />
         <input type="hidden" {...register("location_state_code")} />
         <input type="hidden" {...register("location_city")} />
         <input type="hidden" {...register("location_country")} />
         <input type="hidden" {...register("location_longitude")} />
         <input type="hidden" {...register("location_latitude")} />
         <input type="hidden" {...register("location_geo_point")} />
      </Section>
   );
}


