/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/styles/Buttons";
import { H6, Para } from "@/styles/Typography";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Container from "@/styles/Containers";
import Input from "@/styles/Input";
import { useRouter } from "next/navigation";
import Snackbar from "@/styles/mui/Snackbar";

export default function ForgotPass() {
   const [loading, setLoading] = useState(null);
   const [success, setSuccess] = useState(null);
   const router = useRouter();
   const [error, setError] = useState();
   const [passReset, setPassReset] = useState(false);
   const supabase = createClientComponentClient();
   const validationSchema = yup.object().shape({
      email: yup.string().when([], {
         is: () => !passReset,
         then: () => yup.string().required("Email is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
      new_password: yup.string().when([], {
         is: () => passReset,
         then: () => yup.string().required("Password is required."),
         otherwise: () => yup.string().nullable().notRequired(),
      }),
   });

   const {
      register,
      formState: { errors },
      handleSubmit,
   } = useForm({
      mode: "onChange",
      resolver: yupResolver(validationSchema),
   });

   useEffect(() => {
      supabase.auth.onAuthStateChange(async (event, session) => {
         console.log("event", event);
         if (event === "SIGNED_IN") {
            setPassReset(true);
         }
      });
   }, [supabase.auth]);

   const onSubmit = async (formData) => {
      console.log("clicked");
      if (!passReset) {
         setSuccess(null);
         setLoading(true);
         setError(null);
         const { error } = await supabase.auth.resetPasswordForEmail(
            formData.email,
            {
               redirectTo: `${window.location.origin}/forgot-password`,
            }
         );
         if (error) {
            console.log(error);
            setLoading(false);
            setSuccess(false);
            setError(error.message);
         } else {
            setLoading(false);
            setSuccess(`Password reset link sent to ${formData.email}`);
         }
      } else {
         setSuccess(null);
         setLoading(true);
         setError(null);
         const { data, error } = await supabase.auth.updateUser({
            password: formData.new_password,
         });
         if (error) {
            setError(error);
            setSuccess(false);
            setLoading(false);
         } else {
            setLoading(false);
            setSuccess('Password reset successfully!');
            setTimeout(()=>{
                router.push('/')
            }, 3000)
         }
      }
   };

   return (
      <Container size="xs" style={{ display: "flex", alignItems: "center" }}>
         <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            {!passReset ? (
               <>
                  <FormSection style={{ rowGap: "9px" }}>
                     <Para
                        size="textsm"
                        $weight="medium"
                        color="primary.grey.g600"
                     >
                        Reset Password
                     </Para>
                     <H6 $weight="medium">Enter your email</H6>
                  </FormSection>
                  <FormSection>
                     <InputWrapper>
                        <Input
                           fieldName="email"
                           placeholder="Work Email"
                           register={register}
                           errors={errors}
                        />
                     </InputWrapper>
                     <Button $brandcolor="true" type="submit">
                        {loading ? "Loading..." : "Send Reset Link"}
                     </Button>
                     {error && (
                        <Para size="textsm" $weight="regular" color="error">
                           {error}
                        </Para>
                     )}
                  </FormSection>
               </>
            ) : (
               <>
                  <FormSection style={{ rowGap: "9px" }}>
                     <Para
                        size="textsm"
                        $weight="medium"
                        color="primary.grey.g600"
                     >
                        Update Password
                     </Para>
                     <H6 $weight="medium">Enter a new password</H6>
                  </FormSection>
                  <FormSection>
                     <InputWrapper>
                        <Input
                           fieldName="new_password"
                           placeholder="New Password"
                           register={register}
                           errors={errors}
                           type="password"
                        />
                     </InputWrapper>
                     <Button $brandcolor="true" type="submit">
                        {loading ? "Loading..." : "Confirm New Password"}
                     </Button>
                     {error && (
                        <Para size="textsm" $weight="regular" color="error">
                           {error}
                        </Para>
                     )}
                  </FormSection>
               </>
            )}
         </FormWrapper>
         {success && <Snackbar success text={success} />}
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
