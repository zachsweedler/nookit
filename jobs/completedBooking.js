import { client } from "@/trigger";
import { intervalTrigger } from "@trigger.dev/sdk";
import { Stripe } from "@trigger.dev/stripe";
import { Supabase } from "@trigger.dev/supabase";

const stripe = new Stripe({
   id: "stripe",
   apiKey: process.env.NEXT_PUBLIC_STRIPE_TEST_KEY,
});

const supabase = new Supabase({
   id: "supabase",
   supabaseUrl: `https://aocthgqmtpklqubodylf.supabase.co`,
   supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

client.defineJob({
   id: "create-payment-intent-for-completed-bookings",
   name: "Create Payment Intent for Completed Bookings",
   version: "1.0.0",
   integrations: {
      stripe,
      supabase,
   },
   trigger: intervalTrigger({ seconds: 3600 }), // Run every hour
   run: async (payload, io, ctx) => {
      // Fetch accepted bookings where end_date is less than or equal to current date
      const bookings = await io.supabase.runTask(
         "fetch-completed-bookings",
         async (supabaseClient) => {
            const { data, error } = await supabaseClient
               .from("bookings")
               .select("*, nooks(price_type)")
               .lte("end_date", payload.ts.toISOString())
               .eq("status", "accepted");
            if (error) {
               await io.logger.error("Failed to fetch completed bookings:", {
                  error,
               });
               throw error;
            }
            await io.logger.info("booking data", data);
            return data;
         }
      );

      // For each completed booking, create a payment intent and update the booking with the payment_intent_id
      if (bookings.length > 0) {
         for (const booking of bookings) {

            const guestPaymentMethod = await io.stripe.runTask(
               "get-guest-payment-method",
               async (stripeClient) => {
                  const customer = await stripeClient.customers.retrieve(
                     booking.guest_customer_id
                  );
                  if (customer.error) {
                     await io.logger.error(
                        "Failed to create payment intent:",
                        customer.error
                     );
                     throw error;
                  }
                  await io.logger.info("payment method via data", customer);
                  return customer.invoice_settings.default_payment_method;
               }
            );
            const hostPaymentMethod = await io.stripe.runTask(
               "get-host-payment-method",
               async (stripeClient) => {
                  const customer = await stripeClient.customers.retrieve(
                     booking.host_customer_id
                  );
                  if (customer.error) {
                     await io.logger.error(
                        "Failed to create payment intent:",
                        customer.error
                     );
                     throw error;
                  }
                  await io.logger.info("payment method via data", customer);
                  return customer.invoice_settings.default_payment_method;
               }
            );

            const amount = Math.round(
               booking.booking_price_total_before_taxes * 100
            );
            const applicationFee = Math.round(booking.processing_fee * 100);

            if (booking.nooks.price_type === "dailyRate") {
               const paymentIntent = await io.stripe.runTask(
                  "create-payment-intent",
                  async (stripeClient, task) => {
                     const createPaymentIntent =
                        await stripeClient.paymentIntents.create(
                           {
                              automatic_payment_methods: {
                                 enabled: true,
                              },
                              currency: "usd",
                              amount: amount, // have to provide the amount in cents. $100 + $30 guest fee = $130
                              application_fee_amount: applicationFee * 2, // have to provide the amount in cents.
                              customer: booking.guest_customer_id,
                              payment_method: guestPaymentMethod,
                              confirm: true,
                              off_session: true,
                              transfer_data: {
                                 destination: booking.host_connect_account_id,
                              },
                           },
                           {
                              idempotencyKey: task.idempotencyKey,
                           }
                        );
                     if (createPaymentIntent.error) {
                        await io.logger.error(
                           "Failed to create payment intent:",
                           createPaymentIntent.error
                        );
                        throw error;
                     }
                     return createPaymentIntent;
                  }
               );
               await io.supabase.runTask(
                  "update-booking-with-payment-intent",
                  async (supabaseClient) => {
                     const { data, error } = await supabaseClient
                        .from("bookings")
                        .update({
                           destination_payment_intent_id: paymentIntent.id,
                           status: "completed",
                        })
                        .eq("id", booking.id)
                        .select();
                     if (error) {
                        throw error;
                     }
                     return data;
                  }
               );
            } else {
               const guestPaymentIntent = await io.stripe.runTask(
                  "create-payment-intent-for-guest",
                  async (stripeClient, task) => {
                     const createPaymentIntent =
                        await stripeClient.paymentIntents.create(
                           {
                              automatic_payment_methods: {
                                 enabled: true,
                              },
                              currency: "usd",
                              amount: amount,
                              customer: booking.guest_customer_id,
                              payment_method: guestPaymentMethod,
                              confirm: true,
                              off_session: true,
                           },
                           {
                              idempotencyKey: task.idempotencyKey,
                           }
                        );
                     if (createPaymentIntent.error) {
                        await io.logger.error(
                           "Failed to create payment intent:",
                           createPaymentIntent.error
                        );
                        throw error;
                     }
                     return createPaymentIntent;
                  }
               );
               await io.supabase.runTask(
                  "update-booking-with-customer-payment-intent",
                  async (supabaseClient) => {
                     const { data, error } = await supabaseClient
                        .from("bookings")
                        .update({
                           guest_payment_intent_id: guestPaymentIntent.id,
                           status: "completed",
                        })
                        .eq("id", booking.id)
                        .select();
                     if (error) {
                        throw error;
                     }
                     return data;
                  }
               );
               const hostPaymentIntent = await io.stripe.runTask(
                  "create-payment-intent-for-host",
                  async (stripeClient, task) => {
                     const createPaymentIntent =
                        await stripeClient.paymentIntents.create(
                           {
                              automatic_payment_methods: {
                                 enabled: true,
                              },
                              currency: "usd",
                              amount: amount,
                              customer: booking.host_customer_id,
                              payment_method: hostPaymentMethod,
                              confirm: true,
                              off_session: true,
                           },
                           {
                              idempotencyKey: task.idempotencyKey,
                           }
                        );
                     if (createPaymentIntent.error) {
                        await io.logger.error(
                           "Failed to create payment intent:",
                           createPaymentIntent.error
                        );
                        throw error;
                     }
                     return createPaymentIntent;
                  }
               );
               await io.supabase.runTask(
                  "update-booking-with-host-payment-intent",
                  async (supabaseClient) => {
                     const { data, error } = await supabaseClient
                        .from("bookings")
                        .update({
                           host_payment_intent_id: hostPaymentIntent.id,
                        })
                        .eq("id", booking.id)
                        .select();
                     if (error) {
                        throw error;
                     }
                     return data;
                  }
               );
            }
         }
      }
   },
});
