import { client } from "@/trigger";
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
    id: "charge-booking",
    name: "Charge Completed Booking",
    version: "0.0.2",
    integrations: {
        stripe,
        supabase,
     },
    trigger: eventTrigger({
      name: "booking.charge",
    }),
    run: async (payload, io, ctx) => {

      const booking = payload

      if (booking.status !== "COMPLETED") { // no need?
        return
      }
  
     const getGuestPaymentMethod = await io.stripe.runTask(
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
           await io.logger.info("guest payment method", customer);
           return customer.invoice_settings.default_payment_method;
        }
     );

     const getHostPaymentMethod = await io.stripe.runTask(
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
           await io.logger.info("host payment method", customer);
           return customer.invoice_settings.default_payment_method;
        }
     );

     const amount = Math.round(
        booking.booking_price_total_before_taxes * 100
     );

     const applicationFee = Math.round(booking.processing_fee * 100); // have to provide the amount in cents.

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
                       application_fee_amount: applicationFee * 2,
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
    },
  })



