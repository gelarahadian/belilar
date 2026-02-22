import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email or password is required." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 },
    );
  }

  if (!user.password) {
    return NextResponse.json(
      {
        error:
          "This account is registered using Google. Please login with Google.",
      },
      { status: 400 },
    );
  }

  if (!user.emailVerified) {
    return NextResponse.json({ error: "Email not verified" }, { status: 400 });
  }

  console.log(typeof user.password);
  console.log(user.password);
  const valid = await bcrypt.compare(password, user.password!);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true });
}
