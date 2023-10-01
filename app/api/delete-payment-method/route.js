import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_TEST_KEY);
export const dynamic = 'force-dynamic'

export async function POST(req) {
    try {
        const body = await req.json();
        const { paymentMethodId } = body;
        const deleted = await stripe.paymentMethods.detach(
            paymentMethodId
          );
        console.log('card deleted', deleted);
        return NextResponse.json({ deleted, success: true });
    } 
    catch (error) {
        return NextResponse.json({ message: error, success: false });
    }
}

