import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const prisma = new PrismaClient();

  try {
    const session = await auth();
    const orders = await prisma.order.findMany({
      where: {
        userId: session?.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        cartItems: true,
      },
    });
    return Response.json({ orders }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
