"use client";
import React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import StyledComponentsRegistry from "@/registry/registry";

const theme = {
  color: {
    white: "#ffffff",
    black: "#000000",
    error: "#851919",
    primary: {
      brand: {
        b25: "#FEF9F7",
        b50: "#FEF3F0",
        b100: "#FCE1D9",
        b200: "#F8B099",
        b300: "#F69C80",
        b400: "#F48866",
        b500: "#EF4D1A",
        b600: "#ED3900",
        b700: "#DB3602",
        b800: "#C32F00",
        b900: "#C32F00",
        b925: "#F8F6F5",
        b930: "#eee9e4",
        b950: "#998A87",
        b1000: "#4D4D4D"
      },
      grey: {
        g25: "#F5F5F5",
        g50: "#eee",
        g100: "#D9D9D9",
        g200: "#C0C0C0",
        g300: "#AFAFAF",
        g400: "#9A9A9A",
        g500: "#848484",
        g600: "#757575",
        g700: "#5C5C5C",
        g800: "#363636",
        g900: "#1A1A1A",
      },
    },
  },
  fontSize: {
    display2xl: "8rem", // <H1 />
    displayxl: "7rem", // <H2 />
    displaylg: "6rem", // <H3 />
    displaymd: "5rem", // <H4 />
    displaysm: "3rem", // <H5 />
    displayxs: "2.5rem", // <H6 />
    textxl: "2.3rem", // <Para xl />
    textlg: "1.8rem", // <Para lg />
    textmd: "1.4rem", // <Para md />
    textsm: "1.2rem",  // <Para sm />
    textxs: "1.1rem", // <Para xs />
    tablet: {
      display2xl: "5rem", // <H1 />
      displayxl: "4rem", // <H2 />
      displaylg: "4rem", // <H3 />
      displaymd: "3rem", // <H4 />
      displaysm: "2.5rem", // <H5 />
      displayxs: "2.0rem", // <H6 />
      textxl: "2.0rem", // <Para xl />
      textlg: "1.6rem", // <Para lg />
      textmd: "1.4rem", // <Para md />
      textsm: "1.2rem",  // <Para sm />
      textxs: "1.1rem", // <Para xs />
    }
  },
  letterSpacing: {
    display2xl: "-0.25rem", // <H1 />
    displayxl: "-0.25rem", // <H2 />
    displaylg: "-0.25rem", // <H3 />
    displaymd: "-0.14rem", // <H4 />
    displaysm: "-0.02rem", // <H5 />
    displayxs: "-0.02rem", // <H6 />
    textxl: "0.01rem", // <Para xl />
    textlg: "0.01rem", // <Para lg />
    textmd: "0.01rem", // <Para md />
    textsm: "0rem", // <Para sm />
    textxs: "0rem", // <Para xs />
  },
  lineHeight: {
    display2xl: "112%", // <H1 />
    displayxl: "112%", // <H2 />
    displaylg: "112%", // <H3 />
    displaymd: "125%", // <H4 />
    displaysm: "125%", // <H5 />
    displayxs: "125%", // <H6 />
    textxl: "154%", // <Para xl />
    textlg: "179%", // <Para lg />
    textmd: "179%", // <Para md />
    textsm: "179%", // <Para sm />
    textxs: "179%", // <Para xs />
  },
  fontWeight: {
    display2xl: {
      bold: "700", // <H1 bold />
      semibold: "600", // <H1 semibold />
      medium: "500", // <H1 medium />
      regular: "400", // <H1 regular />
    },
    displayxl: {
      bold: "700", // <H2 bold />
      semibold: "600", // <H2 semibold />
      medium: "500", // <H2 medium /> 
      regular: "400", // <H2 regular /> 
    },
    displaylg: {
      bold: "700", // <H3 bold /> 
      semibold: "600", // <H3 semibold /> 
      medium: "500", // <H3 medium /> 
      regular: "400", // <H3 regular /> 
    },
    displaymd: {
      bold: "700", // <H4 bold /> 
      semibold: "600", // <H4 semibold /> 
      medium: "500", // <H4 medium /> 
      regular: "400", // <H4 regular /> 
    },
    displaysm: {
      bold: "700", // <H5 bold /> 
      semibold: "600", // <H5 semibold /> 
      medium: "500", // <H5 mediumm /> 
      regular: "400", // <H5 regular /> 
    },
    displayxs: {
      bold: "700", // <H6 bold /> 
      semibold: "600", // <H6 semibold /> 
      medium: "500", // <H6 medium /> 
      regular: "400", // <H6 regular /> 
    },
    textxl: {
      bold: "700", // <Para xl bold />
      semibold: "600", // <Para xl semibold />
      medium: "500",  // <Para xl medium />
      regular: "400", // <Para xl regular />
    },
    textlg: {
      bold: "700", // <Para lg bold />
      semibold: "600", // <Para lg semibold />
      medium: "500", // <Para lg medium />
      regular: "400", // <Para lg regular />
    },
    textmd: {
      bold: "700", // <Para md bold />
      semibold: "600", // <Para md semibold />
      medium: "500", // <Para md medium />
      regular: "400", // <Para md regular />
    },
    textsm: {
      bold: "700", // <Para sm bold />
      semibold: "600", // <Para sm semibold />
      medium: "500", // <Para sm medium />
      regular: "400", // <Para sm regular />
    },
    textxs: {
      bold: "700", // <Para xs bold />
      semibold: "600", // <Para xs semibold />
      medium: "500", // <Para xs medium />
      regular: "400", // <Para xs regular />
    },
  },
  borderRadius: {
    xl: "20px",
    lg: "12px",
    md: "5px",
    sm: "2.5px",
  },
  boxShadow: {
    shadow3xl: "0px 32px 64px -12px rgba(16, 24, 40, 0.20);",
    shadow2xl: "0px 24px 48px -12px rgba(16, 24, 40, 0.25);",
    shadowxl: "0px 8px 8px -4px rgba(16, 24, 40, 0.04), 0px 20px 24px -4px rgba(16, 24, 40, 0.10);",
    shadowlg: "0px 4px 6px -2px rgba(16, 24, 40, 0.05), 0px 12px 16px -4px rgba(16, 24, 40, 0.10);",
    shadowmd: "0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10);",
    shadowsm: "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10);",
    shadowxs: "0px 1px 2px 0px rgba(16, 24, 40, 0.05);",
  },
  breakPoint: {
    desktop: "1200px",
    tablet: "992px",
    mobile: "768px",
  },
  container: {
    xxl: "1800px",
    xl: "1440px",
    lg: "1250px",
    md: "900px",
    sm: "800px",
    xs: "500px"
  },
};

export function ThemeWrapper({ children }) {
  return (
    <StyledComponentsRegistry>
      <StyledThemeProvider theme={theme}>
          {children}
      </StyledThemeProvider>
    </StyledComponentsRegistry>
  );
}




