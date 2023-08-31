"use client";
import { Para } from "@/styles/Typography";
import React from "react";
import { StepSection, StepWrapper } from "./Styled";
import Container from "@/styles/Containers";
import NookImageUploader from "@/components/image-uploaders/nook-images/NookImageUploader";
import { useFormContext } from "react-hook-form";
import { Button } from "@/styles/Buttons";

function Step3({ currentStep, handleNext, handleBack, id }) {
   const { trigger } = useFormContext();

   const handleClick = async () => {
      const isValid = await trigger("retail_space_images");
      if (isValid) {
         handleNext();
      }
   };

   return (
      <StepSection id={id}>
         <Container size="xs">
            <StepWrapper>
               <div
                  style={{
                     display: "flex",
                     flexDirection: "column",
                     rowGap: "20px",
                  }}
               >
                  <Para
                     weight="regular"
                     size="textxs"
                     color="primary.brand.b950"
                  >
                     Step {currentStep}/7
                  </Para>
                  <Para weight="medium" size="textxl" color="black">
                     Photos
                  </Para>
                  <Para weight="regular" size="textmd" color="black">
                     Upload 3 or more photos of your retail space.
                  </Para>
               </div>
               <NookImageUploader
                  isNookPhotos={false}
                  fieldName="retail_space_images"
               />
               <Button type="button" $brandcolor="true" onClick={handleClick}>
                  Next
               </Button>
               <Para
                  $isLink="true"
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

export default Step3;
