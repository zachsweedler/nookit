/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/styles/Buttons";
import { H6, Para } from "@/styles/Typography";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { styled } from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ConfirmationPopup from "./ConfirmationPopup";
import Container from "@/styles/Containers";
import Agreement from "./Agreement";
import Input from "@/styles/Input";

export default function AuthForm() {
   const [loading, setLoading] = useState(null);
   const [success, setSuccess] = useState(null);
   const supabase = createClientComponentClient();
   const validationSchema = yup.object().shape({
      email: yup.string().required("This is a required field."),
   });

   const {
      register,
      formState: { errors },
      handleSubmit,
   } = useForm({
      mode: 'onChange',
      resolver: yupResolver(validationSchema),
   });

   const onSubmit = async (formData) => {
      setSuccess(null);
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
         email: formData.email,
      });
      if (error) {
         console.log(error);
         setLoading(false);
         setSuccess(false);
      } else {
         setLoading(false);
         setSuccess(true);
      }
   };

   const handleGoogleSignIn = async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
         provider: "google",
      });
      if (error) {
         console.log("sign in error", error);
      }
   };

   return (
      <Container size="xs" style={{ display: "flex", alignItems: "center" }}>
         {success ? (
            <ConfirmationPopup onClick={handleSubmit(onSubmit)} />
         ) : (
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
               <FormSection style={{ rowGap: "9px" }}>
                  <Para size="textsm" $weight="medium" color="primary.grey.g600">Login or sign up</Para>
                  <H6 $weight="medium">Welcome to Nookit</H6>
               </FormSection>
               <FormSection>
                  <Input
                     fieldName="email"
                     placeholder="Work Email"
                     register={register}
                     errors={errors}
                  />
                  <Button $brandcolor="true" type="submit">
                     {loading ? "Loading..." : "Continue"}
                  </Button>
               </FormSection>
               <OrContainer>
                  <hr
                     style={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "#dddddd",
                        borderWidth: "0",
                     }}
                  />
                  OR
                  <hr
                     style={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "#dddddd",
                        borderWidth: "0",
                     }}
                  />
               </OrContainer>
               <Button
                  onClick={handleGoogleSignIn}
                  $googlecolor="true"
                  style={{ position: "relative" }}
                  type="button"
               >
                  <img
                     src="/google-logo.svg"
                     width={20}
                     height={20}
                     style={{ position: "absolute", left: "12px" }}
                  />
                  Continue with Google
               </Button>
               <Agreement />
               
            </FormWrapper>
         )}
      </Container>
   );
}

const FormWrapper = styled.form`
   display: flex;
   flex-direction: column;
   width: 100%;
   align-items: start;
   justify-content: center;
   row-gap: 40px;
`;

const FormSection = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
   width: 100%;
`;

const OrContainer = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   column-gap: 5px;
   width: 100%;
   align-items: center;
`;
