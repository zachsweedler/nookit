"use client";
import { Button } from "@/styles/Buttons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import * as yup from "yup";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import Snackbar from "@/styles/mui/Snackbar";
import Container from "@/styles/Containers";
import { Para } from "@/styles/Typography";
import { Divider } from "@/styles/mui/Divider";
import { CompanyLogoUploader } from "../../image-uploaders/company-logo/CompanyLogoUploader";
import Input from "@/styles/Input";
import Image from "next/image";
import PageHeader from "../../page-header/PageHeader";
import Select from "@/styles/Select";
import { industries } from "@/utils/industries";
import Loading from "@/components/loading/Loading";

export default function ProfileForm() {
   const supabase = createClientComponentClient();
   const [userId, setUserId] = useState();
   const [companyId, setCompanyId] = useState();
   const [formValues, setFormValues] = useState();
   const [success, setSuccess] = useState();
   const [loading, setLoading] = useState();

   const validationSchema = yup.object().shape({
      first_name: yup.string().nullable(),
      last_name: yup.string().nullable(),
      name: yup.string().required("This is a required field."),
      industry: yup.string().required("This is a required field")
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
                  .select("first_name, last_name, name, industry, website, id")
                  .eq("user_id", userId);
            if (errorCompanyData) {
               console.error("error getting user", errorCompanyData);
            }
            if (companyData && data) {
               setCompanyId(companyData[0]?.id || "");
               setFormValues({
                  first_name: companyData[0].first_name || "",
                  last_name: companyData[0].last_name || "",
                  name: companyData[0]?.name || "",
                  industry: companyData[0].industry || "",
                  website: companyData[0]?.website || "",
                  email: data?.user?.email || "",
               });
            }
         }
      };
      getData();
   }, [supabase, userId]);

   const {
      formState: { errors, isDirty },
      handleSubmit,
      register,
   } = useForm({
      mode: 'onChange',
      resolver: yupResolver(validationSchema),
      defaultValues: {
         first_name: "",
         last_name: "",
         email: "",
         industry: "",
         name: "",
         website: "",
      },
      values: formValues,
   });

   const onSubmit = async (formState) => {
      setLoading(true);
      setSuccess(null);
      const { error } = await supabase.from("company_profiles").upsert({
         id: companyId,
         name: formState.name,
         website: formState.website,
         industry: formState.industry,
         first_name: formState.first_name,
         last_name: formState.last_name,
      });
      if (error) {
         console.error("error updating company profile", error);
      } else {
         setLoading(false);
         setSuccess("Account settings saved");
      }
   };

   useEffect(()=>{
      console.log(formValues)
   },[formValues])

   return (
      <Container
         size="md"
         style={{
            margin: "130px auto",
            display: "flex",
            flexDirection: "column",
            rowGap: "50px",
         }}
      >
         <PageHeader
            title="Profile"
            button="Show Profile"
            buttonLink={`/profiles/${userId}`}
         />
         <Divider />
         <Section>
            <CompanyLogoUploader />
         </Section>
         <Divider />
         <Para size="displayxs" $weight="medium">
            Basic Information
         </Para>
         <Section>
            {!formValues ? (
               <Loading/>
            ) : (
               <Form onSubmit={handleSubmit(onSubmit)}>
                  <TwoColFields>
                     <Input
                        fieldName="first_name"
                        label="First Name"
                        register={register}
                        errors={errors}
                     />
                     <Input
                        fieldName="last_name"
                        label="Last Name"
                        register={register}
                        errors={errors}
                     />
                  </TwoColFields>
                  <Input
                     fieldName="email"
                     label="Work Email"
                     register={register}
                     errors={errors}
                     disabled={true}
                     adornment={
                        <Image
                           alt="lock-icon"
                           src="/lock-icon-beige.svg"
                           width={18}
                           height={18}
                           style={{ cursor: "not-allowed" }}
                        />
                     }
                  />
                  <Input
                     fieldName="name"
                     label="Company Name"
                     register={register}
                     errors={errors}
                  />
                  <Select
                     fieldName="industry"
                     label="Company Industry"
                     options={industries}
                     register={register}
                     errors={errors}
                  />
                  <Input
                     fieldName="website"
                     label="Company Website"
                     register={register}
                     errors={errors}
                  />
                  {isDirty && (
                     <Button $brandColor="true">
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
   row-gap: 40px;
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
