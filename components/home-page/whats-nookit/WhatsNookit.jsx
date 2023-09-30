"use client";

import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import { H1, H3, Para } from "@/styles/Typography";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";

export default function WhatsNookit() {
   const router = useRouter();
   return (
      <Container size="xl">
         <Grid>
            <CopyCard>
               <Header>
                  <Para size="textmd" $weight="medium">
                     What’s Nookit?
                  </Para>
                  <H1>Pop into store’s that align with your brand.</H1>
               </Header>
               <Copy>
                  <Para size="textmd" $weight="regular">
                     Nookit is a website where brands can book a small space or
                     as we call it, a &quot;nook,&quot; within another
                     brand&apos;s storefront; This allows brands to pop-in in
                     environments that align with their image, offering
                     collaborative brand experiences for in-store customers.
                  </Para>
                  <Button
                     $brandoutline={true}
                     style={{ width: "auto" }}
                     onClick={() => router.push("/s")}
                  >
                     Browse Nooks
                  </Button>
               </Copy>
            </CopyCard>
            <JoinCard>
               <StoreCard>
                  <StoreImage>
                     <Image
                        alt="nookit-logo"
                        src="/front-general-circle.png"
                        fill={true}
                        style={{ objectFit: "cover", pointerEvents: "none" }}
                     />
                  </StoreImage>
               </StoreCard>
               <JoinButton
                  $brandcolor={true}
                  onClick={() => router.push("/login")}
               >
                  Join Nookit
               </JoinButton>
            </JoinCard>
         </Grid>
      </Container>
   );
}

const Grid = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 40px;
   padding: 90px 0px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      flex-direction: column;
      row-gap: 30px;
      padding: 100px 0px;
   }
`;

const CopyCard = styled.div`
   padding: 90px;
   display: flex;
   row-gap: 100px;
   width: 100%;
   flex-direction: column;
   background-color: ${({ theme }) => theme.color.primary.brand.b925};
   border-radius: 12px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      padding: 60px 30px;
      row-gap: 50px;
   }
`;

const Header = styled.div`
   display: flex;
   row-gap: 40px;
   flex-direction: column;
`;

const Copy = styled(Header)`
   align-items: start;
`;

const JoinCard = styled.div`
   width: 100%;
   display: flex;
   flex-direction: column;
   row-gap: 40px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      row-gap: 30px;
   }
`;

const StoreCard = styled.div`
   background-color: ${({ theme }) => theme.color.primary.brand.b925};
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 12px;
   width: 100%;
   height: 100%;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      padding: 50px;
   }
`;

const StoreImage = styled.div`
   position: relative;
   width: 400px;
   height: 400px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      width: 250px;
      height: 250px;
   }
`;

const JoinButton = styled(Button)`
   height: 100px;
   font-size: 20px !important;
   border-radius: 12px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      height: 70px;
      font-size: 18px !important;
      border-radius: 9px;
   }
`;
