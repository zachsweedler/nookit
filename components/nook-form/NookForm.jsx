"use client";
import React, { useState } from "react";
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
import NookAbout from "./steps/NookAbout";
import NookPrice from "./steps/NookPrice";
import NookImages from "./steps/NookImages";
import { Button } from "@/styles/Buttons";
import { useCompanyId } from "@/hooks/client-side/useCompanyId";
import { restartForm } from "@/slices/nookFormSlice";
import { useUserId } from "@/hooks/client-side/useUserId";

export default function NookForm() {
   const formValuesRedux = useSelector((state) => state.nookForm.formValues);
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const router = useRouter();
   const supabase = createClientComponentClient();
   const companyId = useCompanyId(supabase);
   const userId = useUserId(supabase);

   const validationSchema = yup.object().shape({
      about: yup.string().required("Description is required."),
      images: yup
         .array()
         .min(3, "Please upload at least 3 photo of your nook")
         .required("This field is required."),
      daily_rate: yup.string().required("Daily rate is required."),
      location_name: yup.string().required("Name is required."),
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
      setLoading;
      const { data, error } = await supabase.from("nooks").upsert({
         id: formValuesRedux.id,
         status: "listed",
         company_id: companyId,
         user_id: userId,
         about: formValuesRedux.about,
         daily_rate: formValuesRedux.daily_rate,
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

   const locationMenu = ["Name", "Address", "Type", "Capacity", "Location Images", "Amenities"];
   const nookMenu = ["Daily Rate", "About", "Nook Images"];

   const scrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) {
         element.scrollIntoView({ behavior: 'smooth'}, true);
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
                           <LocationName id='Name'/>
                           <LocationAddress id='Address'/>
                           <LocationType  id='Type'/>
                           <LocationCapacity  id='Capacity'/>
                           <LocationImages  id='Location Images' />
                           <LocationAmenities  id='Amenities' />
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
                           <NookPrice id='Daily Rate'/>
                           <NookAbout id='About'/>
                           <NookImages id='Nook Images'/>
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
                                 onClick={()=>scrollToSection(item)}
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
                                 onClick={()=>scrollToSection(item)}
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
      background-color:  ${({theme})=> theme.color.primary.brand.b925};
      cursor: pointer;
   }
`;
