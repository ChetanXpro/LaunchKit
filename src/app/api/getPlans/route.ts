import { NextResponse } from "next/server";
import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";
import { stripe } from "@/configs/stripe";

export async function GET() {
  try {
    const stripePrices = (await stripe.prices.list()).data;

    const stripeProducts = (await stripe.products.list()).data;

    // stripePrices.forEach((price: any) => {
    //   const product = stripeProducts.find(
    //     (product) => product.id === price.product.toString()
    //   );
    //   if (product) {
    //     price.products = product;
    //   }
    // });

    return NextResponse.json(
      { data: stripePrices },
      { status: StatusCodes.OK }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
