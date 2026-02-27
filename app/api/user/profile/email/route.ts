import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── PATCH /api/user/profile/email ────────────────────────────────────────────
// Body: { email: string, password: string }

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { email, password } = await req.json();

    if (!email?.trim()) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: 400 },
      );
    }

    // Fetch current user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // If user has password, require it for email change
    if (user.password) {
      if (!password) {
        return NextResponse.json(
          { message: "Password is required to change email." },
          { status: 400 },
        );
      }
      const bcrypt = require("bcryptjs");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return NextResponse.json(
          { message: "Incorrect password." },
          { status: 401 },
        );
      }
    }

    // Check email not already taken
    if (email.toLowerCase() === user.email.toLowerCase()) {
      return NextResponse.json(
        { message: "This is already your current email." },
        { status: 409 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { message: "Email already in use by another account." },
        { status: 409 },
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        email: email.toLowerCase(),
        emailVerified: null, // require re-verification
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Email updated. Please verify your new email." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PROFILE_EMAIL]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
