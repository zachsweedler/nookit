"use client";
import { styled } from "styled-components";
import { H1, Para } from "@/styles/Typography";
import { Button } from "@/styles/Buttons";
import Link from "next/link";
import Container from "@/styles/Containers";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BecomeHost() {

   const [isDesktop, setIsDesktop] = useState();

   const updateMedia = () => {
      setIsDesktop(window.innerWidth > 1000);
   };

   useEffect(() => {
      window.addEventListener("resize", updateMedia);
      updateMedia();
      return () => window.removeEventListener("resize", updateMedia);
   });

   const router = useRouter();


   return (
      <>
         <Wrapper>
            <Container
               size="xl"
               style={{ display: "flex", flexDirection: "column", gap: "30px", height: 'auto' }}
            >
               <Grid>
                  <Copy>
                     <Para size="textmd" $weight="semibold">
                        Hosting
                     </Para>
                     <H1>
                        Earn income as a nookit host
                     </H1>
                     <Para
                        size="textmd"
                        $weight="regular"
                        style={{ maxWidth: "700px" }}
                     >
                        Put your store&apos;s open nook to work. Earn extra
                        income for your business by welcoming brands that
                        complement your own brand and its products/services.
                     </Para>
                     <Link href="/my-nooks">
                        <Button
                           $brandcolor={true}
                           style={{ width: "fit-content" }}
                           onClick={() => router.push("/login")}
                        >
                           Become a Host
                        </Button>
                     </Link>
                  </Copy>
                  <Marquee speed={20} style={{height: 'fit-content !important'}}>
                     <Image
                        alt="host-image"
                        src="/become-host.png"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        width={isDesktop ? 1350 : 800}
                        height={isDesktop ? 520 : 300}
                        style={{ pointerEvents: 'none'}}
                     />
                  </Marquee>
               </Grid>
            </Container>
         </Wrapper>
      </>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: start;
   text-align: start;
   justify-content: center;
   background-color: ${({ theme }) => theme.color.white};
   padding: 0px 0px 100px 0px;
   width: 100%;
   height: fit-content;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      align-items: start;
      justify-content: start;
      text-align: left;
      height: fit-content;
   }
`;

const Grid = styled.div`
   display: flex;
   flex-direction: column;
   width: 100%;
   background-color: ${({ theme }) => theme.color.primary.brand.b925};
   border-radius: 20px;
   padding-top: 50px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      
   }
`;

const Copy = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 30px;
   align-items: center;
   justify-content: center;
   width: 100%;
   text-align: center;
   padding: 60px 30px 0px 30px;
   max-width: 800px;
   margin: auto;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      padding: 60px 30px 0px 30px;
      text-align: left;
      align-items: start;
   }
`;
