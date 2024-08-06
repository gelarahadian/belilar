import { auth } from "@/auth";
import { PrismaClient, Product, Rating } from "@prisma/client";

export async function POST(req: Request, res: Response) {
  const prisma = new PrismaClient();

  const body = await req.json();
  const { productId, rating, comment } = body;
  const session = await auth();

  console.log(parseInt(rating));

  let existingRating;

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        ratings: true,
      },
    });

    existingRating =
      product &&
      product.ratings.find(
        (rate) => rate.postedById.toString() === session?.user.id.toString()
      );

    if (existingRating) {
      const productUpdateRating = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          ratings: {
            update: [
              {
                where: {
                  postedById: "6641767de8ac28e7f64f3608",
                },
                data: {
                  rating: parseInt(rating),
                  comment,
                },
              },
            ],
          },
        },
        include: {
          ratings: true,
        },
      });
      return Response.json({ productUpdateRating });
    }

    const productCreateRating = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ratings: {
          create: {
            rating: parseInt(rating),
            comment,
            postedById: session?.user.id,
          },
        },
      },
      include: {
        ratings: true,
      },
    });

    return Response.json({ productCreateRating });
  } catch (err: any) {
    console.log(err);
    return Response.json({ message: err.message }, { status: 200 });
  }

  //   return Response.json({ user: session?.user }, { status: 200 });
}
