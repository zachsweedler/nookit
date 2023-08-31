"use client";
import { MenuItem as MuiMenuItem } from "@mui/material";
import { styled as muistyled } from "@mui/system";

export const MenuItem = muistyled(MuiMenuItem)({
  color: 'black',
  fontSize: '1.4rem',
  overflow: 'scroll',
  fontFamily: '__Poppins_1562c7',
  maxHeight: '200px',
  '& .MuiList-root': {
    height: "200px"
  }
})