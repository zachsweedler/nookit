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
               <HeaderWrapper>
                  <H1 weight="semibold">Showcase your brand</H1>
                  <FlexWrap>
                     <H1 weight="semibold" color="primary.brand.b600">
                        within
                     </H1>
                     <H1 weight="semibold">other</H1>
                     <H1 weight="semibold">stores</H1>
                  </FlexWrap>
               </HeaderWrapper>
               <DescriptionWrapper>
                  <Para
                     size="textmd"
                     weight="regular"
                     color="primary.grey.g900"
                  >
                     Nookit is a website where brands can book a
                     &quot;nook&quot; within another brand&apos;s storefront.
                     This allows brands to pop-in in environments that align
                     with their image, offering collaborative brand experiences
                     for in-store customers
                  </Para>
               </DescriptionWrapper>
               <Link href="/waitlist/dash">
                  <Button style={{ width: "fit-content" }} $blackcolor="true">
                     Join Waitlist
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
   padding: 150px 0px 150px;
   flex-direction: column;
   align-items: start;
   gap: 50px;
   width: 100%;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
   }
`;

const HeaderWrapper = styled.div`
   display: flex;
   flex-direction: column;
   column-gap: 15px;
   width: 100%;
`;

const FlexWrap = styled.div`
   display: flex;
   flex-wrap: wrap;
   column-gap: 25px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      column-gap: 12px;
   }
`;

const DescriptionWrapper = styled.div`
   display: flex;
   flex-direction: row;
   width: 100%;
   max-width: 720px;
`;
