"use client";
import { Para } from "@/styles/Typography";
import React from "react";
import {
  StepSection,
  StepWrapper,
} from "./Styled";
import Container from "@/styles/Containers";
import NookImageUploader from "@/components/image-uploaders/nook-images/NookImageUploader";
import { Button } from "@/styles/Buttons";

function Step7({ currentStep, handleBack, id }) {

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
              Images
            </Para>
            <Para weight="regular" size="textmd" color="black">
            Upload 3 or more photos of your nook.
            </Para>
          </div>
          <NookImageUploader isNookPhotos={true} fieldName="images"/>
          <Button type="submit" $brandcolor='true'>
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
    </StepSection>
  );
}

export default Step7;
