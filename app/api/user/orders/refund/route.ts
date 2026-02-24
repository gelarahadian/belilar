import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import queryString from "query-string";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const prisma = new PrismaClient();

  try {
    // get current user
    const session = await auth();
    // get the order to refund
    const searchParams = queryString.parseUrl(req.url).query;
    const { orderId } = searchParams;
    const order = await prisma.order.findUnique({
      where: {
        id: orderId as string | undefined,
      },
      // include: {
      //   cartItems: {
      //     select: {
      //       productId: true,
      //       quantity: true,
      //     },
      //   },
      // },
    });

    // check is order exists
    if (!order || order.userId !== session?.user?.id) {
      return Response.json({ msg: "Order not found" }, { status: 404 });
    }

    // make refund request to the stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.payment_intent,
      reason: "requested_by_customer",
    });

    // update quantitties of product on refunded items
    // for (const cartItem of order.cartItems) {
    //   console.log("cartItem ===========>", cartItem);
    //   const product = await prisma.product.findUnique({
    //     where: {
    //       id: cartItem.productId,
    //     },
    //   });
    //   if (product) {
    //     await prisma.product.update({
    //       where: {
    //         id: product.id,
    //       },
    //       data: {
    //         stock: (product?.stock || 0) + cartItem.quantity,
    //       },
    //     });
    //   }
    // }

    // updata order in the databbase with refunds details
    await prisma.order.update({
      where: {
        id: orderId as string | undefined,
      },
      data: {
        // status: "Refunded",
        refunded: true,
        deliveryStatus: "Cancelled",
        refundId: refund.id,
      },
    });
    return Response.json(
      { mesasge: "Order Refunded Successfully " },
      { status: 200 }
    );
  } catch (err: any) {
    console.log(err);
    return Response.json(err.message, { status: 500 });
  }
}
