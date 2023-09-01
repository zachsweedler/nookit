import React from "react";
import { Para } from "@/styles/Typography";
import { InputsWrapper, StepWrapper } from "../Styled";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { useFormContext } from "react-hook-form";
import Radio from "@/styles/Radio";

function Step2({ currentStep, handleNext, handleBack }) {

  const {
    register,
    formState: {errors},
    trigger,
    watch,
  } = useFormContext();

  const value = watch("booking_frequency")

  const handleClick = async () => {
    const isValid = await trigger("booking_frequency");
    if (isValid) {
      handleNext();
    }
  };

  const options = [
    { name: "1-5 times a year" },
    { name: "5-10 times a year" },
    { name: "10-20 times a year" },
    { name: "20-30+ times a year" },
    { name: "I'm only interested in hosting a nook" }
  ];

  return (
    <Container size="xs">
      <StepWrapper>
        <div style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}>
          <Para weight="regular" size="textxs" color="primary.brand.b950">
            Step {currentStep}/6
          </Para>
          <Para weight="regular" size="textmd" color="black">
            We refer to a “nook” as a section within a store that’s allocated for brands to pop up in.
          </Para>
          <Para weight="regular" size="textxl" color="black">
            How often do you see your company booking another members’ nook?
          </Para>
        </div>
        <InputsWrapper>
          <Radio
            options={options}
            register={register}
            groupName="booking_frequency"
          />
        </InputsWrapper>
        {errors.booking_frequency && (
          <Para size="textxs" weight="regular" color="error">
            {errors.booking_frequency.message}
          </Para>
        )}
        <Button type="button" $brandcolor ='true' onClick={handleClick}>
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

export default Step2;
