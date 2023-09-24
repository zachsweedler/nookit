"use client";
import { styled } from "styled-components";
import BookingRow, { StyledPara } from "./BookingRow";
import EmptyState from "../empty-state/EmptyState";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserId } from "@/hooks/client-side/useUserId";
import { useEffect, useState } from "react";
import Loading from "../loading/Loading";

export default function GuestBookings() {
   const headers = [
      "",
      "Nook",
      "Status",
      "Host",
      "Start Date",
      "End Date",
      "Total Before Tax",
   ];

   const supabase = createClientComponentClient();
   const userId = useUserId(supabase);
   const [bookings, setBookings] = useState();
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (userId) {
         const fetchBookings = async () => {
            setLoading(true);
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
               .or(`guest_user_id.eq.${userId}`);
            if (error) {
               console.log("error fetching bookings", error);
               setLoading(false);
            } else {
               setBookings(data);
               setLoading(false);
            }
         };
         fetchBookings();
      }
   }, [supabase, userId]);

   return (
      <>
         {loading ? (
            <CenterLoading>
               <Loading />
            </CenterLoading>
         ) : (
            <Grid>
               {bookings && bookings.length > 0 ? (
                  <>
                     <TableHeader>
                        {headers.map((header, index) => (
                           <GridCell key={index}>
                              <StyledPara
                                 size="textmd"
                                 $weight="medium"
                                 color="primary.grey.g800"
                              >
                                 {header}
                              </StyledPara>
                           </GridCell>
                        ))}
                     </TableHeader>
                     {bookings.map((booking) => (
                        <BookingRow
                           key={booking.id}
                           status={booking.status}
                           bookingId={booking.id}
                           nookId={booking.nooks.id}
                           hostUserId={booking.host_user_id}
                           guestUserId={booking.guest_user_id}
                           userId={userId}
                           locationImage={booking.nooks.location_images?.[0]}
                           locationName={booking.nooks.location_name}
                           locationAddress={booking.nooks.location_address}
                           locationCity={booking.nooks.location_city}
                           locationState={booking.nooks.location_state_code}
                           locationZip={booking.nooks.location_zip}
                           hostName={booking.bookings_host_company_id_fkey.name}
                           hostLogo={booking.bookings_host_company_id_fkey.logo}
                           guestName={
                              booking.bookings_guest_company_id_fkey.name
                           }
                           guestLogo={
                              booking.bookings_guest_company_id_fkey.logo
                           }
                           dailyRate={booking.nooks.daily_rate}
                           bookingPrice={booking.booking_price}
                           bookingPriceTotalBeforeTax={
                              booking.booking_price_total_before_taxes
                           }
                           processingFee={booking.processing_fee}
                           hostPayout={
                              booking.booking_price - booking.processing_fee
                           }
                           startDate={booking.start_date}
                           endDate={booking.end_date}
                           daysCount={booking.days_count}
                           guestPlan={booking.guest_plan}
                           guestQuestions={booking.guest_questions}
                        />
                     ))}
                  </>
               ) : (
                  <EmptyState
                     title="No bookings yet"
                     description="As a guest, your bookings will appear here."
                     button="Browse Nooks"
                     buttonHref="/s"
                  />
               )}
            </Grid>
         )}
      </>
   );
}

const Grid = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
   grid-template-columns: 1fr;
   grid-template-rows: auto;
   width: 100%;
`;

export const GridCell = styled.div`
   display: flex;
   flex-direction: row;
   padding: 0px 20px;
   overflow: hidden;
   width: 100%;
`;

const TableHeader = styled.div`
   display: grid;
   grid-template-columns: 50px 1fr 1fr 1fr 1fr 1fr 1fr;
   height: 50px;
   padding: 0px 20px;
   width: 100%;
   background: ${({ theme }) => theme.color.primary.grey.g25};
   border-radius: 5px;
   align-items: center;
`;

const CenterLoading = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   width: 100%;
`;
