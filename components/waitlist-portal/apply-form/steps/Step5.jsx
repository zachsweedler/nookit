"use client";
import { Para } from "@/styles/Typography";
import React from "react";
import { InputsWrapper, StepWrapper } from "../Styled";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { useFormContext } from "react-hook-form";
import Radio from "@/styles/Radio";

function Step5({ currentStep, handleNext, handleBack}) {

  const {
    register,
    formState: {errors},
    trigger,
  } = useFormContext();

  const handleClick = async () => {
    const isValid = await trigger("referral_source");
    if (isValid) {
      handleNext();
    }
  };

  const options = [
    { name: "Referred by existing member" },
    { name: "Heard about it from a friend" },
    { name: "Social media" },
    { name: "Advertisement" },
    { name: "Online article" },
    { name: "Other" }
  ];

  return (
    <Container size="xs">
      <StepWrapper>
        <div style={{display: "flex", flexDirection: "column", rowGap: "20px"}}>
          <Para weight="regular" size="textxs" color="primary.brand.b950">
            Step {currentStep}/6
          </Para>
          <Para weight="regular" size="textxl" color="black">
            How did you hear about us?
          </Para>
        </div>
        <InputsWrapper>
          <Radio
              register={register}
              options={options}
              groupName="referral_source"
            />
        </InputsWrapper>
        {errors.referral_source && (
          <Para size="textxs" weight="regular" color="error">
            {errors.referral_source.message}
          </Para>
        )}
        <Button type="button" $brandcolor onClick={handleClick}>
          Next
        </Button>
        <Para
          $isLink='true'
          weight="regular"
          size="textxs"
          color="primary.brand.b950"
          onClick={handleBack}
        >
          Previous Step
        </Para>
      </StepWrapper>
    </Container>
  );
}

export default Step5;