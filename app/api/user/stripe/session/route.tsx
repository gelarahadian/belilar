import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

interface CartItem {
  id: string;
  quantity: number;
}

interface RequestBody {
  cartItems: CartItem[];
  couponCode?: string;
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  const { cartItems, couponCode } = (await req.json()) as RequestBody;
  const data = await auth();
  try {
    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await prisma.product.findMany({
          where: { id: item.id },
        });
        const unitAmount = product[0].price;
        return {
          price_data: {
            currency: "aud",
            product_data: {
              name: product[0].title,
              images: [product[0]?.images[0]?.secure_url || ""],
            },
            unit_amount: unitAmount,
          },
          tax_rates: [process.env.STRIPE_TAX_RATE],
          quantity: item.quantity,
        };
      })
    );
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      success_url: `${process.env.DOMAIN}/dashboard/user/stripe/success`,
      client_reference_id: data?.user.id,
      mode: "payment",
      payment_method_types: ["card"],
      payment_intent_data: {
        metadata: {
          cartItems: JSON.stringify(cartItems),
          userId: data?.user.id,
        },
      },
      shipping_options: [{ shipping_rate: process.env.STRIPE_SHIPPING_RATE }],
      shipping_address_collection: {
        allowed_countries: ["AU"],
      },
      discounts: [{ coupon: couponCode }],
      customer_email: data?.user.email,
    });

    console.log("stripe checkout session => ", session);
    return Response.json(session, { status: 200 });
  } catch (err: any) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
