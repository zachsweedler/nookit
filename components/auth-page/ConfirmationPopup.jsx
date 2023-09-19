"use client";
import { Para } from "@/styles/Typography";
import React from "react";
import { styled } from "styled-components";

function ConfirmationPopup({ onClick }) {
   return (
      <Wrapper>
         <>
            <Para size="textsm" $weight="medium" color="primary.brand.b600">
               Check Your Inbox
            </Para>
            <Para $weight="semibold" size="textxl">
               Please check your inbox for a login link.
            </Para>
            <NoteWrapper>
               <Para $weight="medium" size="textsm">Heads Up!</Para>
               <Para $weight="regular" size="textsm">
                  Login links can only be used in the same browser that they are
                  sent from. So, a login link sent from Chrome on Desktop
                  will be invalid if used on a Mobile Device.
               </Para>
            </NoteWrapper>
            <ResendWrapper>
               <Para size="textsm" $weight="regular" color="primary.brand.b950">
                  Don&apos;t see it?
               </Para>
               <Para
                  size="textsm"
                  $weight="medium"
                  color="primary.brand.b600"
                  onClick={onClick}
                  style={{ cursor: "pointer" }}
                  $isLink={true}
               >
                  Resend
               </Para>
            </ResendWrapper>
         </>
      </Wrapper>
   );
}

export default ConfirmationPopup;

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
   padding: 45px;
   width: 100%;
   border-radius: 5px;
   background-color: ${({ theme }) => theme.color.primary.brand.b50};
`;

const ResendWrapper = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 5px;
`;

const NoteWrapper = styled.div`
   display: flex;
   flex-direction: column;
   flex-wrap: wrap;
   row-gap: 12px;
   padding: 30px;
   width: 100%;
   border-radius: 5px;
   background-color: ${({ theme }) => theme.color.primary.brand.b100};
`