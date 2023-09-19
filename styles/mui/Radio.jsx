import {
  FormControl as MuiFormControl,
  FormControlLabel,
  RadioGroup,
  Radio as MuiRadio,
} from "@mui/material";
import { styled as muistyled } from "@mui/system";

const StyledFormControl = muistyled(MuiFormControl)({
  "& .MuiTypography-root": {
    fontSize: "1.4rem",
  },
  "& .Mui-checked": {
    color: "rgb(193, 72, 47) !important"
  }
});

const StyledRadio = muistyled(MuiRadio)({
  "&.MuiRadio-root": {
    "&:hover": {
      backgroundColor: '#F5EFEE !important'
    }
  },
});

export default function Radio({ options, groupName, register }) {
  return (
    <StyledFormControl>
      <RadioGroup aria-labelledby="booking-frequencies" name={groupName}>
        {options?.map((option, index) => (
          <>
            <FormControlLabel
              {...register(`${groupName}`)}
              key={index}
              value={option.name}
              control={
                <StyledRadio
                  icon={
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/radio-unchecked-brand-icon.svg"
                      alt="unchecked-icon"
                      style={{ width: "25px", height: "25px" }}
                    />
                  }
                  checkedIcon={
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/radio-checked-brand-icon.svg"
                      alt="checked-icon"
                      style={{ width: "25px", height: "25px" }}
                    />
                  }
                />
              }
              label={option.name}
            />
          </>
        ))}
      </RadioGroup>
    </StyledFormControl>
  );
}
