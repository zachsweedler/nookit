"use client";
import PageHeader from "@/components/page-header/PageHeader";
import { ButtonTab } from "@/styles/Buttons";
import { Divider } from "@/styles/mui/Divider";
import { useState } from "react";
import styled from "styled-components";
import PaymentsForm from "./PaymentsForm";
import PayoutsForm from "./PayoutsForm";

export default function FormTabs() {

   const [activeIndex, setActiveIndex] = useState(0);
   const tabs = ["Payments", "Payouts"];

   return (
      <>
         <PageHeader title="Payments & Payouts" />
         <Tabs>
         {tabs.map((tab, index) => (
            <ButtonTab
               key={index}
               onClick={() => setActiveIndex(index)}
               $isActive={activeIndex === index}
            >
               {tab}
            </ButtonTab>
         ))}
         </Tabs>
         <Divider />
         { activeIndex === 0 && 
            <PaymentsForm/>
         }
         { activeIndex === 1 && 
            <PayoutsForm/>
         }
      </>
   );
}

const Tabs = styled.div`
    display: flex;
    flex-direction: row;
    column-gap: 12px;
`;
