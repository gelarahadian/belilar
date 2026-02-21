import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResetEmail } from "@/lib/mail";
import crypto from "crypto";

// Token expires in 1 hour
const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase();

    // ── 1. Validate input ──────────────────────────────────────────────────────
    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    // ── 2. Check if user exists ────────────────────────────────────────────────
    // Always return 200 even if user not found (prevents email enumeration)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "If that email is registered, a reset link has been sent." },
        { status: 200 },
      );
    }

    // ── 3. Invalidate existing tokens for this user ────────────────────────────
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // ── 4. Generate secure token ───────────────────────────────────────────────
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

    // ── 5. Persist token ───────────────────────────────────────────────────────
    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
      },
    });

    // ── 6. Send email ──────────────────────────────────────────────────────────
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${rawToken}`;
    await sendResetEmail({
      to: user.email,
      name: user.name ?? "there",
      resetUrl,
    });

    return NextResponse.json(
      { message: "If that email is registered, a reset link has been sent." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[FORGOT_PASSWORD]", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
