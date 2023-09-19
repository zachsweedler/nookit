"use client";
import { useCompanyId } from "@/hooks/client-side/useCompanyId";
import { Button } from "@/styles/Buttons";
import { Para } from "@/styles/Typography";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";

export default function PayoutsForm() {
   const [hasAccount, setHasAccount] = useState();
   const [companyData, setCompanyData] = useState();
   const [connectAccountId, setConnectAccountId] = useState();
   const [banks, setBanks] = useState([]);
   const [cards, setCards] = useState([]);
   const [missingInfo, setMissingInfo] = useState(false);
   const supabase = createClientComponentClient();
   const companyId = useCompanyId(supabase);

   useEffect(() => {
      if (companyId) {
         const getConnectAccountId = async () => {
            const { data, error } = await supabase
               .from("stripe_connect")
               .select("connect_account_id")
               .eq("company_id", companyId);
            if (error) {
               console.log("error getting connect account Id", error);
            } else {
               if (data && data.length > 0) {
                  setHasAccount(true);
                  setConnectAccountId(data[0].connect_account_id);
               } else {
                  setHasAccount(false);
               }
            }
         };
         const getCompanyData = async () => {
            const { data, error } = await supabase
               .from("company_profiles")
               .select("email, industry, website")
               .eq("id", companyId);
            if (error) {
               console.log("error getting company data", error);
            } else {
               setCompanyData(data[0]);
            }
         };
         getConnectAccountId();
         getCompanyData();
      }
   }, [supabase, companyId]);

   async function createStripeAccount() {
      console.log("company data", companyData);
      const res = await fetch(
         "http://localhost:3000/api/create-express-account",
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
               "http://localhost:3000/api/create-account-link",
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
            "http://localhost:3000/api/create-account-link",
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
            "http://localhost:3000/api/create-express-login-link",
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

   useEffect(() => {
      if (connectAccountId) {
         const getBankAccounts = async () => {
            const response = await fetch(
               "http://localhost:3000/api/list-connect-account-banks",
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
               console.log("error getting banks", res.message);
            } else {
               setBanks(res.data);
            }
         };

         const getCards = async () => {
            const response = await fetch(
               "http://localhost:3000/api/list-connect-account-cards",
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
               console.log("error getting cards", res.message);
            } else {
               setCards(res.data);
            }
         };

         const getMissingInfo = async () => {
            const response = await fetch(
               "http://localhost:3000/api/get-connect-account",
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

         getBankAccounts();
         getCards();
         getMissingInfo();
      }
   }, [connectAccountId]);

   return (
      <>
         {hasAccount &&
            (missingInfo ? null : (
               <MethodsWrapper>
                  {banks.length > 0 && (
                     <>
                        <Para size="textlg" $weight="medium">
                           Banks
                        </Para>
                        {banks?.map((account) => (
                           <Card key={account.id}>
                              <Para size="textmd" $weight="medium">
                                 {account.bank_name}
                              </Para>
                              <Para size="textmd" $weight="medium">
                                 {account.last4}
                              </Para>
                           </Card>
                        ))}
                     </>
                  )}
                  {cards.length > 0 && (
                     <>
                        <Para size="textlg" $weight="medium">
                           Debit Cards
                        </Para>
                        {cards?.map((card) => (
                           <Card key={card.id}>
                              <Image
                                 alt=""
                                 src={`/payment-cards/${card.brand}.svg`}
                                 width={50}
                                 height={30}
                              />
                              <Para size="textmd" $weight="medium">
                                 {card.brand}
                              </Para>
                              <Para
                                 size="textsm"
                                 $weight="regular"
                                 color="primary.grey.g600"
                              >
                                 •••• •••• •••• {card.last4}
                              </Para>
                           </Card>
                        ))}
                     </>
                  )}
               </MethodsWrapper>
            ))}
         <Para
            size="textmd"
            $weight="medium"
            $isLink={true}
            color="primary.brand.b600"
            onClick={hasAccount ? expressLogin : createStripeAccount}
         >
            {hasAccount ? "Manage Payout Methods" : "Add Payout Method +"}
         </Para>
      </>
   );
}

const MethodsWrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 18px;
`;

const Card = styled.div`
   padding: 15px 18px;
   display: flex;
   flex-direction: row;
   align-items: center;
   column-gap: 15px;
   border-radius: 5px;
   border: 1px solid ${({ theme }) => theme.color.primary.grey.g50};
`;
