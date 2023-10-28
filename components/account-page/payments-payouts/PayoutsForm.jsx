"use client";
import { useProfileId } from "@/hooks/client-side/useProfileId";
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
   const [profileData, setProfileData] = useState();
   const [connectAccountId, setConnectAccountId] = useState();
   const [banks, setBanks] = useState([]);
   const [cards, setCards] = useState([]);
   const [missingInfo, setMissingInfo] = useState(false);
   const [loading, setLoading] = useState(true);
   const [dataLoading, setDataLoading] = useState(true);
   const supabase = createClientComponentClient();
   const profileId = useProfileId(supabase);

   useEffect(() => {
      setLoading(true);
      const fetchData = async () => {
         try {
            if (profileId) {
               const { data, error } = await supabase
                  .from("stripe_connect")
                  .select("id, connect_account_id")
                  .eq("profile_id", profileId);
               if (error) {
                  console.error("Error getting connect account Id", error);
               } else {
                  if (data[0]?.connect_account_id) {
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
               const { data: profileData, error: profileDataError} = await supabase
                  .from('profiles')
                  .select('email, website')
                  .eq('id', profileId)
               if (profileDataError) {
                  console.log('error getting profile data', profileDataError)
               } else {
                  setProfileData(profileData[0])
               }

            }
         } catch (error) {
            console.error("Error fetching data", error);
         }
      };
      fetchData();
   }, [profileId, supabase]);

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
   }, [connectAccountId, profileData]);

   async function createStripeAccount() {
      setLoading(true)
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
         setLoading(false)
      } else {
         console.log("account data", newAccountData);
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
               setLoading(false)
               console.log("error creating account link");
            } else {
               setLoading(false)
               setTimeout(() => {
                  window.open(accountLinkData.accountLink.url, '_blank');
               })
            }
         }
      }
   }

   async function expressLogin() {
      setLoading(true)
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
            setLoading(false)
            console.log("account link failed", data);
         } else {
            setLoading(false)
            setTimeout(() => {
               window.open(data.accountLink.url, '_blank');
            })
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
            setLoading(false)
            console.log("login link failed", data);
         } else {
            setLoading(false)
            setTimeout(() => {
               window.open(data.link, '_blank');
            })
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
                                       {loading ? <Loading/> : "Manage"}
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
                        {loading ? <Loading/> : "Add Payout"}
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
