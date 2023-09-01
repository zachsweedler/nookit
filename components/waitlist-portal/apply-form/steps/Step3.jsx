"use client";
import { Para } from "@/styles/Typography";
import React, { useState } from "react";
import { InputsWrapper, StepWrapper } from "../Styled";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { useFormContext } from "react-hook-form";
import Radio from "@/styles/Radio";


function Step3({ currentStep, handleNext, handleBack }) {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();

  const handleClick = async () => {
    const isValid = await trigger("booking_length");
    if (isValid) {
      handleNext();
    }
  };

  const options = [
    { name: "Flash pop-in (hours to days)" },
    { name: "Short-term pop-in (days to weeks)" },
    { name: "Long-term pop-in (weeks to months)" },
  ];

  return (
    <Container size="xs">
      <StepWrapper>
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}
        >
          <Para weight="regular" size="textxs" color="primary.brand.b950">
            Step {currentStep}/6
          </Para>
          <Para weight="regular" size="textxl" color="black">
            Let&apos;s say you booked a nook, what&apos;s your ideal booking duration?
          </Para>
        </div>
        <InputsWrapper>
            <Radio
              register={register}
              options={options}
              groupName="booking_length"
            />
        </InputsWrapper>
        {errors.booking_length && (
          <Para size="textxs" weight="regular" color="error">
            {errors.booking_length.message}
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

export default Step3;
