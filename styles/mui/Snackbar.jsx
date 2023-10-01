"use client";
import React from "react";
import styled, { keyframes } from "styled-components";
import { Para } from "../Typography";

export default function Snackbar({ text, success, error }) {
   return (
      <Wrapper>
         <Bar success={success} error={error}>
            <Para size="textmd" $weight="regular" color="white">
               {text}
            </Para>
         </Bar>
      </Wrapper>
   );
}

const slideInSlideOut = keyframes`
  0% {
    transform: translateY(-100px);
  }
  20% {
    transform: translateY(0px);
  }
  80% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-100px);
  }
`;

const Wrapper = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   margin: 30px 0px;
   animation: ${slideInSlideOut} 3s ease-in-out;
   animation-fill-mode: both;
   z-index: 50000;
   width: 100%;
   display: flex;
   justify-content: center;
`;

const Bar = styled.div`
   background-color: ${({ theme, success, error }) => {
      if (success) return theme.color.black;
      if (error) return theme.color.error;
      return theme.color.primary.brand.b600;
   }};
   padding: 15px;
   border-radius: 5px;
   width: fit-content;
`;
