"use client";
import Container from "@/styles/Containers";
import Summary from "./Summary";
import { styled } from "styled-components";
import { Para } from "@/styles/Typography";
import { Divider } from "@/styles/mui/Divider";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import supabaseLoader from "@/supabase-image-loader";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserId } from "@/hooks/client-side/useUserId";

export default function Booking() {
   const data = useSelector((state) => state.bookingRequest.data);
   const supabase = createClientComponentClient();
   const userId = useUserId(supabase);
   const router = useRouter();
   const [guestData, setGuestData] = useState();

   useEffect(() => {
      const handleData = async () => {
         const resolvedData = await data;
         if (!resolvedData) {
            console.log("pushed because no data yet");
            router.push("/bookings");
            return;
         }
         const fetchGuestData = async () => {
            const { data: guestData, error } = await supabase
               .from("company_profiles")
               .select("name, logo, email")
               .eq("user_id", resolvedData?.guestUserId);
            if (error) {
               console.log("error fetching guest data", error);
            } else {
               setGuestData(guestData[0]);
            }
         };
         fetchGuestData();
      };
      handleData();
   }, [data, router, supabase]);

   const status = data.status.charAt(0).toUpperCase() + data.status.slice(1);

   return (
      <Container
         size="xl"
         style={{ marginTop: "140px", marginBottom: "140px" }}
      >
         <Grid>
            <RequestInfo>
               <RequestInfoSection>
                  <Info>
                     {userId === data.hostUserId ? (
                        <RequestBy>
                           {guestData && (
                              <>
                                 <Image
                                    alt=""
                                    loader={supabaseLoader}
                                    src={`/user-images/${guestData?.logo}`}
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
                                       href={`/profiles/${data?.guestUserId}`}
                                    >
                                       <Para
                                          $isLink={true}
                                          size="textlg"
                                          $weight="semibold"
                                          color="black"
                                       >
                                          {guestData?.name}
                                       </Para>
                                    </Link>
                                    <Para size="textmd" $weight="regular">
                                       {userId === data.hostUserId
                                          ? "Guest"
                                          : " Host"}
                                    </Para>
                                 </div>
                              </>
                           )}
                        </RequestBy>
                     ) : (
                        <HostedBy>
                           <Image
                              alt=""
                              loader={supabaseLoader}
                              src={`/user-images/${data.hostLogo}`}
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
                              <Link href={`/profiles/${data?.hostUserId}`}>
                                 <Para
                                    $isLink={true}
                                    size="textlg"
                                    $weight="semibold"
                                    color="black"
                                 >
                                    {data.hostName}
                                 </Para>
                              </Link>
                              <Para size="textmd" $weight="regular">
                                 {userId === data.hostUserId
                                    ? "Guest"
                                    : " Host"}
                              </Para>
                           </div>
                        </HostedBy>
                     )}
                  </Info>
               </RequestInfoSection>
               <Divider />
               <RequestInfoSection>
                  <Info>
                     <Para size="textlg" $weight="semibold">
                        Status
                     </Para>
                     <Para
                        size="textmd"
                        $weight="regular"
                        color="primary.grey.g800"
                     >
                        {userId === data.hostUserId
                           ? status === "Pending"
                              ? "Waiting for you to accept or decline."
                              : status === "Accepted"
                              ? "You accepted this booking request."
                              : status === "Declined"
                              ? "You declined this booking request."
                              : status === "Completed"
                              ? "This booking has been completed."
                              : status === "Canceled"
                              ? "This booking has been canceled."
                              : // Add more conditions for other statuses here
                                "Unknown Status"
                           : status === "Pending"
                           ? "Waiting for host to accept or decline."
                           : status === "Accepted"
                           ? "Get ready! The host accepted your booking request."
                           : status === "Declined"
                           ? "The host declined this booking request."
                           : status === "Complete"
                           ? "This booking has been completed."
                           : status === "Canceled"
                           ? "This booking has been canceled."
                           : // Add more conditions for other statuses here
                             "Unknown Status"}
                     </Para>
                  </Info>
               </RequestInfoSection>
               <Divider />
               <RequestInfoSection>
                  <Info>
                     <Para size="textlg" $weight="semibold">
                        {userId === data.hostUserId
                           ? "Guest's Plan"
                           : "Your Plan"}
                     </Para>
                     <Para
                        size="textmd"
                        $weight="regular"
                        color="primary.grey.g800"
                     >
                        {data?.guestPlan}
                     </Para>
                  </Info>
               </RequestInfoSection>
               <Divider />
               {data.guestQuestions !== null && (
                  <RequestInfoSection>
                     <Info>
                        <Para size="textlg" $weight="semibold">
                           {userId === data.hostUserId
                              ? "Their Questions"
                              : "Your Questions"}
                        </Para>
                        <Para
                           size="textmd"
                           $weight="regular"
                           color="primary.grey.g800"
                        >
                           {data?.guestQuestions}
                        </Para>
                     </Info>
                  </RequestInfoSection>
               )}
               {(userId === data.hostUserId && data.guestQuestions !== null) && (
                  <RequestInfoSection>
                     <a href={`mailto: ${guestData?.email}`}>
                        <Para
                           $isLink={true}
                           size="textmd"
                           $weight="medium"
                           color="primary.brand.b600"
                        >
                           Reply via Email
                        </Para>
                     </a>
                  </RequestInfoSection>
               )}
            </RequestInfo>
            <Summary userId={userId} />
         </Grid>
      </Container>
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

const RequestInfo = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 40px;
   height: auto;
`;

const RequestInfoSection = styled.div`
   display: flex;
   flex-direction: column;
`;

const Info = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 6px;
`;

const RequestBy = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 12px;
   align-items: center;
   width: 100%;
`;

const HostedBy = styled(RequestBy)``;
