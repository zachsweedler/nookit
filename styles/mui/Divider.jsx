'use client'
import { Divider as MuiDivider } from "@mui/material";
import { styled as muistyled } from "@mui/system";

export const Divider = muistyled(MuiDivider)({
    "& .MuiDivider-root": {
      borderColor: "#dddddd !important",
}});


