"use client";
import { Button, ButtonTab } from "@/styles/Buttons";
import { H5, H6, Para } from "@/styles/Typography";
import { Divider } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { styled } from "styled-components";

export default function PricingCard() {
   const [currentTab, setCurrentTab] = useState(0);
   const tabs = [{ name: "for Pop-in Brand" }, { name: "for Host" }];

   return (
      <Card>
         <H6 $weight="semibold">
            Pricing
         </H6>
         <Tabs>
            {tabs.map((tab, index) => (
               <ButtonTab
                  key={tab.name}
                  onClick={() => setCurrentTab(index)}
                  $isActive={currentTab === index}
               >
                  {tab.name}
               </ButtonTab>
            ))}
         </Tabs>
         <Divider />
         <Rates>
            {currentTab === 0 ? (
               <>
                  <Grid>
                     <Para size="textmd" $weight="medium">
                        Host Rate
                     </Para>
                     <Para size="textmd" $weight="regular">
                        A mutually agreed-upon percentage of sales generated in
                        their store.
                     </Para>
                  </Grid>
                  <Grid>
                     <Para size="textmd" $weight="medium">
                        Nookit&apos;s Service Fee
                     </Para>
                     <Para size="textmd" $weight="regular">
                        NookIt charges the pop-in brand $25 per day of booking.
                     </Para>
                  </Grid>
               </>
            ) : (
               <>
                  <Grid>
                     <Para size="textmd" $weight="medium">
                        Your Rate
                     </Para>
                     <Para size="textmd" $weight="regular">
                        You charge the pop-in brand a percentage of the sales they generate in your store.
                     </Para>
                  </Grid>
                  <Grid>
                     <Para size="textmd" $weight="medium">
                        Nookit&apos;s Service Fee
                     </Para>
                     <Para size="textmd" $weight="regular">
                        NookIt charges the host $25 per day of booking.
                     </Para>
                  </Grid>
               </>
            )}
         </Rates>
         <Divider />
         <Link style={{ textDecoration: "none" }} href="/waitlist/dash">
            <Button style={{ width: "auto" }} $brandcolor='true'>
               Join Waitlist
            </Button>
         </Link>
      </Card>
   );
}

const Card = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 40px;
   position: relative;
   background-color: ${({ theme }) => theme.color.white};
   height: auto;
   width: 720px;
   border-radius: 5px;
   overflow: hidden;
   padding: 50px;
   @media screen and (max-width: ${({theme})=> theme.breakPoint.tablet}) {
        width: 100%;
        padding: 0px;
    }
`;

const Grid = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 30px;
   @media screen and (max-width: ${({theme})=> theme.breakPoint.tablet}) {
        grid-template-columns: 1fr;
    }
   
`;

const Tabs = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 20px;
`;

const Rates = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
   @media screen and (max-width: ${({theme})=> theme.breakPoint.tablet}) {
    row-gap: 50px;
    }
`;
