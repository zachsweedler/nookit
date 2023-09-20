"use client";
import { useUser } from "@/hooks/client-side/useUser";
import { Para } from "@/styles/Typography";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function PaymentsForm() {
   const supabase = createClientComponentClient();
   const user = useUser(supabase);
   const email = user?.email;
   const userId = user?.id;
   const [existingCustomer, setExistingCustomer] = useState();
   const [customerId, setCustomerId] = useState();
   const [paymentMethods, setPaymentMethods] = useState([]);

   useEffect(() => {
      if (user) {
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
      }
   }, [supabase, email, userId, user]);

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
            window.location.replace(data.sessionUrl);
         } else {
            const { data: insertCustomerId, error } = await supabase
               .from("stripe_customers")
               .insert({
                  customer_id: data.customerId,
                  user_id: userId,
               })
               .select();
            if (error) {
               console.log("error upserting customer id", error);
            } else {
               window.location.replace(data.sessionUrl);
            }
         }
      }
   };

   useEffect(() => {
      if (customerId) {
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
      }
   }, [customerId]);

   return (
      <>
         {paymentMethods?.length > 0 && (
            <MethodsWrapper>
               <Para size="textlg" $weight="medium">
                  Methods
               </Para>
               {paymentMethods?.map((method) => (
                  <Card key={method.id}>
                     <Image
                        alt=""
                        src={`/payment-cards/${method.card.brand}.svg`}
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
                  </Card>
               ))}
            </MethodsWrapper>
         )}
         <Para
            size="textmd"
            $weight="medium"
            $isLink={true}
            color="primary.brand.b600"
            onClick={createCustomerPortalSession}
         >
            {existingCustomer
               ? "Manage Payment Methods"
               : "Add Payment Method +"}
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
