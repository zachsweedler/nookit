"use client";
import { useCompanyId } from "@/hooks/client-side/useCompanyId";
import { Button } from "@/styles/Buttons";
import { Para } from "@/styles/Typography";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import Loading from "@/components/loading/Loading";
import { Card, CardInfo, MethodsWrapper } from "./Styles";

export default function PayoutsForm() {
   const [hasAccount, setHasAccount] = useState();
   const [companyData, setCompanyData] = useState();
   const [connectAccountId, setConnectAccountId] = useState();
   const [banks, setBanks] = useState([]);
   const [cards, setCards] = useState([]);
   const [missingInfo, setMissingInfo] = useState(false);
   const [loading, setLoading] = useState(true);
   const [dataLoading, setDataLoading] = useState(true);
   const supabase = createClientComponentClient();
   const companyId = useCompanyId(supabase);

   useEffect(() => {
      setLoading(true);
      const fetchData = async () => {
         try {
            if (companyId) {
               const { data, error } = await supabase
                  .from("stripe_connect")
                  .select("id, connect_account_id")
                  .eq("company_id", companyId);
               if (error) {
                  console.error("Error getting connect account Id", error);
               } else {
                  if (data && data.length > 0) {
                     console.log(
                        "Connect account ID:",
                        data[0].connect_account_id
                     );
                     setHasAccount(true);
                     setConnectAccountId(data[0].connect_account_id);
                     setLoading(false);
                  } else {
                     setHasAccount(false);
                     setLoading(false);
                  }
               }
               const { data: companyData, error: companyDataError} = await supabase
                  .from('company_profiles')
                  .select('email, website')
                  .eq('id', companyId)
               if (companyDataError) {
                  console.log('error getting company data', companyDataError)
               } else {
                  setCompanyData(companyData[0])
               }
            }
         } catch (error) {
            console.error("Error fetching data", error);
         }
      };
      fetchData();
   }, [companyId, supabase]);

   useEffect(() => {
      if (connectAccountId) {
         // Fetch bank accounts
         const fetchBankAccounts = async () => {
            try {
               const response = await fetch(
                  `${window.location.origin}/api/list-connect-account-banks`,
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
                  console.error("Error fetching bank accounts", res.message);
               } else {
                  setBanks(res.data);
               }
            } catch (error) {
               console.error("Error fetching bank accounts", error);
            }
         };

         // Fetch cards
         const fetchCards = async () => {
            try {
               const response = await fetch(
                  `${window.location.origin}/api/list-connect-account-cards`,
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
                  console.error("Error fetching cards", res.message);
               } else {
                  setCards(res.data);
               }
            } catch (error) {
               console.error("Error fetching cards", error);
            }
         };

         // Fetch missing info
         const fetchMissingInfo = async () => {
            try {
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
               res?.missingData.length > 0
                  ? setMissingInfo(true)
                  : setMissingInfo(false);
            } catch (error) {
               console.error("Error fetching missing info", error);
            }
         };

         // Fetch bank accounts, cards, and missing info one by one
         const fetchData = async () => {
            setDataLoading(true);
            await fetchBankAccounts();
            await fetchCards();
            await fetchMissingInfo();
            setDataLoading(false);
         };

         fetchData();
      } else {
         setDataLoading(false);
      }
   }, [connectAccountId, companyData]);

   async function createStripeAccount() {
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
      <>
         {!loading && !dataLoading ? (
            <>
               {hasAccount ? (
                  missingInfo ? (
                     <Card>
                        <CardInfo>
                           <Para size="textmd" weight="regular">
                              Missing info. Please finish payout onboarding.
                           </Para>
                        </CardInfo>
                        <Button
                           $brandoutline={true}
                           style={{ width: "auto" }}
                           onClick={expressLogin}
                        >
                           Finish
                        </Button>
                     </Card>
                  ) : (
                     <>
                        {banks.length > 0 && (
                           <MethodsWrapper>
                              <Para size="textlg" $weight="medium">
                                 Banks
                              </Para>
                              {banks?.map((account) => (
                                 <Card key={account.id}>
                                    <CardInfo>
                                       <Para size="textmd" $weight="medium">
                                          {account.bank_name}
                                       </Para>
                                       <Para size="textmd" $weight="medium">
                                          {account.last4}
                                       </Para>
                                    </CardInfo>
                                    <Button
                                       $brandoutline={true}
                                       style={{ width: "auto" }}
                                       onClick={expressLogin}
                                    >
                                       Manage
                                    </Button>
                                 </Card>
                              ))}
                           </MethodsWrapper>
                        )}
                        {cards.length > 0 && (
                           <MethodsWrapper>
                              <Para size="textlg" $weight="medium">
                                 Debit Cards
                              </Para>
                              {cards?.map((card) => (
                                 <Card key={card.id}>
                                    <CardInfo>
                                       <Image
                                          alt=""
                                          src={`/payment-cards/${card.brand.toLowerCase()}.svg`}
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
                                    </CardInfo>
                                    <Button
                                       $brandoutline={true}
                                       style={{ width: "auto" }}
                                       onClick={expressLogin}
                                    >
                                       Manage
                                    </Button>
                                 </Card>
                              ))}
                           </MethodsWrapper>
                        )}
                     </>
                  )
               ) : (
                  <Card>
                     <CardInfo>
                        <Para size="textmd" weight="regular">
                           No payout method added
                        </Para>
                     </CardInfo>
                     <Button
                        $brandoutline={true}
                        style={{ width: "auto" }}
                        onClick={createStripeAccount}
                     >
                        Add Payout
                     </Button>
                  </Card>
               )}
            </>
         ) : (
            <Loading />
         )}
      </>
   );
}
