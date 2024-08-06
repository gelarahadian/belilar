import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  const prisma = new PrismaClient();

  try {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingEmail) {
      return new Response("Email already exists", { status: 200 });
    }

    const data = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
      },
    });

    return Response.json({ data });
  } catch (err: any) {
    return new Response(`Error creating user: ${err.message}`);
  }
}
