"use client";
import { Para } from "@/styles/Typography";
import React from "react";
import { InputErrorWrap, InputsWrapper, StepWrapper } from "../Styled";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { Controller, useFormContext } from "react-hook-form";
import TextArea from "@/styles/Textarea";

function Step6({ currentStep, handleBack }) {

  const {
    control,
  } = useFormContext();

  return (
    <Container size="xs">
      <StepWrapper>
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}
        >
          <Para weight="regular" size="textxs" color="primary.brand.b950">
            Step {currentStep}/7
          </Para>
          <Para weight="regular" size="textxl" color="black">
            Last thing. Is there anything else you want to share with us?
          </Para>
        </div>
        <InputsWrapper>
          <InputErrorWrap>
            <Controller
              name="anything_else"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextArea field={field} name="why_nookit" />
              )}
            />
          </InputErrorWrap>
        </InputsWrapper>
        <Button type="submit" $brandcolor='true'>
          Finish
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

export default React.memo(Step6);
