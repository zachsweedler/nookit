"use client";
import { Para } from "@/styles/Typography";
import { Divider } from "@/styles/mui/Divider";
import { styled } from "styled-components";
import Image from "next/image";
import supabaseLoader from "@/supabase-image-loader";
import { useSelector } from "react-redux";
import { Button } from "@/styles/Buttons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { useState } from "react";
import Snackbar from "@/styles/mui/Snackbar";


export default function Summary({ userId }) {
   const data = useSelector((state) => state.bookingRequest.data);
   const supabase = createClientComponentClient();
   const params = useParams();
   const [success, setSuccess] = useState();
   const [error, setError] = useState();

   const handleAccept = async () => {
      // update the booking with a stab
      setSuccess(null)
      setError(null)
      const { error: bookingUpdateError } = await supabase
         .from("bookings")
         .update({
            status: "accepted",
         })
         .eq("id", params.slug);

      if (bookingUpdateError) {
         setSuccess(false)
         setError(bookingUpdateError)
         console.error("Error updating booking:", bookingUpdateError);
         return;
      }

      // get current booked dates of nook
      const { data: bookedData, error: bookedError } = await supabase
         .from("nooks")
         .select("booked_dates")
         .eq("id", data.nookId);
      const currBookedDatesArray = bookedData[0].booked_dates;

      if (bookedError) {
         setSuccess(false)
         setError(bookedError)
         console.error("Error fetching current booking data:", bookedError);
         return;
      }

      // format this booking's date range
      const bookingDates = {
         start_date: data.startDate,
         end_date: data.endDate,
      };

      // add it to the current booked dates array for nook
      const newBookedDatesArray = [...currBookedDatesArray, bookingDates];

      // update the nook with new booked dates array
      const { error: nookUpdateError } = await supabase
         .from("nooks")
         .update({
            booked_dates: newBookedDatesArray,
         })
         .eq("id", data.nookId);

      if (nookUpdateError) {
         setSuccess(false)
         setError(nookUpdateError)
         console.error("Error updating nook:", nookUpdateError);
         return;
      }
      console.log("Booking accepted and nook updated successfully!");
      setSuccess('Booking request accepted succesfully')
   };

   const handleDecline = async () => {
      setSuccess(null)
      setError(null)
      // update booking row with status of declined
      const { error: declineBookingError } = await supabase
         .from("bookings")
         .update({
            status: "declined",
         })
         .eq("id", params.slug);
      if (declineBookingError) {
         setSuccess(false)
         setError(declineBookingError)
         console.error("Error updating booking:", bookingUpdateError);
         return;
      }
      setSuccess("Booking request declined succesfully")
   };

   const handleCancel = async () => {
      setSuccess(null)
      setError(null)
      // update booking row with status of canceled 
      const { error: cancelBookingError } = await supabase
         .from("bookings")
         .update({
            status: "canceled",
         })
         .eq("id", params.slug);
      if (cancelBookingError) {
         setSuccess(false)
         setError(cancelBookingError)
         console.error("Error updating booking:", bookingUpdateError);
         return;
      }
      setSuccess("Booking canceled succesfully")
   };

   return (
      <Track>
         <Wrapper>
            <NookPreview>
               <Image
                  loader={supabaseLoader}
                  alt=""
                  src={`/user-images/${data?.locationImage}`}
                  width={60}
                  height={60}
                  style={{ objectFit: "cover", borderRadius: "5px" }}
               />
               <TitleWrapper>
                  <Para size="textmd" $weight="semibold" color="black">
                     {data?.locationName}
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
                        {data?.locationAddress}, {data?.locationCity},{" "}
                        {data?.locationState}, {data?.locationZip}
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
                     {data?.startDate}
                  </Para>
               </LineItem>
               <LineItem>
                  <Para size="textmd" $weight="regular">
                     End date
                  </Para>
                  <Para size="textmd" $weight="regular">
                     {data?.endDate}
                  </Para>
               </LineItem>
            </Calculation>
            <Divider style={{ width: "100%" }} />
            <Calculation>
               <LineItem>
                  <Para size="textmd" $weight="regular">
                     ${data?.dailyRate} x {data?.daysCount} days
                  </Para>
                  <Para size="textmd" $weight="regular">
                     ${data?.bookingPrice}
                  </Para>
               </LineItem>
               <LineItem>
                  <Para size="textmd" $weight="regular">
                     {userId === data.hostUserId ? "Host fee" : "Processing"}
                  </Para>
                  <Para size="textmd" $weight="regular">
                     {userId === data.hostUserId
                        ? `-$${data?.processingFee}`
                        : `$${data?.processingFee}`}
                  </Para>
               </LineItem>
               <Divider style={{ width: "100%" }} />
            </Calculation>
            <Calculation>
               <LineItem>
                  <Para size="textmd" $weight="medium">
                     {userId === data.hostUserId
                        ? "Your payout"
                        : "Total before taxes"}
                  </Para>
                  <Para size="textmd" $weight="medium">
                     {userId === data.hostUserId
                        ? `$${data?.hostPayout}`
                        : `$${data?.bookingPriceTotalBeforeTax}`}
                  </Para>
               </LineItem>
            </Calculation>
            <>
               {userId === data.hostUserId && (
                  <>
                     {data.status === "pending" && (
                        <>
                           <Divider style={{ width: "100%" }} />
                           <ActionButtons>
                              <Button $brandcolor={true} onClick={handleAccept}>
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
                     {data.status === "accepted" && (
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
               {userId === data.guestUserId && (
                  <>
                     {data.status === "pending" && (
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
