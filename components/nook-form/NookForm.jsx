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
import NookPrice from "./steps/NookPrice";
import NookImages from "./steps/NookImages";
import { Button } from "@/styles/Buttons";
import { useCompanyId } from "@/hooks/client-side/useCompanyId";
import { restartForm } from "@/slices/nookFormSlice";
import { useUserId } from "@/hooks/client-side/useUserId";
import MissingCompanyInfo from "./steps/MissingCompanyInfo";
import LocationAbout from "./steps/LocationAbout";

export default function NookForm() {
   const { location_images, images, price_type, ...formValuesRedux } =
      useSelector((state) => state.nookForm.formValues);
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const router = useRouter();
   const supabase = createClientComponentClient();
   const companyId = useCompanyId(supabase);
   const userId = useUserId(supabase);
   const [nullCompanyFields, setNullCompanyFields] = useState([]);
   const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
   const [customerId, setCustomerId] = useState();

   const validationSchema = yup.object().shape({
      first_name: yup.string().when([], {
         is: () => nullCompanyFields.includes("first_name"),
         then: () => yup.string().required("First name is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      last_name: yup.string().when([], {
         is: () => nullCompanyFields.includes("last_name"),
         then: () => yup.string().required("Last name is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      name: yup.string().when([], {
         is: () => nullCompanyFields.includes("name"),
         then: () => yup.string().required("Company name is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      website: yup.string().when([], {
         is: () => nullCompanyFields.includes("website"),
         then: () =>
            yup
               .string()
               .url("Please enter a valid URL.")
               .required("Website is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      industry: yup.string().when([], {
         is: () => nullCompanyFields.includes("industry"),
         then: () => yup.string().required("Industry is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      existing_customer: yup.string().when([], {
         is: () => !hasPaymentMethod,
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
      if (nullCompanyFields.length > 0) {
         const upsertMissingCompanyData = {
            id: companyId,
            user_id: userId,
         };
         const fieldsToCheck = [
            "first_name",
            "last_name",
            "name",
            "website",
            "industry",
         ];
         fieldsToCheck.forEach((key) => {
            if (formData[key] !== undefined) {
               upsertMissingCompanyData[key] = formData[key];
            }
         });
         const { error: companyError } = await supabase
            .from("company_profiles")
            .upsert(upsertMissingCompanyData);

         if (companyError) {
            console.log("error upserting company data", companyError);
         }
      }
      const { error } = await supabase.from("nooks").upsert({
         id: formValuesRedux.id,
         status: "listed",
         company_id: companyId,
         user_id: userId,
         price: formValuesRedux.price,
         price_type: formValuesRedux.price_type,
         description: formValuesRedux.description,
         images: formState.images,
         blocked_dates: formValuesRedux.blocked_dates,
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
         location_about: formValuesRedux.location_about,
         location_images: formState.location_images,
      });
      if (error) {
         console.log("error inserting nook", error);
         setLoading(false);
      } else {
         localStorage.removeItem("nookUUID");
         setLoading(false);
         dispatch(restartForm());
         router.push("/my-nooks");
      }
   };

   const locationMenu = [
      "Name",
      "Address",
      "Type",
      "Capacity",
      "Location Images",
      "Amenities",
   ];
   const nookMenu = ["Pricing", "About", "Nook Images"];

   // fetch missing company profile fields
   useEffect(() => {
      const orderedFields = [
         "logo",
         "first_name",
         "last_name",
         "name",
         "industry",
         "website",
      ];
      const fetchNullCompanyData = async () => {
         if (userId) {
            const { data, error } = await supabase
               .from("company_profiles")
               .select("name, website, industry, logo, first_name, last_name")
               .eq("user_id", userId);
            if (error) {
               console.log(error);
            } else {
               const nullFields = [];
               orderedFields.forEach((field) => {
                  if (data[0][field] === null) {
                     nullFields.push(field);
                  }
               });
               setNullCompanyFields(nullFields);
            }
         }
      };
      fetchNullCompanyData();
      if (userId) {
         const checkCustomerExists = async () => {
            const { data, error } = await supabase
               .from("stripe_customers")
               .select("customer_id")
               .eq("user_id", userId);
            if (error) {
               console.log("error getting customer Id", error);
            } else {
               if (data && data.length > 0) {
                  console.log("customer id data", data);
                  setCustomerId(data[0].customer_id);
               }
            }
         };
         checkCustomerExists();
      }
      if (customerId) {
         const getPaymentMethods = async () => {
            const response = await fetch(
               `${window.location.origin}/api/list-customer-payment-methods`,
               {
                  method: "GET",
                  headers: {
                     "Content-Type": "application/json",
                     "X-Customer-Id": customerId,
                  },
               }
            );
            const res = await response.json();
            if (!res.success) {
               console.log("error getting payment methods", res.message);
            } else {
               const hasMethods = res.data.length > 0;
               setHasPaymentMethod(hasMethods);
               methods.setValue("existing_customer", hasMethods);
            }
         };
         getPaymentMethods();
      }
   }, [userId, customerId, supabase, methods]);

   const scrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) {
         element.scrollIntoView({ behavior: "smooth" }, true);
      }
   };

   return (
      <Container
         size="xl"
         style={{ marginTop: "120px", marginBottom: "120px" }}
      >
         <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
               <MainGrid>
                  <SectionGrid>
                     {nullCompanyFields.length > 0 && (
                        <FormGrid>
                           <LocationTrack>
                              <StickyHeader
                                 size="textmd"
                                 $weight="semibold"
                                 color="primary.brand.b600"
                              >
                                 COMPANY
                              </StickyHeader>
                           </LocationTrack>
                           <Steps>
                              <MissingCompanyInfo
                                 nullCompanyFields={nullCompanyFields}
                              />
                           </Steps>
                        </FormGrid>
                     )}
                     <FormGrid>
                        <LocationTrack>
                           <StickyHeader
                              size="textmd"
                              $weight="semibold"
                              color="primary.brand.b600"
                           >
                              LOCATION
                           </StickyHeader>
                        </LocationTrack>
                        <Steps>
                           <LocationName id="Name" />
                           <LocationAddress id="Address" />
                           <LocationType id="Type" />
                           <LocationCapacity id="Capacity" />
                           <LocationAbout id="About" />
                           <LocationImages id="Location Images" />
                           <LocationAmenities id="Amenities" />
                        </Steps>
                     </FormGrid>
                     <FormGrid>
                        <NookTrack>
                           <StickyHeader
                              size="textmd"
                              $weight="semibold"
                              color="primary.brand.b600"
                           >
                              NOOK
                           </StickyHeader>
                        </NookTrack>
                        <Steps>
                           <NookPrice
                              id="Pricing"
                              priceType={price_type}
                              hasPaymentMethod={hasPaymentMethod}
                           />
                           <NookImages id="Nook Images" />
                           <Button type="submit" $brandcolor={true}>
                              {loading ? "Uploading..." : "Publish Nook"}
                           </Button>
                        </Steps>
                     </FormGrid>
                  </SectionGrid>
                  <ContentsTrack>
                     <Contents>
                        <Para size="textmd" $weight="semibold">
                           Location
                        </Para>
                        <ContentMenu>
                           {locationMenu.map((item, index) => (
                              <ContentMenuItem
                                 onClick={() => scrollToSection(item)}
                                 key={index}
                                 size="textmd"
                                 $weight="regular"
                              >
                                 {item}
                              </ContentMenuItem>
                           ))}
                        </ContentMenu>
                        <Divider />
                        <Para size="textmd" $weight="semibold">
                           Location&apos;s Nook
                        </Para>
                        <ContentMenu>
                           {nookMenu.map((item, index) => (
                              <ContentMenuItem
                                 onClick={() => scrollToSection(item)}
                                 key={index}
                                 size="textmd"
                                 $weight="regular"
                              >
                                 {item}
                              </ContentMenuItem>
                           ))}
                        </ContentMenu>
                     </Contents>
                  </ContentsTrack>
               </MainGrid>
            </form>
         </FormProvider>
      </Container>
   );
}

const MainGrid = styled.div`
   display: grid;
   grid-template-columns: 1fr auto;
   grid-column-gap: 100px;
   height: auto;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-column-gap: 0px;
   }
`;

const SectionGrid = styled.div`
   display: flex;
   flex-direction: column;
   height: auto;
   row-gap: 100px;
`;

const FormGrid = styled.div`
   display: grid;
   grid-template-columns: 80px 1fr;
   column-gap: 100px;
   flex-direction: column;
   align-items: start;
   height: 100%;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
      grid-row-gap: 50px;
   }
`;

const NookTrack = styled.div`
   display: flex;
   flex-direction: column;
   align-items: start;
   height: 100%;
   position: relative;
`;

const LocationTrack = styled(NookTrack)``;

const StickyHeader = styled(Para)`
   position: sticky;
   top: 120px;
`;

const Steps = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 70px;
   width: 100%;
`;

const ContentsTrack = styled(NookTrack)`
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;

const Contents = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 25px;
   padding: 30px;
   background-color: ${({ theme }) => theme.color.primary.brand.b25};
   border-radius: 12px;
   overflow: hidden;
   border: 1px solid ${({ theme }) => theme.color.primary.grey.g50};
   box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.045);
   position: sticky;
   top: 120px;
`;

const ContentMenu = styled.div`
   display: flex;
   flex-direction: column;
   padding: 0px;
   width: 300px;
`;

const ContentMenuItem = styled(Para)`
   padding: 6px 12px;
   border-radius: 5px;
   &:hover {
      background-color: ${({ theme }) => theme.color.primary.brand.b925};
      cursor: pointer;
   }
`;
