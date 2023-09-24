"use client";
import PageHeader from "@/components/page-header/PageHeader";
import { ButtonTab } from "@/styles/Buttons";
import { Divider } from "@/styles/mui/Divider";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";

export default function PayPayoutTabs() {
   const router = useRouter();
   const pathname = usePathname();
   const tabs = [
      { title: "Payments", href: "/account/payments-payouts/payments" },
      { title: "Payouts", href: "/account/payments-payouts/payouts" },
   ];

   return (
      <>
         <PageHeader title="Payments & Payouts" />
         <Tabs>
            {tabs.map((tab) => {
               const isActive = pathname === tab.href;
               return (
                  <>
                     <ButtonTab
                        onClick={() => {
                           router.push(tab.href);
                        }}
                        $isActive={isActive ? true : false}
                     >
                        {tab.title}
                     </ButtonTab>
                  </>
               );
            })}
         </Tabs>
         <Divider />
      </>
   );
}

const Tabs = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
`;
