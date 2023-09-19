import { Stripe } from "@trigger.dev/stripe";
import { Supabase } from "@trigger.dev/supabase";

export const stripe = new Stripe({
  id: "stripe",
  apiKey: process.env.NEXT_PUBLIC_STRIPE_TEST_KEY,
});

export const supabase = new Supabase({
  id: "supabase",
  supabaseUrl: `https://aocthgqmtpklqubodylf.supabase.co`,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
});
