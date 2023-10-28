"use client";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Container from "@/styles/Containers";
import { Para } from "@/styles/Typography";
import { Divider } from "@/styles/mui/Divider";
import { styled } from "styled-components";
import LocationAddress from "./steps/LocationAddress";
import LocationName from "./steps/LocationName";
import LocationCapacity from "./steps/LocationCapacity";
import LocationType from "./steps/LocationType";
import LocationImages from "./steps/LocationImages";
import LocationAmenities from "./steps/LocationAmenities";
import LocationAbout from "./steps/LocationAbout";
import NookPrice from "./steps/NookPrice";
import NookImages from "./steps/NookImages";
import MissingProfileInfo from "./steps/MissingProfileInfo";
import { Button } from "@/styles/Buttons";
import { useProfileId } from "@/hooks/client-side/useProfileId";
import { useUserId } from "@/hooks/client-side/useUserId";
import { restartForm } from "@/slices/nookFormSlice";

export default function NookForm() {
   const formValuesRedux = useSelector((state) => state.nookForm.formValues);
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const router = useRouter();
   const supabase = createClientComponentClient();
   const profileId = useProfileId(supabase);
   const userId = useUserId(supabase);
   const profileFields = useProfile();
   const [nullProfileFields, setNullProfileFields] = useState([]);
   const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
   const [customerId, setCustomerId] = useState();

   const validationSchema = yup.object().shape({
      first_name: yup.string().when([], {
         is: () => nullProfileFields.includes("first_name"),
         then: () => yup.string().required("First name is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      last_name: yup.string().when([], {
         is: () => nullProfileFields.includes("last_name"),
         then: () => yup.string().required("Last name is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      name: yup.string().when([], {
         is: () => nullProfileFields.includes("name"),
         then: () => yup.string().required("Profile name is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      website: yup.string().when([], {
         is: () => nullProfileFields.includes("website"),
         then: () =>
            yup
               .string()
               .url("Please enter a valid URL.")
               .required("Website is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      industry: yup.string().when([], {
         is: () => nullProfileFields.includes("industry"),
         then: () => yup.string().required("Industry is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      existing_customer: yup.string().when([], {
         is: () =>
            !hasPaymentMethod && formValuesRedux.price_type === "salesPercent",
         then: () =>
            yup
               .string()
               .required("Payment method required for this type of listing."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      images: yup
         .array()
         .min(3, "Please upload at least 3 photo of your nook")
         .required("This field is required."),
      price: yup
         .string()
         .when("price_type", {
            is: "salesPercent",
            then: () =>
               yup
                  .number()
                  .typeError("Invalid number format")
                  .min(1, "Percent should be at least 1%.")
                  .max(100, "Percent should not exceed 100%."),
            otherwise: () =>
               yup
                  .number("Invalid number format")
                  .typeError("Invalid number format")
                  .min(1, "Price per day should be at least $1"),
         })
         .required("Price is required."),
      location_name: yup.string().required("Name is required."),
      location_about: yup.string().required("Description is required."),
      location_type: yup.string().required("Location type is required."),
      location_amenities: yup
         .array()
         .of(yup.string())
         .required("Amenities are required."),
      location_full_address: yup
         .string()
         .min(5, "Address should be at least 5 characters long")
         .max(100, "Address should not exceed 100 characters")
         .matches(/^[0-9a-zA-Z\s,-.'#/]+$/, "Invalid address format")
         .required("This field is required"),
      location_images: yup
         .array()
         .min(5, "Please upload at least 5 photo of your overall location")
         .required("This field is required."),
      location_max_capacity: yup.string().required("Max capacity is required"),
   });

   const methods = useForm({
      mode: "onChange",
      resolver: yupResolver(validationSchema),
      defaultValues: formValuesRedux,
   });

   const onSubmit = async (formState) => {
      setLoading(true);
      if (nullProfileFields.length > 0) {
         const upsertMissingProfileData = {
            id: profileId,
            user_id: userId,
         };
         const fieldsToCheck = [
            "first_name",
            "last_name",
            "name",
            "type",
            "about",
            "website",
            "industry",
         ];
         fieldsToCheck.forEach((key) => {
            if (formData[key] !== undefined) {
               upsertMissingProfileData[key] = formData[key]; // appends to array
            }
         }); 
         const { error: profileError } = await supabase
            .from("profiles")
            .upsert(upsertMissingProfileData);
         if (profileError) {
            console.log("error upserting profile data", profileError);
         }
      }
      const { data: locationData, error: locationError } = await supabase
         .from("locations")
         .upsert({
            location_name: formValuesRedux.location_name,
            location_amenities: formValuesRedux.location_amenities,
            location_max_capacity: formValuesRedux.location_max_capacity,
            location_type: formValuesRedux.location_type,
            location_full_address: formValuesRedux.location_full_address,
            location_address: formValuesRedux.location_address,
            location_state_code: formValuesRedux.location_state_code,
            location_city: formValuesRedux.location_city,
            location_zip: formValuesRedux.location_zip,
            location_country: formValuesRedux.location_country,
            location_longitude: formValuesRedux.location_longitude,
            location_latitude: formValuesRedux.location_latitude,
            location_geo_point: formValuesRedux.location_geo_point,
         });
      if (locationError) {
         console.log("error inserting locations", error);
         setLoading(false);
      }
      const { error: nookError } = await supabase.from("nooks").upsert({
         id: formValuesRedux.id,
         status: "listed",
         location_id: locationData[0]?.id,
         profile_id: profileId,
         user_id: userId,
         price: formValuesRedux.price,
         price_type: formValuesRedux.price_type,
         description: formValuesRedux.description,
         blocked_dates: formValuesRedux.blocked_dates,
      });
      if (nookError) {
         console.log("error inserting nook", error);
         setLoading(false);
      } else {
         localStorage.removeItem("nookUUID");
         setLoading(false);
         dispatch(restartForm());
         router.push("/my-nooks");
      }
   };
}
