"use client";
import { Input } from "@/styles/Input";
import { Para } from "@/styles/Typography";
import React from "react";
import { InputsWrapper, StepSection, StepWrapper } from "./Styled";
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { Controller, useFormContext } from "react-hook-form";
import TextArea from "@/styles/Textarea";
import { InputErrorWrap } from "@/components/waitlist-portal/apply-form/Styled";
import { InputAdornment } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFormValues } from "@/slices/uploadNookSlice";

function Step5({ currentStep, handleNext, handleBack, id }) {
  const dispatch = useDispatch();

  const {
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useFormContext();

  const reduxFormState = useSelector((state) => state.uploadNook.formValues);

  const handleClick = async () => {
    const isValid = await trigger(["name", "description"]);
    const { name, description } = getValues();
    if (isValid) {
      dispatch(setFormValues({ ...reduxFormState, name, description }));
      handleNext();
    }
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
              Basic Info
            </Para>
            <Para weight="regular" size="textmd" color="black">
              Give your nook a unique name and description; The name is what
              member&apos;s will see when they find your nook listed on the
              platform.
            </Para>
          </div>
          <InputsWrapper>
            <InputErrorWrap>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    id="filled-basic"
                    variant="filled"
                    label="Name Your Nook"
                    {...field}
                  />
                )}
              />
              {errors.name && (
                <Para size="textxs" weight="regular" color="error">
                  {errors.name.message}
                </Para>
              )}
            </InputErrorWrap>
            {/* Description Input */}
            <InputErrorWrap>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextArea
                    field={field}
                    name="Description"
                    placeholder="Description of nook..."
                  />
                )}
              />
              {errors.description && (
                <Para size="textxs" weight="regular" color="error">
                  {errors.description.message}
                </Para>
              )}
            </InputErrorWrap>
          </InputsWrapper>
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
    </StepSection>
  );
}

export default Step5;
