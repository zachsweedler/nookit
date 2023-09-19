"use client";
import PageHeader from "@/components/page-header/PageHeader";
import { ButtonTab } from "@/styles/Buttons";
import { Divider } from "@/styles/mui/Divider";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import GuestBookings from "./GuestBookings";
import HostBookings from "./HostBookings";
import Container from "@/styles/Containers";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserId } from "@/hooks/client-side/useUserId";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function BookingsTabs() {
   const supabase = createClientComponentClient();
   const userId = useUserId(supabase);
   const [bookings, setBookings] = useState([]);
   const [activeIndex, setActiveIndex] = useState(0);
   const searchParams = useSearchParams();
   const router = useRouter();
   const pathname = usePathname();
   const tabs = ["As Guest", "As Host"];

   useEffect(() => {
      if (userId) {
         const fetchBookings = async () => {
            const { data, error } = await supabase
               .from("bookings")
               .select(
                `*,
                bookings_guest_company_id_fkey(name, logo),
                bookings_host_company_id_fkey(name, logo),
                nooks(
                   id, location_images, location_name, location_address, location_city, location_state_code, location_zip, daily_rate, company_id
                )`
               )
               .order("created_at", { ascending: false })
               .neq("status", "draft")
               .or(`guest_user_id.eq.${userId}, host_user_id.eq.${userId}`);
            if (error) {
               console.log("error fetching bookings", error);
            } else {
                console.log('booking data', data)
               setBookings(data);
            }
         };
         fetchBookings();
      }
   }, [supabase, userId]);

   return (
      <Container
         size="xl"
         style={{
            margin: "130px auto",
            display: "flex",
            flexDirection: "column",
            rowGap: "50px",
         }}
      >
         <PageHeader title="Bookings" />
         <Tabs>
            {tabs.map((tab, index) => (
               <ButtonTab
                  key={index}
                  onClick={() => {
                     setActiveIndex(index);
                   }}
                  $isActive={activeIndex === index}
               >
                  {tab}
               </ButtonTab>
            ))}
         </Tabs>
         <Divider />
         {activeIndex === 0 && <GuestBookings bookings={bookings} authUserId={userId} />}
         {activeIndex === 1 && <HostBookings bookings={bookings} authUserId={userId} />}
      </Container>
   );
}

const Tabs = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
`;
