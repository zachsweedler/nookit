"use client";
import { Para } from "@/styles/Typography";
import React, { useEffect } from "react";
import {
  AmenitiesWrapper,
  CategoryWrapper,
  CheckboxWrapper,
  InputsWrapper,
  StepSection,
  StepWrapper,
} from "./Styled";
import { Button } from "@/styles/Buttons";
import { spaceAmenities } from "@/utils/space_amenities";
import Container from "@/styles/Containers";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/styles/Checkboxes";
import { setFormValues } from "@/slices/uploadNookSlice";
import { useDispatch, useSelector } from "react-redux";

function Step6({ currentStep, handleNext, handleBack, id }) {
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    watch,
  } = useFormContext();

  const reduxFormState = useSelector((state) => state.uploadNook.formValues);

  const handleClick = async () => {
    const isValid = await trigger(["amenities"]);
    const { amenities } = getValues();
    if (isValid) {
      dispatch(setFormValues({ ...reduxFormState, amenities }));
      handleNext();
    }
  };

  const amenitiesValue = watch("amenities");

  useEffect(() => {
    console.log("registered amenities", amenitiesValue);
  }, [amenitiesValue]);

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
              Amenities
            </Para>
            <Para weight="regular" size="textmd" color="black">
              When a member books your nook, what amenities does your space offer to
              help with their popup? 
            </Para>
          </div>
          <AmenitiesWrapper>
            <InputsWrapper>
              {/* Amenities Checkboxes */}
              {Object.entries(spaceAmenities).map(([category, amenities]) => (
                <CategoryWrapper key={category}>
                  <Para weight="medium" size="textmd" color="black">
                    {category}
                  </Para>
                  {amenities.map((amenity) => (
                    <CheckboxWrapper key={amenity}>
                      <Checkbox
                        id="filled-basic"
                        variant="filled"
                        label="Nook Amenities"
                        name="amenities"
                        value={amenity}
                        {...register("amenities")}
                      />
                      <Para weight="regular" size="textsm" color="black">
                        {amenity}
                      </Para>
                    </CheckboxWrapper>
                  ))}
                </CategoryWrapper>
              ))}
              {errors.amenities && (
                <Para size="textxs" weight="regular" color="error">
                  {errors.amenities.message}
                </Para>
              )}
            </InputsWrapper>
          </AmenitiesWrapper>
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
    </StepSection>
  );
}

export default Step6;
