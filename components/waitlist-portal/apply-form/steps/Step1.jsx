"use client";
import { Input } from "@/styles/Input";
import { Para } from "@/styles/Typography";
import React, { useEffect } from "react";
import {
  InputErrorWrap,
  InputsWrapper,
  StepSection,
  StepWrapper,
} from "../Styled";
import { Button } from "@/styles/Buttons";
import { industries } from "@/utils/industries";
import Container from "@/styles/Containers";
import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete } from "@mui/material";

function Step1({ currentStep, handleNext, id }) {
  const {
    formState: { errors },
    trigger,
    register,
    control,
  } = useFormContext();

  const handleClick = async () => {
    const isValid = await trigger([
      "company_name",
      "company_industry",
      "company_website",
    ]);
    if (isValid) {
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
              Tell us about your company
            </Para>
          </div>
          <InputsWrapper>
            <InputErrorWrap>
              <Input
                id="filled-basic"
                variant="filled"
                label="Company Name"
                name="company_name"
                {...register("company_name")}
              />
              {errors.company_name && (
                <Para size="textxs" weight="regular" color="error">
                  {errors.company_name.message}
                </Para>
              )}
            </InputErrorWrap>
            <InputErrorWrap>
              <Controller
                name="company_website"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    variant="filled"
                    label="Company Website (optional)"
                    {...field}
                  />
                )}
              />
            </InputErrorWrap>
            <InputErrorWrap>
              <Controller
                name="company_industry"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, ...field } }) => (
                  <Autocomplete
                    freeSolo
                    value={value}
                    options={industries.map((option) => option)}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <Input {...params} {...field} label="Industry" />
                    )}
                  />
                )}
              />
              {errors.company_industry && (
                <Para size="textxs" weight="regular" color="error">
                  {errors.company_industry.message}
                </Para>
              )}
            </InputErrorWrap>
          </InputsWrapper>
          <Button type="button" $brandcolor='true' onClick={handleClick}>
            Next
          </Button>
        </StepWrapper>
      </Container>
    </StepSection>
  );
}

export default React.memo(Step1);
