import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { headers } from "next/headers";

export async function GET() {
    try {
        const headersList = headers();
        const connect_account_id = headersList.get("X-Connect-Account-Id");
        console.log('connect id', connect_account_id)
        const accountLink = await stripe.accountLinks.create({
            account: connect_account_id,
            refresh_url: 'http://localhost:3000/account/payments-payouts/continue-express-onboarding',
            return_url: 'http://localhost:3000/account/payments-payouts',
            type: 'account_onboarding',
        });
        console.log('account link created', accountLink);
        return NextResponse.json({ accountLink, success: true });
    } 
    catch (error) {
        return NextResponse.json({ message: error, success: false });
    }
}