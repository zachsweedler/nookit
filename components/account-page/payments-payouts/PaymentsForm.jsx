"use client";
import Loading from "@/components/loading/Loading";
import { useUser } from "@/hooks/client-side/useUser";
import { Para } from "@/styles/Typography";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, CardInfo, MethodsWrapper } from "./Styles";
import { Button, ButtonDiv } from "@/styles/Buttons";

export default function PaymentsForm() {
   const supabase = createClientComponentClient();
   const user = useUser(supabase);
   const email = user?.email;
   const userId = user?.id;
   const [existingCustomer, setExistingCustomer] = useState();
   const [customerId, setCustomerId] = useState();
   const [paymentMethods, setPaymentMethods] = useState([]);
   const [customerCheckLoading, setCustomerCheckLoading] = useState(true);
   const [paymentMethodLoading, setPaymentMethodLoading] = useState(true);
   const [loading, setLoading] = useState(null);

   useEffect(() => {
      if (user) {
         setCustomerCheckLoading(true);
         const checkCustomerExists = async () => {
            const { data, error } = await supabase
               .from("stripe_customers")
               .select("customer_id")
               .eq("user_id", userId);
            if (error) {
               console.log("error getting customer Id", error);
            } else {
               if (data[0].customer_id) {
                  setExistingCustomer(true);
                  console.log("customer", data[0]);
                  setCustomerId(data[0].customer_id);
               } else {
                  setExistingCustomer(false);
               }
            }
         };
         checkCustomerExists();
         setCustomerCheckLoading(false);
      }
   }, [supabase, email, userId, user]);

   useEffect(() => {
      if (customerId) {
         setPaymentMethodLoading(true);
         const getPaymentMethods = async () => {
            const response = await fetch(
               `${window.location.origin}/api/list-customer-payment-methods`,
               {
                  method: "GET",
                  headers: {
                     "Content-Type": "application/json",
                     "X-Customer-Id": customerId,
                  },
               }
            );
            const res = await response.json();
            if (!res.success) {
               console.log("error getting payment methods", res.message);
            } else {
               setPaymentMethods(res.data);
            }
         };
         getPaymentMethods();
         setPaymentMethodLoading(false);
      }
   }, [customerId]);

   const createCustomerPortalSession = async () => {
      setLoading(true);

      // Create the request body with optional customer_id
      const requestBody = {
         email: email,
         user_id: userId,
      };

      if (existingCustomer && customerId) {
         // Add customer_id to the request body if it exists
         requestBody.customer_id = customerId;
      }

      console.log("existingCustomer:", existingCustomer);
      console.log("customerId:", customerId);

      const response = await fetch(
         `${window.location.origin}/api/create-customer-portal-session`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
         }
      );

      const data = await response.json();

      if (!data.success) {
         setLoading(false);
         console.log("error", data.message);
      } else {
         if (existingCustomer) {
            setLoading(false);
            setTimeout(() => {
               window.open(data.sessionUrl, "_blank");
            });
         } else {
            const { data: upsertData, error } = await supabase
               .from("stripe_customers")
               .upsert({
                  customer_id: data.customerId,
                  user_id: userId,
               })
               .eq('user_id', userId)
               .select();
            if (error) {
               setLoading(false);
               console.log("error upserting customer id", error);
            } else {
               console.log("success upserting customer id", upsertData);
               setLoading(false);
               setTimeout(() => {
                  window.open(data.sessionUrl, "_blank");
               });
            }
         }
      }
   };

   return (
      <>
         {customerCheckLoading && paymentMethodLoading ? (
            <Loading />
         ) : paymentMethods?.length > 0 ? (
            <MethodsWrapper>
               <Para size="textlg" $weight="medium">
                  Methods
               </Para>
               {paymentMethods?.map((method) => (
                  <Card key={method.id}>
                     <CardInfo>
                        <Image
                           alt=""
                           src={`/payment-cards/${method.card.brand.toLowerCase()}.svg`}
                           width={50}
                           height={30}
                        />

                        <Para size="textmd" $weight="medium">
                           {method.card.brand.charAt(0).toUpperCase() +
                              method.card.brand.slice(1)}
                        </Para>
                        <Para
                           size="textsm"
                           $weight="regular"
                           color="primary.grey.g600"
                        >
                           •••• •••• •••• {method.card.last4}
                        </Para>
                     </CardInfo>
                     <ButtonDiv
                        $brandoutline={true}
                        onClick={createCustomerPortalSession}
                        style={{ width: "auto" }}
                     >
                        Manage
                     </ButtonDiv>
                  </Card>
               ))}
            </MethodsWrapper>
         ) : (
            <Card>
               <CardInfo>
                  <Para size="textmd" weight="regular">
                     No payment methods added
                  </Para>
               </CardInfo>
               <ButtonDiv
                  $brandoutline={true}
                  onClick={createCustomerPortalSession}
                  style={{ width: "auto" }}
               >
                  {loading ? <Loading /> : "Add Card"}
               </ButtonDiv>
            </Card>
         )}
      </>
   );
}
