"use client";

import { ButtonTab } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { H3, H6 } from "@/styles/Typography";
import supabaseLoader from "@/supabase-image-loader";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function How() {
   const guestCards = [
      {
         title: "Browse nooks",
         src: "assets/marketing/home/how-it-works/guest-1.png",
      },
      {
         title: "Request to book",
         src: "assets/marketing/home/how-it-works/guest-2.png",
      },
      {
         title: "Pop in!",
         src: "assets/marketing/home/how-it-works/guest-3.png",
      },
   ];

   const hostCards = [
      {
         title: "Create your listing",
         src: "assets/marketing/home/how-it-works/store-host-1.png",
      },
      {
         title: "Confirm booking",
         src: "assets/marketing/home/how-it-works/store-host-2.png",
      },
      {
         title: "Get paid",
         src: "assets/marketing/home/how-it-works/store-host-3.png",
      },
   ];

   const [currIndex, setCurrIndex] = useState(0);

   useEffect(() => {
      console.log("curr index", currIndex);
   }, [currIndex]);

   return (
      <Wrapper>
         <Container
            size="xl"
            style={{ display: "flex", flexDirection: "column", rowGap: "70px" }}
         >
            <Header>
               <H3>How it works</H3>
               <Tabs>
                  <ButtonTab
                     $isActive={currIndex === 0}
                     onClick={() => setCurrIndex(0)}
                  >
                     For Store Host
                  </ButtonTab>
                  <ButtonTab
                     $isActive={currIndex === 1}
                     onClick={() => setCurrIndex(1)}
                  >
                     For Pop in Guest
                  </ButtonTab>
               </Tabs>
            </Header>
            <Grid>
               {currIndex === 0
                  ? hostCards.map((card, index) => (
                       <Card key={index}>
                          <H6>{card.title}</H6>
                          <CardImgWrapper>
                             <Image
                                loader={supabaseLoader}
                                alt="host-card-image"
                                src={card.src}
                                fill={true}
                                style={{
                                   objectFit: "contain",
                                   objectPosition: "bottom",
                                   userSelect: "none",
                                   pointerEvents: "none"
                                }}
                             />
                          </CardImgWrapper>
                       </Card>
                    ))
                  : guestCards.map((card, index) => (
                       <Card key={index}>
                          <H6>{card.title}</H6>
                          <CardImgWrapper>
                             <Image
                                loader={supabaseLoader}
                                alt="guest-card-image"
                                src={card.src}
                                fill={true}
                                style={{
                                   objectFit: "contain",
                                   objectPosition: "bottom",
                                   userSelect: "none",
                                   pointerEvents: "none"
                                }}
                             />
                          </CardImgWrapper>
                       </Card>
                    ))}
            </Grid>
         </Container>
      </Wrapper>
   );
}

const Wrapper = styled.div`
   background-color: ${({ theme }) => theme.color.white};
   padding: 0px 0px 100px 0px;
`;

const Header = styled.div`
   align-items: flex-start;
   display: flex;
   flex-direction: column;
   height: auto;
   justify-content: center;
   row-gap: 30px;
   width: 100%;
`;

const Grid = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr 1fr;
   grid-gap: 30px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.desktop}) {
      grid-template-columns: 1fr;
   }
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
   }
`;

const Card = styled.div`
   background-color: ${({ theme }) => theme.color.primary.brand.b925};
   align-items: flex-start;
   display: flex;
   flex-direction: column;
   height: auto;
   justify-content: flex-start;
   padding: 30px 30px 0px 30px;
   position: relative;
   border-radius: 12px;
   overflow: hidden;
   row-gap: 30px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.desktop}) {
      row-gap: 30px;
   }
`;

const CardImgWrapper = styled.div`
   bottom: 0;
   height: auto;
   left: 50%;
   position: relative;
   height: 450px;
   width: 100%;
   border-radius: 6px;
   overflow: hidden;
   transform: translateX(-50%);
   @media screen and (max-width: 1400px) {
      height: 350px;
   }
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      height: 350px;
   }
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.mobile}) {
      height: 350px;
   }
`;

const Tabs = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
`;
