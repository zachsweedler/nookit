'use client'
import { styled } from "styled-components";
import { H3, Para } from "@/styles/Typography";
import { Button } from "@/styles/Buttons";
import Link from "next/link";
import Container from "@/styles/Containers";
import supabaseLoader from "@/supabase-image-loader";
import Image from "next/image";

export default function CallAction() {
   return (
      <>
         <Wrapper>
            <Container
               size="xl"
               style={{ display: "flex", flexDirection: "column", gap: "30px" }}
            >
               <Grid>
                  <Copy>
                     <Para color="white" size="textmd" $weight="semibold">
                        Hosting
                     </Para>
                     <H3 color="white" $weight="medium">
                        Earn income as a nookit host
                     </H3>
                     <Para color="white" size="textmd" $weight="regular">
                        Put your store&apos;s open nook to work. Earn extra income for your business by
                        welcoming brands that complement your own brand and its
                        products/services.
                     </Para>
                     <Link href="/my-nooks">
                        <Button
                           $brandcolor={true}
                           style={{ width: "fit-content" }}
                        >
                           List your nook
                        </Button>
                     </Link>
                  </Copy>
                  <HostImage>
                     <Image
                        loader={supabaseLoader}
                        alt="host-image"
                        src="/assets/marketing/home/become-host/host.jpg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        fill={true}
                        style={{ objectFit: "cover" }}
                     />
                  </HostImage>
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
   background-color: ${({ theme }) => theme.color.primary.grey.g900};
   padding: 150px 0px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      align-items: start;
      justify-content: start;
      text-align: left;
   }
`;

const Grid = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
   width: 100%;
   grid-column-gap: 100px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
      grid-row-gap: 100px;
   }
`;

const Copy = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 30px;
   align-items: start;
   justify-content: center;
   max-width: 560px;
`;

const HostImage = styled.div`
   position: relative;
   overflow: hidden;
   height: 600px;
   width: 100%;
   border-radius: 5px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      height: 350px;
   }
`;
