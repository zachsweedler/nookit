/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/styles/Buttons";
import { Para } from "@/styles/Typography";
import { Divider } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useDispatch } from "react-redux";
import { restartSteps } from "@/slices/waitlistFormSlice";
import { restartForm } from "@/slices/uploadNookSlice";
import MyNooks from "../my-nooks/MyNooks";
import ReviewBanner from "./ReviewBanner";
import Container from "@/styles/Containers";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserId } from "@/hooks/useUserId";
import supabaseLoader from "@/supabase-image-loader";

const JoinWaitlist = () => {
   const dispatch = useDispatch();
   return (
      <>
         <div
            style={{
               display: "flex",
               flexDirection: "column",
               rowGap: "20px",
               height: "100%",
            }}
         >
            <Para size="textmd" weight="medium" color="primary.brand.b600">
               Join Waitlist
            </Para>
            <Para size="textxl" weight="medium" color="black">
               Please fill out a brief form to secure your spot on the list.
            </Para>
         </div>
         <Divider />
         <Link
            href="/waitlist/form"
            style={{ textDecoration: "none" }}
            onClick={() => dispatch(restartSteps())}
         >
            <Button $brandcolor='true'>Get Started</Button>
         </Link>
      </>
   );
};

const UploadNook = () => {
   const dispatch = useDispatch();
   return (
      <>
         <div
            style={{
               display: "flex",
               flexDirection: "column",
               rowGap: "20px",
            }}
         >
            <Para size="textmd" weight="medium" color="primary.brand.b600">
               Are you a store owner?
            </Para>
            <Para size="textxl" weight="medium" color="black">
               Upload Your Nook!
            </Para>
            <Para size="textsm" weight="regular" color="black">
               As a host, earn a set percentage from sales made during a company&apos;s
               booking.
            </Para>
         </div>
         <Divider />
         <Link
            href="/waitlist/upload-nook"
            style={{ textDecoration: "none" }}
            onClick={() => dispatch(restartForm())}
         >
            <Button $brandcolor='true'>Add My Nook</Button>
         </Link>
      </>
   );
};

function DashClient({session}) {
   const [submitted, setSubmitted] = useState();
   const [nooks, setNooks] = useState([]);
   const [hostCompany, setHostCompany] = useState();
   const [loading, setLoading] = useState(true);
   const supabase = createClientComponentClient();
   const userId = useUserId();

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         if (session.user.id) {
            const { data: formStatus, error: formStatusError } = await supabase
               .from("waitlist")
               .select("submitted_form")
               .eq("user_id", session.user.id);
            if (formStatusError) {
               console.log("error getting status", formStatus);
            } else {
               const submitted =
                  formStatus && formStatus.length > 0
                     ? formStatus[0]?.submitted_form
                     : null;
               setSubmitted(submitted);
            }

            const { data: nookData, error: nookError } = await supabase
               .from("nooks")
               .select("*")
               .eq("host_id", session.user.id);
            if (nookError) {
               console.log("error getting nooks", nookError);
            } else {
               setNooks(nookData);
            }

            const { data: company, error: companyError } = await supabase
               .from("company_profiles")
               .select("name")
               .eq("user_id", session.user.id);
            if (companyError) {
               console.log("error getting host company", companyError);
            } else {
               const hostCompany =
                  company && company.length > 0 ? company[0]?.name : null;
               setHostCompany(hostCompany);
            }
         }
         setLoading(false);
      };
      fetchData();
   }, [supabase, session.user.id]);

   return (
      <>
         {loading ? (
            <Container
               size="md"
               style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100dvh - 90px)",
               }}
            >
               <Para size="textsm" weight="regular">
                  Loading...
               </Para>
            </Container>
         ) : (
            <>
            <Wrapper>
            <Container
               size={!submitted ? "md" : "md"}
               style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "30px",
                  justifyContent: !submitted ? "center" : "start",
                  height: "auto",
               }}
            >
               {submitted && <ReviewBanner submitted={submitted} />}
               {!loading && nooks.length > 0 ? null : (
                  <GridWrapper>
                     <CopyCell>
                        {!submitted ? <JoinWaitlist /> : <UploadNook />}
                     </CopyCell>
                     <ImageCell>
                        <Image
                           loader={supabaseLoader}
                           alt="nook-image"
                           src="assets/marketing/waitlist/waitlist-image.png"
                           fill={true}
                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                           style={{ objectFit: "cover" }}
                           priority={true}
                        />
                     </ImageCell>
                  </GridWrapper>
               )}
               {nooks.length > 0 && (
                  <MyNooks nooks={nooks} hostCompany={hostCompany} />
               )}
            </Container>
            </Wrapper>
            </>
         )}
      </>
   );
}

export default DashClient;

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   padding: 150px 0px;
`
const GridWrapper = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
   grid-template-rows: 1fr;
   grid-row-gap: 50px;
   width: 100%;
   border-radius: 5px;
   overflow: hidden;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
   }
`;

const CopyCell = styled.div`
   padding: 60px;
   display: flex;
   flex-direction: column;
   justify-content: start;
   row-gap: 30px;
   width: 100%;
   height: 100%;
   background-color: ${({ theme }) => theme.color.primary.brand.b50};
`;

const ImageCell = styled.div`
   position: relative;
   width: 100%;
   height: 100%;
   overflow: hidden;
`;
