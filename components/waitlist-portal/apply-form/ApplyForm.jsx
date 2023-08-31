"use client";
import React, { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateSteps } from "@/slices/waitlistFormSlice";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import { StepSection } from "./Styled";
import { useWaitlistId } from "@/hooks/useWaitlistId";
import { useCompanyId } from "@/hooks/useCompanyId";
import { useUserId } from "@/hooks/useUserId";

const WaitlistForm = () => {
   const dispatch = useDispatch();
   const currentStepRedux = useSelector((state) => state.waitlistForm.step);
   const router = useRouter();
   const supabase = createClientComponentClient();

   const scrollToStep = (step) => {
      console.log("Scrolling to step:", step);
      const stepElement = document.getElementById(`step-${step}`);
      if (stepElement) {
         console.log("Step element found:", stepElement);
         stepElement.scrollIntoView({ behavior: "smooth" });
      } else {
         console.error("Step element not found");
      }
   };

   useEffect(() => {
      const timer = setTimeout(() => {
         scrollToStep(currentStepRedux);
      }, 100);
      return () => clearTimeout(timer);
   }, [currentStepRedux]);

   const handleNext = useCallback(() => {
      dispatch(updateSteps({ value: currentStepRedux + 1 }));
   }, [currentStepRedux, dispatch]);

   const handleBack = useCallback(() => {
      // Dispatch action to update Redux state
      dispatch(updateSteps({ value: currentStepRedux - 1 }));
   }, [currentStepRedux, dispatch]);

   const validationSchema = yup.object().shape({
      company_name: yup.string().required("This is a required field."),
      company_website: yup.string().nullable(),
      company_industry: yup.string().required("This is a required field."),
      booking_frequency: yup.string().required("This is a required field."),
      booking_length: yup.string().required("This is a required field."),
      hosting_frequency: yup.string().required("This is a required field."),
      referral_source: yup.string().required("This is a required field."),
   });

   const methods = useForm({
      resolver: yupResolver(validationSchema),
   });

   const waitlistId = useWaitlistId();
   const companyId = useCompanyId();
   const userId = useUserId();

   const onSubmit = async (formState) => {
      if (waitlistId && companyId && userId) {
         const { error } = await supabase.from("waitlist").upsert(
            {
               id: waitlistId,
               submitted_form: true,
               booking_frequency: formState.booking_frequency,
               booking_length: formState.booking_length,
               hosting_frequency: formState.hosting_frequency,
               referral_source: formState.referral_source,
               anything_else: formState.anything_else,
            }).eq("user_id", userId);
         if (error) {
            console.log(error);
         }
         const { error: companyDataError } = await supabase
            .from("company_profiles")
            .upsert(
               {
                  id: companyId,
                  waitlist_id: waitlistId,
                  name: formState.company_name,
                  website: formState.company_website,
                  industry: formState.company_industry,
               }).eq("user_id", userId);
         if (companyDataError) {
            console.log(companyDataError);
         } else {
            router.push("/waitlist/dash");
         }
      }
   };

   return (
      <div
         style={{
            height: "100dvh",
            width: "100%",
            position: "fixed",
            overflow: "hidden",
         }}
      >
         <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
               <Step1
                  currentStep={currentStepRedux}
                  handleNext={handleNext}
                  id="step-1"
               />
               <StepSection id="step-2">
                  <Step2
                     currentStep={currentStepRedux}
                     handleNext={handleNext}
                     handleBack={handleBack}
                  />
               </StepSection>
               <StepSection id="step-3">
                  <Step3
                     currentStep={currentStepRedux}
                     handleNext={handleNext}
                     handleBack={handleBack}
                  />
               </StepSection>
               <StepSection id="step-4">
                  <Step4
                     currentStep={currentStepRedux}
                     handleNext={handleNext}
                     handleBack={handleBack}
                  />
               </StepSection>
               <StepSection id="step-5">
                  <Step5
                     currentStep={currentStepRedux}
                     handleNext={handleNext}
                     handleBack={handleBack}
                  />
               </StepSection>
               <StepSection id="step-6">
                  <Step6
                     currentStep={currentStepRedux}
                     handleNext={handleNext}
                     handleBack={handleBack}
                  />
               </StepSection>
            </form>
         </FormProvider>
      </div>
   );
};

export default WaitlistForm;
