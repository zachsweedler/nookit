"use client";
import { Autocomplete as MuiAutocomplete } from "@mui/material";
import { styled as muistyled } from "@mui/system";

export const Autocomplete = muistyled(MuiAutocomplete)({
   "& .MuiAutocomplete-listbox": {
      fonSize: "1.6rem",
   },
   "& .MuiAutocomplete-option": {
      fonSize: "1.6rem",
   }
});
