"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateSteps } from "@/slices/uploadNookSlice";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step7 from "./steps/Step7";
import Step6 from "./steps/Step6";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ApplyForm = () => {
  const dispatch = useDispatch();
  const currentStepRedux = useSelector((state) => state.uploadNook.step);
  const { step, uuid, ...defaultValuesRedux } = useSelector(
    (state) => state.uploadNook.formValues
  );
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
    }, 150);
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
    name: yup.string().required("Name is required."),
    amenities: yup.array().of(yup.string()).required("Amenities are required."),
    description: yup.string().required("Description is required."),
    images: yup
      .array()
      .min(3, "Please upload at least 3 photo of your nook")
      .required("This field is required."),
    retail_space_type: yup.string().required("Retail space type is required."),
    retail_space_full_address: yup
      .string()
      .min(5, "Address should be at least 5 characters long")
      .max(100, "Address should not exceed 100 characters")
      .matches(/^[0-9a-zA-Z\s,-.'#/]+$/, "Invalid address format")
      .required("This field is required"),
    retail_space_images: yup
      .array()
      .min(3, "Please upload at least 3 photo of your retail space")
      .required("This field is required."),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValuesRedux,
  });

  const onSubmit = async () => {
    const isValid = await methods.trigger('images');
    if (isValid) {
      const { data, error } = await supabase.from("nooks").insert({
        uuid: uuid,
        name: defaultValuesRedux.name,
        amenities: defaultValuesRedux.amenities,
        description: defaultValuesRedux.description,
        images: defaultValuesRedux.images,
        retail_space_type: defaultValuesRedux.retail_space_type,
        retail_space_full_address: defaultValuesRedux.retail_space_full_address,
        retail_space_address: defaultValuesRedux.retail_space_address,
        retail_space_state_code: defaultValuesRedux.retail_space_state_code,
        retail_space_city: defaultValuesRedux.retail_space_city,
        retail_space_zip: defaultValuesRedux.retail_space_zip,
        retail_space_country: defaultValuesRedux.retail_space_country,
        retail_space_longitude: defaultValuesRedux.retail_space_longitude,
        retail_space_latitude: defaultValuesRedux.retail_space_latitude,
        retail_space_geo_point: defaultValuesRedux.retail_space_geo_point,
        retail_space_images: defaultValuesRedux.retail_space_images,
      });
      if (error) {
        console.log("error inserting nook", error);
      } else {
        console.log("nook inserted", data);
        localStorage.removeItem("nookUUID");
        router.push("/waitlist/dash");
      }
    }
  };

  return (
    <div style={{ height: "100dvh", width: '100%', position: "fixed", overflow: "hidden" }}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Step1
            currentStep={currentStepRedux}
            handleNext={handleNext}
            id="step-1"
          />
          <Step2
            currentStep={currentStepRedux}
            handleNext={handleNext}
            handleBack={handleBack}
            id="step-2"
          />
          <Step3
            currentStep={currentStepRedux}
            handleNext={handleNext}
            handleBack={handleBack}
            id="step-3"
          />
          <Step4
            currentStep={currentStepRedux}
            handleBack={handleBack}
            handleNext={handleNext}
            id="step-4"
          />
          <Step5
            currentStep={currentStepRedux}
            handleBack={handleBack}
            handleNext={handleNext}
            id="step-5"
          />
          <Step6
            currentStep={currentStepRedux}
            handleBack={handleBack}
            handleNext={handleNext}
            onSubmit={onSubmit}
            id="step-6"
          />
          <Step7
            currentStep={currentStepRedux}
            handleBack={handleBack}
            onSubmit={onSubmit}
            id="step-7"
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default ApplyForm;
