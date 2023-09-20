import Stripe from "stripe";
import { Stripe as BrowserStripe, loadStripe } from "@stripe/stripe-js";
// import {} from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

// https://vercel.com/guides/getting-started-with-nextjs-typescript-stripe
let stripePromise: Promise<BrowserStripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);
  }
  return stripePromise;
};

export default getStripe;

// create stripe customer
export const createStripeCustomer = async (email: string) => {
  const customer = await stripe.customers.create({
    email,
  });

  return customer;
};

// Stripe Plans
export const stripePlans = [
  {
    id: "price_1Ns8xMSFtLfNSPgol8PQUKFZ",
    planType: "Basic plan",
    price: "15$",
    planPoint: ["No extra fees", "No hidden charges", "No extra charges"],
  },
  {
    id: "price_1NrktySFtLfNSPgoGyfAJgja",
    planType: "Standard Plan",
    price: "35$",
    planPoint: ["No extra fees", "No hidden charges", "No extra charges"],
  },
  {
    id: "price_1NrkvDSFtLfNSPgoBEeRRRGo",
    planType: "Expensive Plan",
    price: "100$",
    planPoint: ["No extra fees", "No hidden charges", "No extra charges"],
  },
];
