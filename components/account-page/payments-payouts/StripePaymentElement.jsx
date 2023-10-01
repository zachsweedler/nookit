"use client";
import { ButtonDiv } from "@/styles/Buttons";
import {
   PaymentElement,
   useElements,
   useStripe,
} from "@stripe/react-stripe-js";
import styled from "styled-components";

export default function StripePaymentElement() {
   const elements = useElements();
   const stripe = useStripe();

   const confirmPaymentMethod = async (event) => {
      event.preventDefault();
      if (!stripe || !elements) {
         return;
      }
      const result = await stripe.confirmSetup({
         elements,
         confirmParams: {
            return_url: `${window.location}`
          },
      });
      if (result.error) {
         console.log(result.error.message);
      } else {
         console.log("success saving payment method");
      }
   };

   return (
      <Wrapper>
         <PaymentElement />
         <ButtonDiv
            $brandcolor={true}
            onClick={confirmPaymentMethod}
            type="submit"
         >
            Add Card
         </ButtonDiv>
      </Wrapper>
   );
}


const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 20px;
`