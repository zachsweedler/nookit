"use client";
import { styled } from "styled-components";
import { Para } from "@/styles/Typography";
import { Divider } from "@/styles/mui/Divider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import supabaseLoader from "@/supabase-image-loader";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserId } from "@/hooks/client-side/useUserId";
import Summary from "./Summary";
import Loading from "@/components/loading/Loading";

export default function Booking() {
   const supabase = createClientComponentClient();
   const userId = useUserId(supabase);
   const params = useParams();
   const [booking, setBooking] = useState();
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (userId) {
         const fetchBooking = async () => {
            const { data, error } = await supabase
               .from("bookings")
               .select(
                  `
                  status, 
                  start_date,
                  host_user_id, 
                  guest_user_id,
                  guest_plan, 
                  guest_questions,
                  bookings_guest_company_id_fkey(name, logo, email),
                  bookings_host_company_id_fkey(name, logo)
               `
               )
               .eq("id", params.slug);
            if (error) {
               setLoading(false);
               console.log("error fetching bookings", error);
            } else {
               setLoading(false);
               setBooking(data[0]);
               console.log("data!", data);
            }
         };
         fetchBooking();
      }
   }, [params.slug, supabase, userId]);

   const bookingStatus =
      booking?.status?.charAt(0).toUpperCase() + booking?.status?.slice(1);

   return (
      <>
         {loading ? (
            <CenterLoading>
               <Loading />
            </CenterLoading>
         ) : (
            <>
               <Grid>
                  <Wrapper>
                     <BookingInfoSection>
                        <Info>
                           {userId === booking?.guest_user_id ? (
                              <BookingBy>
                                 <Image
                                    alt=""
                                    loader={supabaseLoader}
                                    src={
                                       booking?.bookings_host_company_id_fkey
                                          ?.logo
                                          ? `user-images/${booking?.bookings_host_company_id_fkey?.logo}`
                                          : "/assets/fallback_images/fallback_company_logo.svg"
                                    }
                                    width={60}
                                    height={60}
                                    style={{
                                       objectFit: "cover",
                                       borderRadius: "100%",
                                    }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                 />
                                 <div
                                    style={{
                                       display: "flex",
                                       flexDirection: "column",
                                    }}
                                 >
                                    <Link
                                       href={`/profiles/${booking?.guest_user_id}`}
                                    >
                                       <Para
                                          $isLink={true}
                                          size="textlg"
                                          $weight="semibold"
                                          color="black"
                                       >
                                          {
                                             booking
                                                ?.bookings_guest_company_id_fkey
                                                ?.name
                                          }
                                       </Para>
                                    </Link>
                                    <Para size="textmd" $weight="regular">
                                       {userId === booking?.host_user_id
                                          ? "Guest"
                                          : " Host"}
                                    </Para>
                                 </div>
                              </BookingBy>
                           ) : (
                              <HostedBy>
                                 <Image
                                    alt=""
                                    loader={supabaseLoader}
                                    src={
                                       booking?.bookings_guest_company_id_fkey
                                          ?.logo
                                          ? `user-images/${booking?.bookings_guest_company_id_fkey?.logo}`
                                          : "/assets/fallback_images/fallback_company_logo.svg"
                                    }
                                    width={60}
                                    height={60}
                                    style={{
                                       objectFit: "cover",
                                       borderRadius: "100%",
                                    }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                 />
                                 <div
                                    style={{
                                       display: "flex",
                                       flexDirection: "column",
                                    }}
                                 >
                                    <Link
                                       href={`/profiles/${booking?.host_user_id}`}
                                    >
                                       <Para
                                          $isLink={true}
                                          size="textlg"
                                          $weight="semibold"
                                          color="black"
                                       >
                                          {
                                             booking
                                                ?.bookings_host_company_id_fkey
                                                ?.name
                                          }
                                       </Para>
                                    </Link>
                                    <Para size="textmd" $weight="regular">
                                       {userId === booking?.host_user_id
                                          ? "Guest"
                                          : " Host"}
                                    </Para>
                                 </div>
                              </HostedBy>
                           )}
                        </Info>
                     </BookingInfoSection>
                     <Divider />
                     <BookingInfoSection>
                        <Info>
                           <Para size="textlg" $weight="semibold">
                              Status
                           </Para>
                           <Para
                              size="textmd"
                              $weight="regular"
                              color="primary.grey.g800"
                           >
                              {userId === booking?.host_user_id
                                 ? bookingStatus === "Pending"
                                    ? "Waiting for you to accept or decline."
                                    : bookingStatus === "Accepted"
                                    ? "You accepted this booking."
                                    : bookingStatus === "Declined"
                                    ? "You declined this booking."
                                    : bookingStatus === "Completed"
                                    ? "This booking has been completed."
                                    : bookingStatus === "Canceled"
                                    ? "This booking has been canceled."
                                    : // Add more conditions for other bookingStatuses here
                                      "Unknown bookingStatus"
                                 : bookingStatus === "Pending"
                                 ? "Waiting for host to accept or decline."
                                 : bookingStatus === "Accepted"
                                 ? `Get ready for ${new Date(booking?.start_date).toLocaleDateString(
                                      "en-us",
                                      {
                                         weekday: "long",
                                         year: "numeric",
                                         month: "short",
                                         day: "numeric",
                                      }
                                   )}! The host accepted your booking.`
                                 : bookingStatus === "Declined"
                                 ? "The host declined this booking."
                                 : bookingStatus === "Complete"
                                 ? "This booking has been completed."
                                 : bookingStatus === "Canceled"
                                 ? "This booking has been canceled."
                                 : // Add more conditions for other bookingStatuses here
                                   "Unknown bookingStatus"}
                           </Para>
                        </Info>
                     </BookingInfoSection>
                     <Divider />
                     <BookingInfoSection>
                        <Info>
                           <Para size="textlg" $weight="semibold">
                              {userId === booking?.host_user_id
                                 ? "Guest's Plan"
                                 : "Your Plan"}
                           </Para>
                           <Para
                              size="textmd"
                              $weight="regular"
                              color="primary.grey.g800"
                           >
                              {booking?.guest_plan}
                           </Para>
                        </Info>
                     </BookingInfoSection>
                     <Divider />
                     {booking?.guest_questions !== null && (
                        <BookingInfoSection>
                           <Info>
                              <Para size="textlg" $weight="semibold">
                                 {userId === booking?.host_user_id
                                    ? "Their Questions"
                                    : "Your Questions"}
                              </Para>
                              <Para
                                 size="textmd"
                                 $weight="regular"
                                 color="primary.grey.g800"
                              >
                                 {booking?.guest_questions}
                              </Para>
                           </Info>
                        </BookingInfoSection>
                     )}
                     {userId === booking?.host_user_id &&
                        booking?.guest_questions !== null && (
                           <BookingInfoSection>
                              <a
                                 href={`mailto: ${booking?.bookings_guest_company_id_fkey?.email}`}
                              >
                                 <Para
                                    $isLink={true}
                                    size="textmd"
                                    $weight="medium"
                                    color="primary.brand.b600"
                                 >
                                    Reply via Email
                                 </Para>
                              </a>
                           </BookingInfoSection>
                        )}
                  </Wrapper>
                  <Summary userId={userId} />
               </Grid>
            </>
         )}
      </>
   );
}

const Grid = styled.div`
   display: grid;
   grid-template-columns: 1fr auto;
   grid-template-rows: 1fr;
   grid-column-gap: 100px;
   height: auto;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
      grid-row-gap: 50px;
   }
`;

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 40px;
   height: auto;
`;

const BookingInfoSection = styled.div`
   display: flex;
   flex-direction: column;
`;

const Info = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 6px;
`;

const BookingBy = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
   align-items: center;
   width: 100%;
`;

const HostedBy = styled(BookingBy)``;

const CenterLoading = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   width: 100%;
`;
