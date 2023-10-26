import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { Stripe } from "@trigger.dev/stripe";
import { Supabase, SupabaseManagement } from "@trigger.dev/supabase";

const stripe = new Stripe({
   id: "stripe",
   apiKey: process.env.NEXT_PUBLIC_STRIPE_TEST_KEY,
});

const supabase = new Supabase({
   id: "supabase",
   supabaseUrl: `https://aocthgqmtpklqubodylf.supabase.co`,
   supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

const supabaseManagement = new SupabaseManagement({
   id: "supabase-management",
});

const supabaseTriggers = supabaseManagement.db(
   process.env.NEXT_PUBLIC_SUPABASE_URL
);

client.defineJob({
   id: "schedule-booking-completion",
   name: "Schedule Booking Completion",
   version: "1.0.0",
   trigger: supabaseTriggers.onUpdated({
      schema: "public",
      table: "bookings",
      filter: {
         old_record: {
            status: ["pending"],
         },
         record: {
            status: ["accepted"],
            end_date: [{ $exists: true }],
         },
      },
   }),
   run: async (payload, io, ctx) => {
      // Every time the booking is updated, we will update the deliverAt of this event
      await io.sendEvent(
         "schedule-booking-complete",
         {
            id: `booking.complete.${payload.record.id}`,
            name: "booking.initiate-completion",
            payload: payload,
         },
         {
            deliverAt: new Date(payload.record.end_date),
         }
      );
   },
});

client.defineJob({
   id: "schedule-booking-completion",
   name: "Schedule Booking Completion",
   version: "1.0.0",
   trigger: eventTrigger({
      name: "booking.initiate-completion",
   }),
   integrations: {
      supabase,
      stripe,
   },
   run: async (payload, io, ctx) => {

      const booking = payload.record;

      if (booking.status === 'canceled') {
         return null
      } 

      const priceType = await io.supabase.runTask(
         "get-price-type",
         async (db) => {
            const { data, error } = await db
               .from("bookings")
               .select("nooks(price_type)")
               .eq("id", booking.id);
            if (error) {
               throw error;
            }
            return data[0].price_type;
         }
      );

      // Update the booking (using the `id` in the payload) to be completed
      await io.supabase.runTask("complete-booking", async (db) => {
         const { data, error } = await db
            .from("bookings")
            .update({ status: "completed" })
            .eq("id", booking.id);
         if (error) {
            throw error;
         }
         return data;
      });

      // get the payment method of the pop in guest
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
            await io.logger.info("guest payment method", customer);
            return customer.invoice_settings.default_payment_method;
         }
      );

      // get the payment method of the host (used for salesPercent bookings, not dailyRate)
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
            await io.logger.info("host payment method", customer);
            return customer.invoice_settings.default_payment_method;
         }
      );

      // multiply pricing by 100 to get amount in cents (stripe requirement).
      const amount = Math.round(booking.booking_price_total_before_taxes * 100);
      const applicationFee = Math.round(booking.processing_fee * 100);

      if (priceType === "dailyRate") {

         // payment flow for daily rate booking 
         await io.stripe.runTask(
            "create-payment-intent",
            async (stripeClient, task) => {
               const createPaymentIntent =
                  await stripeClient.paymentIntents.create(
                     {
                        automatic_payment_methods: {
                           enabled: true,
                        },
                        currency: "usd",
                        amount: amount,
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

         // payment flow for salesPercent booking
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
});
