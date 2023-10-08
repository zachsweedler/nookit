"use client";
import Loading from "@/components/loading/Loading";
import { useUser } from "@/hooks/client-side/useUser";
import { Para } from "@/styles/Typography";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CardInfo, MethodsWrapper } from "./Styles";
import { ButtonDiv } from "@/styles/Buttons";
import { Card } from "./StylesV2";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import "./Stripe.css";
import StripePaymentElement from "./StripePaymentElement";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "styled-components";
const stripePromise = loadStripe(
   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE
);

export default function PaymentsFormV2() {
   const supabase = createClientComponentClient();
   const user = useUser(supabase);
   const email = user?.email;
   const userId = user?.id;
   const [paymentMethods, setPaymentMethods] = useState([]);
   const [customerCheckLoading, setCustomerCheckLoading] = useState(true);
   const [paymentMethodLoading, setPaymentMethodLoading] = useState(false);
   const [clientSecret, setClientSecret] = useState("");

   useEffect(() => {
      if (user) {
         const checkCustomerExists = async () => {
            setCustomerCheckLoading(true);
            const { data, error } = await supabase
               .from("stripe_customers")
               .select("customer_id")
               .eq("user_id", userId);
            if (error) {
               console.log("error getting customer Id", error);
            } else {
               if (data[0]?.customer_id) {
                  const hasPaymentMethods = await listPaymentMethods(
                     data[0]?.customer_id
                  );
                  if (!hasPaymentMethods) {
                    createPaymentElement(data[0]?.customer_id);
                }
               } else {
                  createPaymentElement(data[0]?.customer_id);
               }
            }
            setCustomerCheckLoading(false);
         };
         checkCustomerExists();
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [supabase, email, userId, user]);

   const listPaymentMethods = async (customerId) => {
      if (!customerId) {
         return Promise.reject(new Error("Customer ID is not provided"));
      }
      setPaymentMethodLoading(true);
      try {
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
            return false;
         }
         setPaymentMethods(res.data);
         console.log("cards", res);
         return res.data.length > 0 ? true : false;
      } catch (error) {
         console.error("Failed to fetch payment methods:", error);
         return false;
      } finally {
         setPaymentMethodLoading(false);
      }
   };

   const createPaymentElement = async (customerId) => {
      const requestBody = {
         email: email,
         user_id: userId,
         customer_id: customerId,
      };
      fetch(`${window.location.origin}/api/create-customer-setup-intent`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            requestBody,
         }),
      })
         .then((res) => res.json())
         .then(async (data) => {
            setClientSecret(data.client_secret);
            const { data: upsert, error } = await supabase
               .from("stripe_customers")
               .upsert({
                  customer_id: data.customer_id,
                  user_id: userId,
               });
            if (error) {
               console.log("error upserting customer id", error);
            } else {
               console.log("inserted customer id", upsert);
            }
         });
   };

   const deletePaymentMethod = async (paymentMethodId) => {
      fetch(`${window.location.origin}/api/delete-payment-method`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            paymentMethodId: paymentMethodId,
         }),
      })
         .then((res) => res.json())
         .then(async (data) => {
            if (!data.success) {
               console.log("error deleting card", data);
            } else {
               console.log("success deleting card", data);
               window.location.reload();
            }
         });
   };

   const theme = useTheme()
   const appearance = {
      theme: "flat",
      variables: {
         colorLogoTabSelected: theme.color.primary.brand.b600,
         colorPrimary: theme.color.primary.brand.b100,
         colorText: theme.color.black,
         colorPrimaryText: theme.color.primary.brand.b600,
         colorBackground: theme.color.primary.brand.b925,
         width: "100%",
         borderRadius: "5px",
      },
      layout: {
         type: "accordion",
         defaultCollapsed: false,
         radios: true,
         spacedAccordionItems: false,
      },
   };
   const options = {
      clientSecret,
      appearance,
   };

   return (
      <>
         {customerCheckLoading || paymentMethodLoading ? (
            <Loading />
         ) : (
            <>
               {paymentMethods?.length > 0 ? (
                  <MethodsWrapper>
                     <Para size="textlg" $weight="medium">
                        Methods
                     </Para>
                     {paymentMethods.map((method) => (
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
                              style={{ width: "auto" }}
                              onClick={() => deletePaymentMethod(method.id)}
                           >
                              Delete
                           </ButtonDiv>
                        </Card>
                     ))}
                  </MethodsWrapper>
               ) : (
                  clientSecret && (
                     <form>
                        <Elements options={options} stripe={stripePromise}>
                           <StripePaymentElement />
                        </Elements>
                     </form>
                  )
               )}
            </>
         )}
      </>
   );
}
