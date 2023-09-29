"use client";
import React from "react";
import Container from "@/styles/Containers";
import { styled } from "styled-components";
import { H5, Para } from "@/styles/Typography";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useUserId } from "@/hooks/client-side/useUserId";
import Input from "@/styles/Input";
import { useForm } from "react-hook-form";
import { CompanyLogoUploader } from "@/components/image-uploaders/company-logo/CompanyLogoUploader";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { industries } from "@/utils/industries";
import Select from "@/styles/Select";
import Textarea from "@/styles/Textarea";
import { Divider } from "@/styles/mui/Divider";
import { Button } from "@/styles/Buttons";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCompanyId } from "@/hooks/client-side/useCompanyId";
import RequestSummary from "./RequestSummary";

export default function RequestForm() {
   const supabase = createClientComponentClient();
   const userId = useUserId(supabase);
   const companyId = useCompanyId(supabase);
   const searchParams = useSearchParams();
   const params = useParams();
   const router = useRouter();
   const [nullCompanyFields, setNullCompanyFields] = useState([]);
   const [draftData, setDraftData] = useState();

   const validationSchema = yup.object().shape({
      guest_questions: yup.string().nullable(),
      guest_plan: yup.string().required("Guest plan is required."),
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
   });

   const {
      formState: { errors },
      register,
      handleSubmit,
   } = useForm({
      mode: "onChange",
      resolver: yupResolver(validationSchema),
      values: draftData
   });

   useEffect(() => {
      const orderedFields = [
         "logo",
         "first_name",
         "last_name",
         "name",
         "industry",
         "website",
      ];

      const checkOwnership = async () => {
         if (userId) {
            const { data } = await supabase
               .from("bookings")
               .select("guest_user_id")
               .eq("id", searchParams.get("id"));
            if (data[0]?.guest_user_id !== userId) {
               console.log("not the guest");
               router.push(`/s/${params.slug}`);
               return false;
            } else {
               return true;
            }
         }
      };

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

      const fetchDraftRequest = async () => {
         const { data, error } = await supabase
            .from("bookings")
            .select(
               "*, nooks(company_id, price, price_type, location_name, location_address, location_city, location_state_code, location_zip)"
            )
            .eq("id", searchParams.get("id"));
         if (error) {
            console.log('error getting draft booking request', error);
         } else {
            setDraftData(data[0]);
         }
      };

      const fetchStatusAndData = async () => {
         const status = await checkOwnership();
         if (!status) return; // Early exit if the user is not the guest of this request
         await fetchNullCompanyData();
         await fetchDraftRequest();
      };

      fetchStatusAndData();
   }, [supabase, params.slug, searchParams, router, userId]);

   const onSubmit = async (formData) => {
      const { error } = await supabase.from("bookings").upsert({
         id: searchParams.get("id"),
         nook_id: params.slug,
         status: "pending", // host then needs to change status to "accepted" or "declined" on bookings page
         guest_questions: formData.guest_questions,
         guest_plan: formData.guest_plan,
      });
      if (error) {
         console.log("error upserting booking request", error);
      }
      if (nullCompanyFields.length > 0) {
         const upsertMissingCompanyData = {
            id: companyId,
            user_id: draftData.guest_user_id,
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
      router.push("/bookings/guest");
   };

   return (
      <Container
         size="lg"
         style={{ marginTop: "140px", marginBottom: "140px" }}
      >
         <Grid>
            <Form onSubmit={handleSubmit(onSubmit)}>
               <Header>
                  <H5 $weight="semibold">Request Booking</H5>
                  <Para
                     size="textmd"
                     $weight="regular"
                     color="primary.grey.g800"
                  >
                     Please fill out the below for to submit your request. No
                     credit card required.
                  </Para>
               </Header>
               {nullCompanyFields.length > 0 && (
                  <FormSection>
                     <Divider />
                     <Header>
                        <Para size="textlg" $weight="semibold">
                           Company Profile
                        </Para>
                        <Para
                           size="textmd"
                           $weight="regular"
                           color="primary.grey.g800"
                        >
                           Please complete your company profile.
                        </Para>
                     </Header>
                     {nullCompanyFields?.map((field, index) => {
                        let label;
                        let component;
                        switch (field) {
                           case "first_name":
                              label = "First Name";
                              component = (
                                 <Input
                                    fieldName={field}
                                    label={label}
                                    register={register}
                                    errors={errors}
                                 />
                              );
                              break;
                           case "last_name":
                              label = "Last Name";
                              component = (
                                 <Input
                                    fieldName={field}
                                    label={label}
                                    register={register}
                                    errors={errors}
                                 />
                              );
                              break;
                           case "name":
                              label = "Company Name";
                              component = (
                                 <Input
                                    fieldName={field}
                                    label={label}
                                    register={register}
                                    errors={errors}
                                 />
                              );
                              break;
                           case "website":
                              label = "Website";
                              component = (
                                 <Input
                                    fieldName={field}
                                    label={label}
                                    register={register}
                                    errors={errors}
                                 />
                              );
                              break;
                           case "industry":
                              label = "Industry";
                              component = (
                                 <Select
                                    fieldName={field}
                                    label={label}
                                    options={industries}
                                    register={register}
                                    errors={errors}
                                 />
                              );
                              break;
                           case "logo":
                              component = <CompanyLogoUploader />;
                              break;
                        }
                        return <div key={index}>{component}</div>;
                     })}
                  </FormSection>
               )}
               <FormSection>
                  <Divider />
                  <Header>
                     <Para size="textlg" $weight="semibold">
                        Plan
                     </Para>
                     <Para
                        size="textmd"
                        $weight="regular"
                        color="primary.grey.g800"
                     >
                        Tell the host what you plan to do with the nook. Be
                        specific.
                     </Para>
                  </Header>
                  <Textarea
                     fieldName="guest_plan"
                     register={register}
                     errors={errors}
                     placeholder="Type your plan here..."
                  />
               </FormSection>
               <FormSection>
                  <Divider />
                  <Header>
                     <Para size="textlg" $weight="semibold">
                        Questions 
                     </Para>
                     <Para
                        size="textmd"
                        $weight="regular"
                        color="primary.grey.g800"
                     >
                        Optional: Any questions for the host? 
                     </Para>
                  </Header>
                  <Textarea
                     fieldName="guest_questions"
                     register={register}
                     errors={errors}
                     placeholder="Type your questions here..."
                  />
               </FormSection>
               <RequestButton>
                  <Button type="submit" $brandcolor={true}>
                     Request Booking
                  </Button>
                  <Para
                     size="textsm"
                     $weight="medium"
                     color="primary.brand.b600"
                  >
                     You won&apos;t be charged yet
                  </Para>
               </RequestButton>
            </Form>
            <RequestSummary draftData={draftData} />
         </Grid>
      </Container>
   );
}

const Grid = styled.div`
   display: grid;
   grid-template-columns: 1fr auto;
   grid-template-rows: 1fr;
   grid-column-gap: 100px;
   height: auto;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: flex;
      flex-direction: column;
      row-gap: 50px;
   }
`;

const Form = styled.form`
   display: flex;
   flex-direction: column;
   row-gap: 70px;
   height: auto;
`;

const FormSection = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 40px;
`;

const Header = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 4px;
`;

const RequestButton = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 9px;
   justify-content: center;
   align-items: center;
   width: 100%;
`;
