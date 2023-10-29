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
import { ProfileLogoUploader } from "../../image-uploaders/profile-logo/ProfileLogoUploader";
import Input from "@/styles/Input";
import Image from "next/image";
import PageHeader from "../../page-header/PageHeader";
import Select from "@/styles/Select";
import { industries } from "@/utils/industries";
import Loading from "@/components/loading/Loading";
import { profileTypes } from "@/utils/profileTypes";
import Textarea from "@/styles/Textarea";

export default function ProfileForm() {
   const supabase = createClientComponentClient();
   const [userId, setUserId] = useState();
   const [profileId, setProfileId] = useState();
   const [formValues, setFormValues] = useState();
   const [success, setSuccess] = useState();
   const [loading, setLoading] = useState(true);

   const validationSchema = yup.object().shape({
      first_name: yup.string().nullable(),
      last_name: yup.string().nullable(),
      name: yup.string().required("This is a required field."),
      industry: yup.string().required("This is a required field"),
   });

   useEffect(() => {
      const getData = async () => {
         setLoading(true);
         const { data, error } = await supabase.auth.getUser();
         if (error) {
            console.error("error getting user", error);
         } else {
            setUserId(data.user.id);
         }
         if (userId) {
            const { data: profileData, error: errorProfileData } =
               await supabase
                  .from("profiles")
                  .select(
                     "first_name, last_name, name, about, type, industry, email, website, id"
                  )
                  .eq("user_id", userId);
            if (errorProfileData) {
               console.error("error getting user", errorProfileData);
            }
            if (profileData && data) {
               setProfileId(profileData[0]?.id || "");
               setFormValues({
                  first_name: profileData[0].first_name || "",
                  last_name: profileData[0].last_name || "",
                  name: profileData[0]?.name || "",
                  industry: profileData[0].industry || "",
                  website: profileData[0]?.website || "",
                  email: profileData[0]?.email || "",
                  about: profileData[0]?.about || "",
                  type: profileData[0]?.type || "",
               });
               setLoading(false);
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
      mode: "onChange",
      resolver: yupResolver(validationSchema),
      defaultValues: {
         first_name: "",
         last_name: "",
         email: "",
         about: "",
         type: "",
         industry: "",
         name: "",
         website: "",
      },
      values: formValues,
   });

   const onSubmit = async (formState) => {
      setLoading(true);
      setSuccess(null);
      const { error } = await supabase.from("profiles").upsert({
         id: profileId,
         name: formState.name,
         website: formState.website,
         industry: formState.industry,
         first_name: formState.first_name,
         last_name: formState.last_name,
         about: formState.about,
         type: formState.type,
      });
      if (error) {
         console.error("error updating profile", error);
      } else {
         setLoading(false);
         setSuccess("Account settings saved");
      }
   };

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
         {loading ? (
            <Loading />
         ) : (
            <>
               <PageHeader
                  title="Profile"
                  button="Show Profile"
                  buttonLink={`/profiles/${profileId}`}
               />
               <Divider />
               <Section>
                  <ProfileLogoUploader />
               </Section>
               <Divider />
               <Para size="displayxs" $weight="medium">
                  Basic Information
               </Para>
               <Section>
                  {!formValues ? (
                     <Loading />
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
                           label="Brand/Artist Name"
                           register={register}
                           errors={errors}
                        />
                        <Select
                           fieldName="industry"
                           label="Industry"
                           options={industries}
                           register={register}
                           errors={errors}
                        />
                        <Select
                           fieldName="type"
                           label="Type"
                           options={profileTypes}
                           register={register}
                           errors={errors}
                        />
                        <Input
                           fieldName="website"
                           label="Website"
                           register={register}
                           errors={errors}
                        />
                        <Textarea
                           fieldName="about"
                           label="About"
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
            </>
         )}
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
