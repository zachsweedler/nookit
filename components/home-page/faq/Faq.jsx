"use client";
import Accordion from "@/components/accordian/Accordian";
import Container from "@/styles/Containers";
import { H2, H3, H4 } from "@/styles/Typography";
import React from "react";
import styled from "styled-components";

function Faq() {
   const qas = [
      {
         question: "As a store host, what can I charge my pop in guests?",
         answer:
            "When you list a nook, you can choose between charging a fixed daily rate or a percent of sales.",
      },
      {
         question: "As a store host, how much does Nookit take from my payout?",
         answer:
            "For listings that charge guests a daily rate, Nookit will take anywhere from 12% to 18% of the host payout; the percentage varies based on the length of the booking in days. Alternatively, for listings that charge pop in guests a percentage of sales, Nookit charges the host a fixed daily rate.",
      },
      {
         question: "As a store host, do I have control over who books my nook?",
         answer:
            "Absolutely! At Nookit's core, we are about bringing brands together to create aligned in-store collaborations. Anytime a brand requests to book your nook, you have the option to confirm or decline that request.",
      },
      {
         question: "As a pop in guest, what do I pay in additional fees?",
         answer:
            "As of today, the only additional fee you pay on top of the price to book the nook is our platform's processing fee. For listings that charge guests a daily rate, this fee will range anywhere from 12% to 18% of the booking price; the percentage varies based on the length of the booking in days. Alternatively, for listings that charge pop in guests a percentage of sales, Nookit charges the pop in guest a fixed daily rate.",
      },
      {
         question: "As a pop in guest, when is my card charged for the booking?",
         answer:
            "Your card will only be charged upon the successful completion of a given booking.",
      },
   ];

   return (
      <Wrapper>
         <Container size="xl">
            <Grid>
               <StickyWrapper>
                  <H3>
                     Your questions, <br />
                     answered:
                  </H3>
               </StickyWrapper>
               <Accordion qas={qas} />
            </Grid>
         </Container>
      </Wrapper>
   );
}

export default Faq;

const Wrapper = styled.div`
   padding-bottom: 100px;
`;
const StickyWrapper = styled.div`
   position: sticky;
   top: 150px;
   width: 100%;
   height: 100%;
   @media screen and (max-width: 1000px) {
      position: relative;
      top: 0;
   }
`;

const Grid = styled.div`
   display: flex;
   width: 100%;
   flex-direction: row;
   position: relative;
   @media screen and (max-width: 1000px) {
      flex-direction: column;
      row-gap: 50px;
   }
`;
