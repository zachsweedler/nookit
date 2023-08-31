'use client'
import { TextField } from "@mui/material";
import { styled as muistyled } from "@mui/system";
import './Input.css'

export const Input = muistyled(TextField)({
    "& .MuiInputBase-root": {
      borderRadius: "5px",
      backgroundColor: "#F8F6F5",
      height: "55px",
      width: "100%",
      '&:hover': {
         backgroundColor: "#efebea",
      }
    },
    "& .MuiInputBase-root:hover:before": {
      borderBottom: 'none !important'
    },
    "& .MuiFormLabel-root": {

      color:"#A09996 !important"
    },
    "& .MuiInputBase-root:after": {
      borderBottom: '2px solid #C1482F'
    },
    "& .MuiInputBase-root:before": {
      borderBottom: "none" 
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#C1482F",
      borderWidth: "1px",
      "&:hover": {
        border: "none"
      }
    },
    "& .Mui-disabled": {
      borderRadius: "5px",
      backgroundColor: "#e6e2e1",
      color: "transparent",
      opacity: "90%",
      cursor: "default",
      border: "none"
    },
});


