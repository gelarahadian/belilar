import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json(tags);
  } catch (err: any) {
    console.log(err);
    return new Response(err.message, { status: 500 });
  }
}
