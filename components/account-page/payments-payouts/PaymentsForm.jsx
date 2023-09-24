"use client";
import Loading from "@/components/loading/Loading";
import { useUser } from "@/hooks/client-side/useUser";
import { Para } from "@/styles/Typography";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, CardInfo, MethodsWrapper } from "./Styles";
import { Button } from "@/styles/Buttons";

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
               if (data && data.length > 0) {
                  setExistingCustomer(true);
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
      const requestBody = existingCustomer
         ? { customer_id: customerId, email: email, user_id: userId }
         : { email: email, user_id: userId };
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
         console.log("error", data.message);
      } else {
         if (existingCustomer) {
            window.open(data.sessionUrl, '_blank');
         } else {
            const { error } = await supabase
               .from("stripe_customers")
               .insert({
                  customer_id: data.customerId,
                  user_id: userId,
               })
               .select();
            if (error) {
               console.log("error upserting customer id", error);
            } else {
               window.open(data.sessionUrl, '_blank');
            }
         }
      }
   };

   return (
      <>
         {customerCheckLoading && paymentMethodLoading ? (
            <Loading />
         ) : (
            paymentMethods?.length > 0 ? (
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
                        <Button $brandoutline={true} onClick={createCustomerPortalSession} style={{width: "auto"}}>Manage</Button>
                     </Card>
                  ))}
               </MethodsWrapper>
            ) : (
               <Card>
                  <CardInfo>
                     <Para size="textmd" weight="regular">No payment methods added</Para>
                  </CardInfo>
                  <Button $brandoutline={true} onClick={createCustomerPortalSession} style={{width: "auto"}}>Add Card</Button>
               </Card>
            )
         )}
      </>
   );
}

