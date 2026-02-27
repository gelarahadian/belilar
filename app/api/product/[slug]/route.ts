import { PrismaClient } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const prisma = new PrismaClient();

  const { slug } = params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    console.log("product api", product);

    return Response.json({ product }, { status: 200 });
  } catch (err: any) {
    console.log(err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
