import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { headers } from "next/headers";

export async function GET() {

   try {
      const headersList = headers();
      const connect_account_id = headersList.get("X-Connect-Account-Id");
      const missing = await stripe.accounts.retrieve(
         connect_account_id
      );
      const missingData = missing.requirements.currently_due
      return NextResponse.json({ missingData, success: true });

   } catch (error) {
      return NextResponse.json({ message: error, success: false });
   }
}
