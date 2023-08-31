import { Input } from "@/styles/Input";
import { Para } from "@/styles/Typography";
import React, { useEffect, useState } from "react";
import {
  InputErrorWrap,
  InputsWrapper,
  StepSection,
  StepWrapper,
} from "./Styled";
import { Button } from "@/styles/Buttons";
import { spaceTypes } from "@/utils/space_types"; // Assuming the array is exported as spaceTypes
import { Controller, useFormContext } from "react-hook-form";
import Container from "@/styles/Containers";
import { AddressAutofill } from "@mapbox/search-js-react";
import { autoFillTheme } from "@/styles/mapbox/AutoFillTheme";
import { useDispatch, useSelector } from "react-redux";
import { setFormValues } from "@/slices/uploadNookSlice";
import { Autocomplete } from "@/styles/Autocomplete";


function Step2({ currentStep, handleNext, handleBack, id }) {
  const dispatch = useDispatch();
  const [autoValue, setAutoValue] = useState(null);

  const {
    formState: { errors },
    trigger,
    register,
    control,
    getValues,
    watch,
    setValue,
  } = useFormContext();

  const reduxFormState = useSelector((state) => state.uploadNook.formValues);

  const handleClick = async () => {
    const isValid = await trigger([
      "retail_space_full_address",
      "retail_space_type",
    ]);
    console.log("is Valid", isValid);
    console.log("values", getValues());
    const {
      retail_space_full_address,
      retail_space_type,
      retail_space_address,
      retail_space_state_code,
      retail_space_city,
      retail_space_zip,
      retail_space_country,
      retail_space_longitude,
      retail_space_latitude,
      retail_space_geo_point,
    } = getValues();

    if (isValid) {
      dispatch(
        setFormValues({
          ...reduxFormState,
          retail_space_full_address,
          retail_space_type,
          retail_space_address,
          retail_space_state_code,
          retail_space_city,
          retail_space_zip,
          retail_space_country,
          retail_space_longitude,
          retail_space_latitude,
          retail_space_geo_point,
        })
      );
      handleNext();
    }
  };

  const space = watch("retail_space_type");

  useEffect(() => {
    console.log("space type", space);
  }, [space]);

  const handleAddressSelect = async (res) => {
    const feature = await res.features[0];
    const {
      geometry: { coordinates },
      properties: {
        full_address,
        address_line1,
        address_level2,
        address_level1,
        country_code,
        postcode,
      },
    } = feature;
    setValue("retail_space_full_address", full_address);
    setValue("retail_space_address", address_line1);
    setValue("retail_space_state_code", address_level1);
    setValue("retail_space_city", address_level2);
    setValue("retail_space_zip", postcode);
    setValue("retail_space_country", country_code);
    setValue("retail_space_longitude", coordinates[0]);
    setValue("retail_space_latitude", coordinates[1]);
    setValue(
      "retail_space_geo_point",
      `POINT(${coordinates[0]} ${coordinates[1]})`
    );
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
              First things first, where&apos;s your space located and what type
              of space is it?
            </Para>
          </div>
          <InputsWrapper>
            <InputErrorWrap>
              <AddressAutofill
                accessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
                onRetrieve={(res) => handleAddressSelect(res)}
                theme={autoFillTheme}
                options={{ language: "en" }}
                style={{ width: "100%" }}
              >
                <Controller
                  name="retail_space_full_address"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      id="filled-basic"
                      variant="filled"
                      label="Address"
                      {...field}
                    />
                  )}
                />
                {errors.retail_space_full_address && (
                  <Para size="textxs" weight="regular" color="error">
                    {errors.retail_space_full_address.message}
                  </Para>
                )}
              </AddressAutofill>
            </InputErrorWrap>
            <input type="hidden" {...register("retail_space_address")} />
            <input type="hidden" {...register("retail_space_state_code")} />
            <input type="hidden" {...register("retail_space_city")} />
            <input type="hidden" {...register("retail_space_country")} />
            <input type="hidden" {...register("retail_space_longitude")} />
            <input type="hidden" {...register("retail_space_latitude")} />
            <input type="hidden" {...register("retail_space_geo_point")} />
            <InputErrorWrap>
              <Controller
                name="retail_space_type"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, ...field } }) => (
                  <Autocomplete
                    id="space-type"
                    freeSolo
                    value={value}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      )
                    }}
                    options={spaceTypes}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <Input {...params} {...field} label="Space Type" />
                    )}
                  />
                )}
              />
              {errors.retail_space_type && (
                <Para size="textxs" weight="regular" color="error">
                  {errors.retail_space_type.message}
                </Para>
              )}
            </InputErrorWrap>
          </InputsWrapper>
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

export default Step2;
