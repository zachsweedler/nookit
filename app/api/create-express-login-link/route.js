import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
export const dynamic = 'force-dynamic'

export async function POST(req) {
    try {
        const body = await req.json();
        const { connect_account_id } = body;
        const loginLink = await stripe.accounts.createLoginLink(connect_account_id);
        console.log('account created', loginLink.url);
        return NextResponse.json({ link: loginLink.url, success: true });
    } 
    catch (error) {
        return NextResponse.json({ message: error, success: false });
    }
}

