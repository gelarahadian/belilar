import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

export async function GET(req: Request) {
  const prisma = new PrismaClient();
  const session = await auth();
  const user_id = session?.user.id;

  console.log(user_id);

  try {
    const likedProduct = await prisma.product.findMany({
      where: {
        likes: {
          has: user_id,
        },
      },
    });
    return Response.json({ likedProduct });
  } catch (err: any) {
    return Response.json({ err: err.message });
  }
}
