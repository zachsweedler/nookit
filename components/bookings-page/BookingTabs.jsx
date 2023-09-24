"use client";
import PageHeader from "@/components/page-header/PageHeader";
import { ButtonTab } from "@/styles/Buttons";
import { Divider } from "@/styles/mui/Divider";
import styled from "styled-components";
import { usePathname, useRouter } from "next/navigation";
import { Para } from "@/styles/Typography";
import Back from "../back/Back";

export default function BookingsTabs() {
   const router = useRouter();
   const pathname = usePathname();
   const tabs = [
      { title: "As Guest", href: "/bookings/guest" },
      { title: "As Host", href: "/bookings/host" },
   ];

   return (
      <>
         {pathname !== "/bookings/guest" &&
          pathname !== "/bookings/host" ? (
            <Back text="Back to Bookings"/>
         ) : (
            <>
               <PageHeader title="Bookings" />
               <Tabs>
                  {tabs.map((tab) => {
                     const isActive = pathname === tab.href;
                     return (
                        <ButtonTab
                           key={tab.href} // Add a unique key to each element in the map function
                           onClick={() => {
                              router.push(tab.href);
                           }}
                           $isActive={isActive}
                        >
                           {tab.title}
                        </ButtonTab>
                     );
                  })}
               </Tabs>
               <Divider />
            </>
         )}
      </>
   );
}

const Tabs = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
`;
