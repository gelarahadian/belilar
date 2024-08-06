import { DeliveryStatus, PrismaClient } from "@prisma/client";

export async function GET(req: Request, res: Response) {
  const prisma = new PrismaClient();
  const tagIDs: any[] = [];
  try {
    const newOrder = await prisma.order.update({
      where: {
        id: "669e15290a06905d30de1962",
      },

      data: {
        amount_captured: 234,
        deliveryStatus: "Delivered",
      },
    });
    return Response.json({ message: "successfull", newOrder }, { status: 200 });
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 402 });
  }
}
