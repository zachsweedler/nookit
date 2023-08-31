"use client";
import { Para } from "@/styles/Typography";
import React from "react";
import { StepSection, StepWrapper } from "./Styled";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";

function Step4({ currentStep, handleNext, handleBack, id }) {
  const handleClick = async () => {
    handleNext();
  };

  return (
    <StepSection id={id}>
      <Container size="xs">
        <StepWrapper>
          <div
            style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}
          >
            <Para weight="regular" size="textxs" color="primary.brand.b950">
              Step {currentStep}/7
            </Para>
            <Para weight="medium" size="textxl" color="black">
               Last thing, let&apos;s gather details about your nook.
            </Para>
            <Para weight="regular" size="textmd" color="black">
                Your nook is the dedicated section within your retail space available for other members to book.
            </Para>
          </div>
          <Button type="button" $brandcolor='true' onClick={handleClick}>
            Get Started
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
    </StepSection>
  );
}

export default Step4;
