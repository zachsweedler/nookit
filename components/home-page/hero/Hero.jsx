'use client'
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { H1, Para } from "@/styles/Typography";
import Marquee from "react-fast-marquee";
import { styled } from "styled-components";
import ImageCard from "./ImageCard";
import Link from "next/link";

export default function Hero() {
   
   const images = [
      { src: "/assets/marketing/home/hero/hero-image-1.jpg" },
      { src: "/assets/marketing/home/hero/hero-image-2.jpg" },
      { src: "/assets/marketing/home/hero/hero-image-3.jpg" },
      { src: "/assets/marketing/home/hero/hero-image-4.jpg" },
   ];

   return (
      <>
         <Container size="xl">
            <Wrapper>
               <H1 $weight="semibold" style={{ display: "inline" }}>
                  Showcase your brand within other stores
               </H1>
               <DescriptionWrapper>
                  <Para
                     size="textmd"
                     $weight="regular"
                     color="primary.grey.g900"
                  >
                     Nookit is a website where brands can book a
                     &quot;nook&quot; within another brand&apos;s storefront.
                     This allows brands to pop-in in environments that align
                     with their image, offering collaborative brand experiences
                     for in-store customers.
                  </Para>
               </DescriptionWrapper>
               <Link href="/s">
                  <Button style={{ width: "fit-content" }} $blackcolor="true">
                     Browse Nooks
                  </Button>
               </Link>
            </Wrapper>
         </Container>
         <Marquee>
            {images.map((image, index) => (
               <ImageCard key={index} src={image.src} />
            ))}
         </Marquee>
      </>
   );
}

const Wrapper = styled.div`
   display: flex;
   height: 80vh;
   flex-direction: column;
   align-items: start;
   text-align: start;
   justify-content: center;
   max-width: 1000px;
   gap: 50px;
   width: 100%;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
   }
`;

const DescriptionWrapper = styled.div`
   display: flex;
   flex-direction: row;
   width: 100%;
   max-width: 720px;
`;
