import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, website } = body;
        const account = await stripe.accounts.create({
            type: 'express',
            email: email,
            business_profile: {
              url: website,
            },
            capabilities: {
              transfers: {
                requested: true,
              },
            },
        });
        console.log('account created', account);
        return NextResponse.json({ account: account, success: true });
    } 
    catch (error) {
        return NextResponse.json({ message: error, success: false });
    }
}