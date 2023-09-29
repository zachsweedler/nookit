import { NextResponse } from "next/server";
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_TEST_KEY);
import { headers } from "next/headers";
export const dynamic = 'force-dynamic'

export async function GET() {
   try {
      const headersList = headers();
      const connect_account_id = headersList.get("X-Connect-Account-Id");
      const { data } = await stripe.accounts.listExternalAccounts(
         connect_account_id,
         { object: "card" }
      );
      return NextResponse.json({ data, success: true });
   } catch (error) {
      return NextResponse.json({ message: error, success: false });
   }
}
