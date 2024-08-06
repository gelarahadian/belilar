import { DeliveryStatus, PrismaClient } from "@prisma/client";

export async function PUT(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const prisma = new PrismaClient();
  const { delivery_status } = await req.json();
  console.log(delivery_status);
  console.log(params);
  console.log(params.orderId);
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: params.orderId as string,
      },
    });
    const updatedOrder = await prisma.order.update({
      where: {
        id: params.orderId as string,
      },
      data: {
        status: order?.status,
        deliveryStatus: delivery_status,
      },
    });
    console.log(order);

    return Response.json(updatedOrder, { status: 200 });
  } catch (err: any) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
