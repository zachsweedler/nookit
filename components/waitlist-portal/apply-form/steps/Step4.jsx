"use client";
import { Para } from "@/styles/Typography";
import React from "react";
import { InputsWrapper, StepWrapper } from "../Styled";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { useFormContext } from "react-hook-form";
import Radio from "@/styles/Radio";

function Step4({ currentStep, handleNext, handleBack}) {

  const {
    register,
    formState: {errors},
    trigger,
  } = useFormContext();

  const handleClick = async () => {
    const isValid = await trigger("hosting_frequency");
    if (isValid) {
      handleNext();
    }
  };


  const options = [
    { name: "1-5 times a year" },
    { name: "5-10 times a year" },
    { name: "10-20 times a year" },
    { name: "20-50+ times a year" },
    { name: "Don't have a storefront" }
  ];


  return (
    <Container size="xs">
      <StepWrapper>
        <div style={{display: "flex", flexDirection: "column", rowGap: "20px"}}>
          <Para weight="regular" size="textxs" color="primary.brand.b950">
            Step {currentStep}/6
          </Para>
          <Para weight="regular" size="textxl" color="black">
            If you lease or own a storefront, how often you see yourself hosting a nook for other members to book?
          </Para>
        </div>
        <InputsWrapper>
            <Radio
              register={register}
              options={options}
              groupName="hosting_frequency"
            />
        </InputsWrapper>
        {errors.hosting_frequency && (
          <Para size="textxs" weight="regular" color="error">
            {errors.hosting_frequency.message}
          </Para>
        )}
        <Button type="button" $brandcolor='true' onClick={handleClick}>
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

export default Step4;
