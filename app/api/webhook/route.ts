import { Address, CartItem, PrismaClient } from "@prisma/client";
import { create } from "domain";
import slugify from "slugify";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  const _raw = await req.text();
  const sig = req.headers.get("stripe-signature");

  try {
    // construct the event using stripe sdk
    const event = stripe.webhooks.constructEvent(
      _raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // console.log("EVENT ========> ", event);

    // handle the event
    switch (event.type) {
      case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        const { id, ...rest } = chargeSucceeded;

        // decrement stock, gather product ids
        const cartItems = JSON.parse(chargeSucceeded.metadata.cartItems);
        const productIds = cartItems.map((item: any) => item.id);

        // fetch all products in one query
        const products = await prisma.product.findMany({
          where: {
            id: { in: productIds },
          },
        });

        // create an object to quickly map product details by id
        const productMap: any = {};

        products.forEach((product) => {
          productMap[product.id.toString()] = {
            id: product.id,
            title: product.title,
            slug: product.slug,
            price: product.price,
            image: product.images[0]?.secure_url || "",
          };
        });

        // creat cartItems with product details
        const cartItemsWithProductDetails = cartItems.map((cartItems: any) => ({
          ...productMap[cartItems.id],
          quantity: cartItems.quantity,
        }));

        console.log(cartItemsWithProductDetails.length);

        // create order
        // const newOrder = await prisma.order.create({
        //   data: {
        //     chargeId: id as string,
        //     payment_intent: rest.payment_intent as string,
        //     receipt_url: rest.receipt_url as string,
        //     refunded: rest.refunded as boolean,
        //     // status: rest.status as string,
        //     amount_captured: rest.amount_captured as number,
        //     currency: rest.currency as string,
        //     shipping: {
        //       address: {
        //         city: rest.shipping.address.city,
        //         country: rest.shipping.address.country,
        //         line1: rest.shipping.address.line1,
        //         line2: rest.shipping.address.line2,
        //         postal_code: rest.shipping.address.postal_code,
        //         state: rest.shipping.address.state,
        //       },
        //     },
        //     user: {
        //       connect: {
        //         id: chargeSucceeded.metadata.userId,
        //       },
        //     },
        //     // cartItems: {
        //     //   create: cartItemsWithProductDetails.map((item: CartItem) => {
        //     //     return {
        //     //       product: {
        //     //         connect: { id: item.id },
        //     //       },
        //     //       title: item.title,
        //     //       slug: item.slug,
        //     //       price: item.price,
        //     //       image: item.image,
        //     //       quantity: item.quantity,
        //     //     };
        //     //   }) as CartItem[],
        //     // },
        //   },
        // });

        for (const cartItem of cartItems) {
          const product = await prisma.product.findUnique({
            where: {
              id: cartItem.id,
            },
          });
          if (product) {
            await prisma.product.update({
              where: {
                id: cartItem.id,
              },
              data: {
                stock: (product?.stock || 0) - cartItem.quantity,
              },
            });
          }
        }

        return Response.json({ ok: true }, { status: 200 });
    }
    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        err: "Server error. Please try again",
      },
      { status: 500 }
    );
  }
}
