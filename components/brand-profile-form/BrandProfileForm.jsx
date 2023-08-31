"use client";
import { Button } from "@/styles/Buttons";
import { Input } from "@/styles/Input";
import { Para } from "@/styles/Typography";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { styled } from "styled-components";
import * as yup from "yup";
import { InputErrorWrap } from "../waitlist-portal/apply-form/Styled";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { CompanyLogoUploader } from "../image-uploaders/company-logo/CompanyLogoUploader";
import Snackbar from "@/styles/Snackbar";
import Container from "@/styles/Containers";
import { Divider } from "@mui/joy";

export default function BrandProfileForm() {
   const supabase = createClientComponentClient();
   const [userId, setUserId] = useState();
   const [companyId, setCompanyId] = useState();
   const [formValues, setFormValues] = useState();
   const [success, setSuccess] = useState();
   const [loading, setLoading] = useState();

   const validationSchema = yup.object().shape({
      first_name: yup.string().nullable(),
      last_name: yup.string().nullable(),
      company_name: yup.string().required("This is a required field."),
      company_website: yup.string().required("This is a required field."),
   });

   useEffect(() => {
      const getData = async () => {
         const { data, error } = await supabase.auth.getUser();
         if (error) {
            console.error("error getting user", error);
         } else {
            setUserId(data.user.id);
         }
         if (userId) {
            const { data: companyData, error: errorCompanyData } =
               await supabase
                  .from("company_profiles")
                  .select("name, website, id")
                  .eq("user_id", userId);
            if (errorCompanyData) {
               console.error("error getting user", errorCompanyData);
            }
            if (companyData && data) {
               setCompanyId(companyData[0]?.id || "");
               setFormValues({
                  first_name: data?.user?.user_metadata?.first_name || "",
                  last_name: data?.user?.user_metadata?.last_name || "",
                  email: data?.user?.email || "",
                  company_name: companyData[0]?.name || "",
                  company_website: companyData[0]?.website || "",
               });
            }
         }
      };
      getData();
   }, [supabase, userId]);

   const {
      control,
      formState: { errors, isDirty },
      handleSubmit,
   } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: {
         first_name: "",
         last_name: "",
         email: "",
         company_name: "",
         company_website: "",
      },
      values: formValues,
   });

   const onSubmit = async (formState) => {
      setLoading(true);
      setSuccess(null);
      const { error } = await supabase.from("company_profiles").upsert({
         id: companyId,
         name: formState.company_name,
         website: formState.company_website,
      });
      if (error) {
         console.error("error updating company profile", error);
      }
      const { error: errorUserData } = await supabase.auth.updateUser({
         data: {
            first_name: formState.first_name,
            last_name: formState.last_name,
         },
      });
      if (errorUserData) {
         setLoading(false);
         console.error("error updating user", errorUserData);
      } else {
         setLoading(false);
         setSuccess("Account settings saved");
      }
   };

   return (
      <Container
         size="md"
         style={{
            margin: "100px auto",
            display: "flex",
            flexDirection: "column",
            rowGap: "60px",
         }}
      >
         <Para size="displayxs" weight="medium">
            Brand Profile
         </Para>
         <Section>
            <Para size="textmd" weight="medium">
               Logo
            </Para>
            <Divider />
            <CompanyLogoUploader />
         </Section>
         <Section>
            <Para size="textmd" weight="medium">
               Information
            </Para>
            <Divider />
            {!formValues ? (
               <Para size="textmd" weight="regular">
                  Loading...
               </Para>
            ) : (
               <Form onSubmit={handleSubmit(onSubmit)}>
                  <InputErrorWrap>
                     <Controller
                        name="company_name"
                        control={control} // control is from useForm()
                        defaultValue="" // this can be your default value
                        render={({ field }) => (
                           <Input
                              id="filled-basic"
                              variant="filled"
                              label="Company Name"
                              {...field} // spread the field object which contains the necessary props
                           />
                        )}
                     />
                     {errors.company_name && (
                        <Para size="textxs" weight="regular" color="error">
                           {errors.company_name.message}
                        </Para>
                     )}
                  </InputErrorWrap>
                  <InputErrorWrap>
                     <Controller
                        name="email"
                        control={control} // control is from useForm()
                        defaultValue="" // this can be your default value
                        render={({ field }) => (
                           <Input
                              disabled
                              id="filled-basic"
                              variant="filled"
                              label="Email"
                              {...field} // spread the field object which contains the necessary props
                           />
                        )}
                     />
                  </InputErrorWrap>
                  <InputErrorWrap>
                     <Controller
                        name="company_website"
                        control={control} // control is from useForm()
                        defaultValue="" // this can be your default value
                        render={({ field }) => (
                           <Input
                              id="filled-basic"
                              variant="filled"
                              label="Company Website"
                              {...field} // spread the field object which contains the necessary props
                           />
                        )}
                     />
                     {errors.company_website && (
                        <Para size="textxs" weight="regular" color="error">
                           {errors.company_website.message}
                        </Para>
                     )}
                  </InputErrorWrap>
                  <TwoColFields>
                     <InputErrorWrap>
                        <Controller
                           name="first_name"
                           control={control} // control is from useForm()
                           defaultValue="" // this can be your default value
                           render={({ field }) => (
                              <Input
                                 id="filled-basic"
                                 variant="filled"
                                 label="First Name"
                                 {...field} // spread the field object which contains the necessary props
                              />
                           )}
                        />
                        {errors.first_name && (
                           <Para size="textxs" weight="regular" color="error">
                              {errors.first_name.message}
                           </Para>
                        )}
                     </InputErrorWrap>
                     <InputErrorWrap>
                        <Controller
                           name="last_name"
                           control={control} // control is from useForm()
                           defaultValue="" // this can be your default value
                           render={({ field }) => (
                              <Input
                                 id="filled-basic"
                                 variant="filled"
                                 label="Last Name"
                                 {...field} // spread the field object which contains the necessary props
                              />
                           )}
                        />
                        {errors.last_name && (
                           <Para size="textxs" weight="regular" color="error">
                              {errors.last_name.message}
                           </Para>
                        )}
                     </InputErrorWrap>
                  </TwoColFields>
                  {isDirty && (
                     <Button $brandColor='true'>
                        {loading ? "Saving..." : "Save Changes"}
                     </Button>
                  )}
                  {success && <Snackbar success text={success} />}
               </Form>
            )}
         </Section>
      </Container>
   );
}

const Form = styled.form`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
`;

const TwoColFields = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
   grid-column-gap: 20px;
`;

const Section = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
`;
