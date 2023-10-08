"use client";
import { H4, Para } from "@/styles/Typography";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

function AccordianItem({ question, onClick, isOpen }) {
   return (
      <Wrapper onClick={onClick} isOpen={isOpen}>
         <Para size="textlg" $weight="semibold" style={{ pointerEvents: "none" }}>
            {question}
         </Para>
         <Image
            src="/down-arrow-black.svg"
            alt="open-faq-icon"
            width={18}
            height={18}
         />
      </Wrapper>
   );
}

export default AccordianItem;

const Wrapper = styled.div`
   padding: 25px;
   justify-content: space-between;
   display: flex;
   align-items: center;
   border-radius: 12px;
   background-color: ${({isOpen, theme})=> isOpen ? theme.color.primary.brand.b925 : 'transparent'};
   &:hover {
      cursor: pointer;
      background-color: ${({theme})=> theme.color.primary.brand.b925};
   }
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      padding: 25px;
      column-gap: 30px;
   }
`;
