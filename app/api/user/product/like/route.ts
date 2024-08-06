import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

export async function PUT(req: Request) {
  const session = await auth();
  const body = await req.json();
  const { product_id } = body;
  const prisma = new PrismaClient();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: product_id,
      },
    });
    let updateProductLike = [];

    if (product && product.likes.includes(session.user.id)) {
      updateProductLike = product.likes.filter(
        (user_id) => user_id.toString() !== session.user.id
      );
    } else {
      updateProductLike = [...(product?.likes ?? []), session.user.id];
    }

    console.log("product_id:", product_id);

    const update = await prisma.product.update({
      where: {
        id: product_id,
      },
      data: {
        likes: updateProductLike,
      },
    });

    if (update.likes.includes(session.user.id)) {
      return Response.json({ message: "product liked" }, { status: 200 });
    } else {
      return Response.json({ message: "product unliked" }, { status: 200 });
    }
  } catch (err: any) {
    console.log(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
