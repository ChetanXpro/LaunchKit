import connectDB from "@/configs/dbConfig/dbConfig";
import { stripe } from "@/configs/stripe";
import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_05f8f8cf54db4b539a4d4474a8c7c20847555108d33bafd3122c5af80af35386";

connectDB();

export async function POST(request: NextRequest) {
  const buf = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, endpointSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);

    return NextResponse.json(
      {
        error: {
          message: `Webhook Error: ${errorMessage}`,
        },
      },
      { status: 400 }
    );
  }

  // Successfully constructed event.
  console.log("✅ Success:", event.id);

  try {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionId = subscription.id;
    const customerEmail = subscription.metadata.payingUserEmail;

    switch (event.type) {
      case "customer.subscription.created":
        console.log(
          "customer.subscription.created",
          customerEmail,
          subscriptionId
        );

        const updated = await Users.findOneAndUpdate(
          { email: customerEmail },
          {
            subscriptionId,
            isActiveSubscription: true,
          }
        );

        console.log("updated", updated);

        break;

      case "customer.subscription.deleted":
        await Users.findOneAndUpdate(
          { email: customerEmail },
          {
            isActiveSubscription: false,
          }
        );
      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: `Method Not Allowed`,
        },
      },
      { status: 405 }
    ).headers.set("Allow", "POST");
  }
}
