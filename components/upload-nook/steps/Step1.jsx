"use client";
import { Para } from "@/styles/Typography";
import React from "react";
import { StepSection, StepWrapper } from "./Styled";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";

function Step1({ currentStep, handleNext, id }) {
  const handleClick = async () => {
    handleNext();
  };

  return (
    <StepSection id={id}>
      <Container size="xs">
        <StepWrapper>
          <div style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}>
            <Para weight="regular" size="textxs" color="primary.brand.b950">
            Step {currentStep}/7
            </Para>
            <Para weight="medium" size="textxl" color="black">
              Let&apos;s outline your overall retail space.
            </Para>
            <Para weight="regular" size="textmd" color="black">
              Your retail space is the main area where you conduct business, and
              within it, you can carve out a nook for other members to utilize.
            </Para>
          </div>
          <Button type="button" $brandcolor onClick={handleClick}>
            Get Started
          </Button>
        </StepWrapper>
      </Container>
    </StepSection>
  );
}

export default Step1;
