import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const { name } = body;

  const prisma = new PrismaClient();

  const slugifyName = slugify(name, { lower: true });

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: slugifyName },
    });

    if (existingCategory) {
      return Response.json("Tag already exists", { status: 409 });
    }

    const tagUpdated = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        slug: slugify(name),
        updatedAt: new Date(),
      },
    });

    return Response.json({ tagUpdated });
  } catch (err: any) {
    return Response.json({ err: err.message });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const prisma = new PrismaClient();

  try {
    const tagDeleted = await prisma.category.delete({
      where: {
        id: id,
      },
    });

    return Response.json({ tagDeleted }, { status: 200 });
  } catch (err: any) {
    return Response.json({ err: err.message }, { status: 500 });
  }
}
