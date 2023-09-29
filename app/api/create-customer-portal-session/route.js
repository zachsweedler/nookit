import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_TEST_KEY);
export const dynamic = 'force-dynamic'

export async function POST(req) {
   try {

      const data = await req.json();
      const { customer_id, user_id, email } = data;
      // Determine whether to create a new customer or use an existing one
      const customerId = customer_id || (await createStripeCustomer(email, user_id));

      // Create a Stripe Checkout Session
      const session = await stripe.billingPortal.sessions.create({
         customer: customerId,
         return_url: "https://nookit.app/account/payments-payouts/payments",
      });

      const sessionUrl = session.url;
      console.log("session", session);
      return NextResponse.json({ sessionUrl, customerId, success: true });
   } catch (error) {
      console.log("error", error);
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
