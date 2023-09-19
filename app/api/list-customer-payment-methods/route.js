import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { headers } from "next/headers";

export async function GET() {
   try {
      const headersList = headers();
      const customer_id = headersList.get("X-Customer-Id");
      const { data } = await stripe.paymentMethods.list({
         customer: customer_id,
         type: "card",
      });
      return NextResponse.json({ data, success: true });
   } catch (error) {
      return NextResponse.json({ message: error, success: false });
   }
}
