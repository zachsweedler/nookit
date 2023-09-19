"use client";
import { styled } from "styled-components";
import BookingRow, { StyledPara } from "./BookingRow";
import EmptyState from "../empty-state/EmptyState";

export default function HostBookings({ bookings, authUserId }) {
   const headers = [
      "",
      "Nook",
      "Status",
      "Guest",
      "Start Date",
      "End Date",
      "Your Payout",
   ];

   const hostBookings = bookings.filter(
      (booking) =>
         booking.host_user_id == authUserId
   );

   return (
      <>
         <Grid>
            {hostBookings && hostBookings.length > 0 ? (
               <>
                  <TableHeader>
                     {headers.map((header, index) => (
                        <GridCell key={index}>
                           <StyledPara
                              size="textmd"
                              $weight="medium"
                              color="primary.grey.g700"
                           >
                              {header}
                           </StyledPara>
                        </GridCell>
                     ))}
                  </TableHeader>
                  {hostBookings.map((booking) => (
                     <BookingRow
                        key={booking.id}
                        status={booking.status}
                        bookingId={booking.id}
                        nookId={booking.nooks.id}
                        hostUserId={booking.host_user_id}
                        guestUserId={booking.guest_user_id}
                        authUserId={authUserId}
                        locationImage={booking.nooks.location_images?.[0]}
                        locationName={booking.nooks.location_name}
                        locationAddress={booking.nooks.location_address}
                        locationCity={booking.nooks.location_city}
                        locationState={booking.nooks.location_state_code}
                        locationZip={booking.nooks.location_zip}
                        hostName={booking.bookings_host_company_id_fkey.name}
                        hostLogo={booking.bookings_host_company_id_fkey.logo}
                        guestName={booking.bookings_guest_company_id_fkey.name}
                        guestLogo={booking.bookings_guest_company_id_fkey.logo}
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
                  title="No bookings yet."
                  description="As a host, all your guest's bookings will appear here."
                  button="Manage Nooks"
                  buttonHref="/my-nooks"
               />
            )}
         </Grid>
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
