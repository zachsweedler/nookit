"use client";
import React, { useEffect, useState } from "react";
import NookCard from "./NookCard";
import { styled } from "styled-components";
import PageHeader from "../page-header/PageHeader";
import Container from "@/styles/Containers";
import { Para } from "@/styles/Typography";
import { useDispatch } from "react-redux";
import { restartForm, setFormValues } from "@/slices/nookFormSlice";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useCompanyId } from "@/hooks/client-side/useCompanyId";
import { Button } from "@/styles/Buttons";
import Link from "next/link";
import EmptyState from "../empty-state/EmptyState";
import { v4 as uuid } from "uuid";

export default function UserNooks() {
   const dispatch = useDispatch();
   const [nooks, setNooks] = useState();
   const supabase = createClientComponentClient();
   const companyId = useCompanyId(supabase);
   const [missingInfo, setMissingInfo] = useState();
   const [hasConnectAccount, setHasConnectAccount] = useState();
   const [connectAccountId, setConnectAccountId] = useState();
   const [companyData, setCompanyData] = useState();

   useEffect(() => {
      if (companyId) {
         const fetchUserNooks = async () => {
            const { data, error } = await supabase
               .from("nooks")
               .select(`*`)
               .order("created_at", { ascending: false })
               .eq("company_id", companyId);
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
               .eq("company_id", companyId);
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
         const getCompanyData = async () => {
            const { data, error } = await supabase
               .from("company_profiles")
               .select("name, email, industry, website")
               .eq("id", companyId);
            if (error) {
               console.log("error getting company data", error);
            } else {
               setCompanyData(data[0]);
            }
         };
         fetchUserNooks();
         fetchConnectAccountId();
         getCompanyData();
      }
   }, [supabase, companyId]);

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
               res.missingData.length > 0
                  ? setMissingInfo(true)
                  : setMissingInfo(false);
            }
         };
         getMissingInfo();
      }
   }, [connectAccountId]);

   async function createStripeAccount() {
      console.log("company data", companyData);
      const res = await fetch(
         `${window.location.origin}/api/create-express-account`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email: companyData?.email,
               website: companyData?.website,
            }),
         }
      );
      const newAccountData = await res.json();
      if (!newAccountData.success) {
         console.log("error creating connect account");
      } else {
         console.log("account data", newAccountData);
         const { error } = await supabase
            .from("stripe_connect")
            .insert({
               id: uuid(),
               company_id: companyId,
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
            <PageHeader
               title={nooks && nooks.length > 0 ? "My Nooks" : null}
               button={
                  nooks?.length === 0 || missingInfo || !hasConnectAccount
                     ? false
                     : "Add Nook"
               }
               buttonLink="/my-nooks/upload"
               onClick={() => dispatch(restartForm())}
            />
            {!hasConnectAccount ? (
               <EmptyState
                  title="No Payout Method Added"
                  description="To list a nook, you must first configure your payout details, ensuring you have either a bank account or card set up to receive funds. Please click the button below to get started."
                  imgSrc="/add-payout-method.png"
                  button="Add Payout Method +"
                  onButtonClick={createStripeAccount}
               />
            ) : missingInfo ? (
               <>
                  <EmptyState
                     title="Finish Payout Setup"
                     description="To successfully list a nook, all required information for payouts must be provided. At the moment, your account is missing some information required for this process. To proceed and manage your payout information, please click the button below:"
                     imgSrc="/add-payout-method.png"
                     button="Add Missing Information"
                     onButtonClick={expressLogin}
                  />
               </>
            ) : nooks && nooks.length > 0 ? (
               <Grid>
                  {nooks?.map((nook, index) => (
                     <NookCard
                        key={index}
                        id={nook.id}
                        images={nook.location_images}
                        name={nook.location_name}
                        city={nook.location_city}
                        state={nook.location_state_code}
                        hostId={nook.host_id}
                        hostCompany={companyData?.name || null}
                        onClick={() => dispatch(setFormValues(nook))}
                     />
                  ))}
               </Grid>
            ) : (
               <EmptyState
                  title="No Nooks Added"
                  description="With your payout information setup, you're ready to list your first nook! Click the below button to get started."
                  button="List Your Nook +"
                  buttonHref="/my-nooks/upload"
               />
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
