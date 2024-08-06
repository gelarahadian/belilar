import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const { name, categoryId } = body;

  const prisma = new PrismaClient();

  const slugifyName = slugify(name);

  if (!categoryId) {
    return Response.json("Category Id Undefined", { status: 400 });
  }

  try {
    const existingTag = await prisma.tag.findUnique({
      where: { slug: slugifyName },
    });

    if (existingTag && existingTag.id !== id) {
      return Response.json("Tag already exists", { status: 409 });
    }

    const tagUpdated = await prisma.tag.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        slug: slugify(name),
        categoryId: categoryId,
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
    const tagDeleted = await prisma.tag.delete({
      where: {
        id: id,
      },
    });

    return Response.json({ tagDeleted });
  } catch (err: any) {
    return Response.json({ err: err.message });
  }
}
