"use client";
import { Para } from "@/styles/Typography";
import { Divider } from "@/styles/mui/Divider";
import { styled } from "styled-components";
import Image from "next/image";
import supabaseLoader from "@/supabase-image-loader";
import { Button } from "@/styles/Buttons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Snackbar from "@/styles/mui/Snackbar";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useUserId } from "@/hooks/client-side/useUserId";
import Loading from "@/components/loading/Loading";

export default function Summary() {
   const supabase = createClientComponentClient();
   const userId = useUserId(supabase);
   const params = useParams();
   const [success, setSuccess] = useState();
   const [error, setError] = useState();
   const [booking, setBooking] = useState();
   const [loading, setLoading] = useState();

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
                   id, location_images, location_name, location_address, location_city, location_state_code, location_zip, price, price_type, company_id
                )`
               )
               .order("created_at", { ascending: false })
               .neq("status", "draft")
               .or(`guest_user_id.eq.${userId}, host_user_id.eq.${userId}`);
            if (error) {
               console.log("error fetching bookings", error);
               setLoading(false);
            } else {
               setBooking(data[0]);
               setLoading(false);
               console.log("data", data);
            }
         };
         fetchBookings();
      }
   }, [supabase, userId]);

   const handleAccept = async () => {
      try {
         // Clear previous success and error messages
         setSuccess(null);
         setError(null);

         // Update the booking status to "accepted"
         const { error: bookingUpdateError } = await supabase
            .from("bookings")
            .update({
               status: "accepted",
            })
            .eq("id", params.slug);

         if (bookingUpdateError) {
            throw bookingUpdateError; // Throw the error to handle it below
         }

         // Fetch the current booked dates of the nook
         const { data: nookData, error: bookedError } = await supabase
            .from("nooks")
            .select("booked_dates")
            .eq("id", booking.nook_id)
            .single();

         if (bookedError) {
            throw bookedError; // Throw the error to handle it below
         }

         const currBookedDatesArray = nookData.booked_dates || [];

         // Format this booking's date range
         const bookingDates = {
            start_date: booking.start_date,
            end_date: booking.end_date,
         };

         // Add it to the current booked dates array for the nook
         const newBookedDatesArray = [...currBookedDatesArray, bookingDates];

         // Update the nook with the new booked dates array
         const { error: nookUpdateError } = await supabase
            .from("nooks")
            .update({
               booked_dates: newBookedDatesArray,
            })
            .eq("id", booking.nook_id);

         if (nookUpdateError) {
            throw nookUpdateError; // Throw the error to handle it below
         }

         // Set success message and reload the page
         setSuccess("Booking request accepted successfully");
         window.location.reload();
      } catch (error) {
         // Handle any errors that occurred during the process
         setSuccess(false);
         setError(error);
         console.error("Error:", error);
      }
   };

   const handleDecline = async () => {
      setSuccess(null);
      setError(null);
      // update booking row with status of declined
      const { error: declineBookingError } = await supabase
         .from("bookings")
         .update({
            status: "declined",
         })
         .eq("id", params.slug);
      if (declineBookingError) {
         setSuccess(false);
         setError(declineBookingError);
         console.error("Error updating booking:", bookingUpdateError);
         return;
      }
      setSuccess("Booking request declined succesfully");
      window.location.reload();
   };

   const handleCancel = async () => {
      setSuccess(null);
      setError(null);
      // update booking row with status of canceled
      const { error: cancelBookingError } = await supabase
         .from("bookings")
         .update({
            status: "canceled",
         })
         .eq("id", params.slug);
      if (cancelBookingError) {
         setSuccess(false);
         setError(cancelBookingError);
         console.error("Error updating booking:", bookingUpdateError);
         return;
      }
      setSuccess("Booking canceled succesfully");
      window.location.reload();
   };

   return (
      <Track>
         <Wrapper>
            {loading ? (
               <Loading />
            ) : (
               <>
                  <NookPreview>
                     <Image
                        loader={supabaseLoader}
                        alt=""
                        src={`/user-images/${booking?.nooks?.location_images[0]}`}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                     />
                     <TitleWrapper>
                        <Para size="textmd" $weight="semibold" color="black">
                           {booking?.nooks?.location_name}
                        </Para>
                        <LocationWrapper>
                           <Image
                              alt="location-pin"
                              src="/location-pin-grey.svg"
                              width={15}
                              height={15}
                              style={{ transform: "translateY(3px)" }}
                           />
                           <Para
                              size="textsm"
                              $weight="regular"
                              color="black"
                              style={{ textOverflow: "ellipsis" }}
                           >
                              {booking?.nooks?.location_address},{" "}
                              {booking?.nooks?.location_city},{" "}
                              {booking?.nooks?.location_state_code},{" "}
                              {booking?.nooks?.location_zip}
                           </Para>
                        </LocationWrapper>
                     </TitleWrapper>
                  </NookPreview>
                  <Divider style={{ width: "100%" }} />
                  <Calculation>
                     <LineItem>
                        <Para size="textmd" $weight="regular">
                           Start date
                        </Para>
                        <Para size="textmd" $weight="regular">
                           {booking?.start_date}
                        </Para>
                     </LineItem>
                     <LineItem>
                        <Para size="textmd" $weight="regular">
                           End date
                        </Para>
                        <Para size="textmd" $weight="regular">
                           {booking?.end_date}
                        </Para>
                     </LineItem>
                  </Calculation>
                  <Divider style={{ width: "100%" }} />
                  <Calculation>
                     <LineItem>
                        {booking?.nooks?.price_type === "dailyRate" ? (
                           <>
                              <Para size="textmd" $weight="regular">
                                 {formatCurrency(booking?.nooks?.price)} x{" "}
                                 {booking?.days_count} days
                              </Para>
                              <Para size="textmd" $weight="regular">
                                 {formatCurrency(booking?.booking_price)}
                              </Para>
                           </>
                        ) : (
                           <>
                              <Para size="textmd" $weight="regular">
                                 Days
                              </Para>
                              <Para size="textmd" $weight="regular">
                                 {booking?.days_count}
                              </Para>
                           </>
                        )}
                     </LineItem>
                     <LineItem>
                        <Para size="textmd" $weight="regular">
                           {userId === booking?.host_user_id
                              ? "Host fee"
                              : "Processing"}
                        </Para>
                        <Para size="textmd" $weight="regular">
                           {userId === booking?.host_user_id
                              ? `${formatCurrency(booking?.processing_fee)}`
                              : `${formatCurrency(booking?.processing_fee)}`}
                        </Para>
                     </LineItem>
                     <Divider style={{ width: "100%" }} />
                  </Calculation>
                  <Calculation>
                     <LineItem>
                        <Para size="textmd" $weight="medium">
                           {userId === booking?.host_user_id
                              ? "Your payout"
                              : "Total before taxes"}
                        </Para>
                        <Para size="textmd" $weight="medium">
                           {userId === booking?.host_user_id
                              ? booking?.nooks?.price === "dailyRate"
                                 ? `${formatCurrency(
                                      booking?.booking_price -
                                         booking?.processing_fee
                                   )}`
                                 : `${booking?.nooks?.price}% of sales`
                              : `${formatCurrency(
                                   booking?.booking_price_total_before_taxes
                                )}`}
                        </Para>
                     </LineItem>
                  </Calculation>
                  {booking?.nooks?.price_type === "salesPercent" && (
                     <Calculation>
                        <LineItem>
                           <Para size="textmd" $weight="medium">
                              Total cost before taxes
                           </Para>
                           <Para size="textmd" $weight="medium">
                              {formatCurrency(booking.booking_price)}
                           </Para>
                        </LineItem>
                     </Calculation>
                  )}
                  <>
                     {userId === booking?.host_user_id && (
                        <>
                           {booking?.status === "pending" && (
                              <>
                                 <Divider style={{ width: "100%" }} />
                                 <ActionButtons>
                                    <Button
                                       $brandcolor={true}
                                       onClick={handleAccept}
                                    >
                                       Accept Booking
                                    </Button>
                                    <Button
                                       $brandoutline={true}
                                       onClick={handleDecline}
                                    >
                                       Decline
                                    </Button>
                                 </ActionButtons>
                              </>
                           )}
                           {booking?.status === "accepted" && (
                              <>
                                 <Divider style={{ width: "100%" }} />
                                 <ActionButtons>
                                    <Button
                                       $brandoutline={true}
                                       onClick={handleCancel}
                                    >
                                       Cancel Booking
                                    </Button>
                                 </ActionButtons>
                              </>
                           )}
                        </>
                     )}
                     {userId === booking?.guest_user_id && (
                        <>
                           {booking.status === "pending" && (
                              <>
                                 <Divider style={{ width: "100%" }} />
                                 <ActionButtons>
                                    <Button
                                       $brandoutline={true}
                                       onClick={handleCancel}
                                    >
                                       Cancel Request
                                    </Button>
                                 </ActionButtons>
                              </>
                           )}
                        </>
                     )}
                  </>
               </>
            )}
         </Wrapper>
         {success && <Snackbar success text={success} />}
         {error && <Snackbar error text={error} />}
      </Track>
   );
}

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 25px;
   position: sticky;
   top: 140px;
   height: auto;
   box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.12);
   border: 1px solid ${({ theme }) => theme.color.primary.grey.g50};
   background-color: #fcfafa;
   padding: 30px;
   border-radius: 12px;
   width: 450px;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      width: 100%;
   }
`;

const Track = styled.div`
   height: 100%;
   position: relative;
`;

const Calculation = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 15px;
   align-items: start;
   width: 100%;
`;

const LineItem = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   width: 100%;
`;

const NookPreview = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
`;

const TitleWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 0px;
   width: 100%;
   justify-content: center;
`;

const LocationWrapper = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 5px;
   align-items: start;
   width: 100%;
`;

const ActionButtons = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
   width: 100%;
`;
