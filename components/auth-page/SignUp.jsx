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
import { useRouter } from "next/navigation";
import Snackbar from "@/styles/mui/Snackbar";

export default function SignUp() {
   const [loading, setLoading] = useState(null);
   const [success, setSuccess] = useState(null);
   const [error, setError] = useState()
   const supabase = createClientComponentClient();
   const router = useRouter();
   const validationSchema = yup.object().shape({
      email: yup.string().required("This is a required field."),
   });

   const {
      register,
      formState: { errors },
      handleSubmit,
   } = useForm({
      mode: "onChange",
      resolver: yupResolver(validationSchema),
   });

   const onSubmit = async (formData) => {
      setSuccess(null);
      setLoading(true);
      setError(null)
      const { error } = await supabase.auth.signUp({
         email: formData.email,
         password: formData.password
      });
      if (error) {
         console.log(error);
         setLoading(false);
         setSuccess(false);
         setError(error.message)
      } else {
         setLoading(false);
         setSuccess('You successfully signed up!');
         setTimeout(()=>{
            location.replace(window.location.origin)
         }, 3000)
      }
   };

   const handleLogin = () => {
      router.push('/login')
   }

   // const handleGoogleSignIn = async () => {
   //    const { data, error } = await supabase.auth.signInWithOAuth({
   //       provider: "google",
   //    });
   //    if (error) {
   //       console.log("sign in error", error);
   //    }
   // };

   return (
      <Container size="xs" style={{ display: "flex", alignItems: "center" }}>
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
               <FormSection style={{ rowGap: "9px" }}>
                  <Para
                     size="textsm"
                     $weight="medium"
                     color="primary.grey.g600"
                  >
                     Sign Up
                  </Para>
                  <H6 $weight="medium">Create an Account</H6>
                  <SwapForm>
                     <Para size="textsm" $weight="regular" color="black">
                        Already have an account? 
                     </Para>
                     <Para size="textsm" $weight="medium" color="black" $isLink={true} onClick={handleLogin}>
                        Log in
                     </Para>
                  </SwapForm>
               </FormSection>
               <FormSection>
                  
                  <InputWrapper>
                  <Input
                     fieldName="email"
                     placeholder="Work Email"
                     register={register}
                     errors={errors}
                  />
                  <Input
                     fieldName="password"
                     placeholder="Password"
                     register={register}
                     errors={errors}
                     type="password"
                  />
                  </InputWrapper>
                  <Button $brandcolor="true" type="submit">
                     {loading ? "Loading..." : "Sign Up"}
                  </Button>
                  {error && <Para size="textsm" $weight="regular" color="error">{error}</Para>}
                  {success && <Snackbar success text={success} />}
               </FormSection>
               {/* <OrContainer>
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
                  /> */}
               {/* </OrContainer> */}
               {/* <Button
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
               </Button> */}
               <Agreement />
            </FormWrapper>
 
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

const InputWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 5px;
   width: 100%;
`;

const SwapForm = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 5px;
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
