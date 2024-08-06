import { PrismaClient } from "@prisma/client";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  const _req = await req.json();

  try {
    const coupon = await stripe.coupons.retrieve(_req.couponCode);
    console.log(coupon);

    return Response.json(coupon);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
