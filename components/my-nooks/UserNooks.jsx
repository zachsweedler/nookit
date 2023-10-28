"use client";
import React, { useEffect, useState } from "react";
import NookCard from "./NookCard";
import { styled } from "styled-components";
import PageHeader from "../page-header/PageHeader";
import Container from "@/styles/Containers";
import { useDispatch } from "react-redux";
import { restartForm, setFormValues } from "@/slices/nookFormSlice";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useProfileId } from "@/hooks/client-side/useProfileId";
import EmptyState from "../empty-state/EmptyState";
import { v4 as uuid } from "uuid";
import Loading from "../loading/Loading";

export default function UserNooks() {
   const dispatch = useDispatch();
   const [nooks, setNooks] = useState();
   const supabase = createClientComponentClient();
   const profileId = useProfileId(supabase);
   const [missingInfo, setMissingInfo] = useState();
   const [hasConnectAccount, setHasConnectAccount] = useState();
   const [connectAccountId, setConnectAccountId] = useState();
   const [profileData, setProfileData] = useState();
   const [loading, setLoading] = useState(true);
   const [missingLoading, setMissingLoading] = useState(true);

   useEffect(() => {
      if (profileId) {
         const fetchUserNooks = async () => {
            const { data, error } = await supabase
               .from("nooks")
               .select(`*, locations(*)`)
               .order("created_at", { ascending: false })
               .eq("profile_id", profileId);
            if (error) {
               console.error("error fetching nooks", error);
            } else {
               setNooks(data);
            }
         };
         const fetchConnectAccountId = async () => {
            const { data, error } = await supabase
               .from("stripe_connect")
               .select(`connect_account_id`)
               .eq("profile_id", profileId);
            if (error) {
               console.error("error fetching connect account Id", error);
               setHasConnectAccount(false);
            } else {
               setConnectAccountId(data[0]?.connect_account_id);
               data.length > 0
                  ? setHasConnectAccount(true)
                  : setHasConnectAccount(false);
               console.log("connect Id fetched", data);
            }
         };
         const getProfileData = async () => {
            const { data, error } = await supabase
               .from("profiles")
               .select("name, email, industry, website")
               .eq("id", profileId);
            if (error) {
               console.log("error getting profile data", error);
            } else {
               setProfileData(data[0]);
            }
         };
         const fetchData = async () => {
            setLoading(true);
            await fetchUserNooks();
            await fetchConnectAccountId();
            await getProfileData();
            setLoading(false);
         };
         fetchData();
      }
   }, [supabase, profileId]);

   useEffect(() => {
      if (connectAccountId) {
         const getMissingInfo = async () => {
            const response = await fetch(
               `${window.location.origin}/api/get-connect-account`,
               {
                  method: "GET",
                  headers: {
                     "Content-Type": "application/json",
                     "X-Connect-Account-Id": connectAccountId,
                  },
               }
            );
            const res = await response.json();
            if (!res.success) {
               console.log("error getting missing info", res.message);
            } else {
               setMissingInfo(res.missingData.length > 0);
            }
         };
         const fetchData = async () => {
            setMissingLoading(true);
            await getMissingInfo();
            setMissingLoading(false);
         };
         fetchData();
      } else {
         setMissingLoading(false);
      }
   }, [connectAccountId]);

   async function createStripeAccount() {
      const res = await fetch(
         `${window.location.origin}/api/create-express-account`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email: profileData?.email,
               website: profileData?.website,
            }),
         }
      );
      const newAccountData = await res.json();
      if (!newAccountData.success) {
         console.log("error creating connect account");
      } else {
         const { error } = await supabase
            .from("stripe_connect")
            .insert({
               id: uuid(),
               profile_id: profileId,
               connect_account_id: newAccountData.account.id,
            })
            .select("id");
         if (error) {
            console.log("error inserting account ID", error);
         } else {
            const res = await fetch(
               `${window.location.origin}/api/create-account-link`,
               {
                  method: "GET",
                  headers: {
                     "Content-Type": "application/json",
                     "X-Connect-Account-Id": newAccountData.account.id,
                  },
               }
            );
            const accountLinkData = await res.json();
            if (!accountLinkData.success) {
               console.log("error creating account link");
            } else {
               window.location.replace(accountLinkData.accountLink.url);
            }
         }
      }
   }

   async function expressLogin() {
      if (missingInfo) {
         const res = await fetch(
            `${window.location.origin}/api/create-account-link`,
            {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  "X-Connect-Account-Id": connectAccountId,
               },
            }
         );
         const data = await res.json();
         if (!data.success) {
            console.log("account link failed", data);
         } else {
            window.location.replace(data.accountLink.url);
         }
      } else {
         const res = await fetch(
            `${window.location.origin}/api/create-express-login-link`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({
                  connect_account_id: connectAccountId,
               }),
            }
         );
         const data = await res.json();
         if (!data.success) {
            console.log("login link failed", data);
         } else {
            window.location.replace(data.link);
         }
      }
   }

   return (
      <Container size="xl" style={{ marginTop: "120px" }}>
         <Wrapper>
            {!missingLoading && !loading ? (
               <>
                  {nooks?.length > 0 && !missingInfo && hasConnectAccount ? (
                     <>
                        <PageHeader
                           title="My Nooks"
                           button="Add Nook"
                           buttonLink="/my-nooks/upload"
                           onClick={() => {
                              dispatch(restartForm());
                              localStorage.removeItem("nookUUID");
                           }}
                        />
                        <Grid>
                           {nooks?.map((nook, index) => (
                              <NookCard
                                 key={index}
                                 id={nook.id}
                                 images={nook.locations.images}
                                 name={nook.locations.name}
                                 city={nook.locations.city}
                                 state={nook.locations.state_code}
                                 hostId={nook.host_id}
                                 hostProfile={profileData?.name || null}
                                 onClick={() => dispatch(setFormValues(nook))}
                              />
                           ))}
                        </Grid>
                     </>
                  ) : !hasConnectAccount ? (
                     <EmptyState
                        title="Setup Payouts"
                        description="To list a nook, set up payout details with a bank account or card to receive funds. Click the button below to begin:"
                        button="Add Payout Method"
                        onButtonClick={createStripeAccount}
                     />
                  ) : missingInfo ? (
                     <EmptyState
                        title="Finish Payout Setup"
                        description="To list your nook, provide all required payout info. Your account lacks necessary details. Click below to manage payouts:"
                        button="Finish Payout Setup"
                        onButtonClick={expressLogin}
                     />
                  ) : (
                     <EmptyState
                        title="No Nooks Added"
                        description="With your payout information setup, you're ready to list your first nook! Click the below button to get started."
                        imgSrc="/no-nooks-added.svg"
                        buttonHref="/my-nooks/upload"
                        button="List Your Nook"
                        onButtonClick={() => {
                           dispatch(restartForm());
                           localStorage.removeItem("nookUUID");
                        }}
                     />
                  )}
               </>
            ) : (
               <div
                  style={{
                     width: "100%",
                     height: "calc(100vh - 300px)",
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center",
                  }}
               >
                  <Loading />
               </div>
            )}
         </Wrapper>
      </Container>
   );
}

const Grid = styled.div`
   display: grid;
   width: 100%;
   grid-template-columns: 1fr 1fr 1fr;
   grid-template-rows: auto;
   grid-row-gap: 50px;
   grid-column-gap: 20px;
   height: auto;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
   }
`;

const Wrapper = styled.div`
   width: 100%;
   display: flex;
   flex-direction: column;
   row-gap: 30px;
`;
