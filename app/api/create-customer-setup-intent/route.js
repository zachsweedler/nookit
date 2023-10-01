import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_TEST_KEY);
export const dynamic = "force-dynamic";

export async function POST(req) {
   try {
      const data = await req.json();
      const { customer_id, user_id, email } = data.requestBody;
      let customerId = customer_id; // Default to the provided customer_id
      if (!customerId) {
         customerId = await createStripeCustomer(email, user_id);
         console.log("new customer created", customerId);
      }

      // Create a Setup for Customer
      const setupIntent = await stripe.setupIntents.create({
         automatic_payment_methods: { enabled: true },
         customer: customerId,
      });

      return NextResponse.json({
         client_secret: setupIntent.client_secret,
         customer_id: customerId,
         success: true,
      });
   } catch (error) {
      console.log("error creating setup intent", error);
      return NextResponse.json({ message: error.message, success: false });
   }
}

async function createStripeCustomer(email, user_id) {
   const customer = await stripe.customers.create({
      description: user_id,
      email: email,
   });
   return customer.id;
}
