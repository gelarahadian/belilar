import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body ?? {};

    // ── 1. Validate input ────────────────────────────────────────────────────
    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and new password are required." },
        { status: 400 },
      );
    }

    if (!/^(?=.*[A-Z]).{8,}$/.test(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters and contain one uppercase letter.",
        },
        { status: 400 },
      );
    }

    // ── 2. Hash the raw token to compare with DB ─────────────────────────────
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // ── 3. Find token record ─────────────────────────────────────────────────
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { message: "Invalid or expired reset link. Please request a new one." },
        { status: 400 },
      );
    }

    // ── 4. Check expiry ──────────────────────────────────────────────────────
    if (tokenRecord.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { id: tokenRecord.id } });
      return NextResponse.json(
        { message: "Reset link has expired. Please request a new one." },
        { status: 400 },
      );
    }

    // ── 5. Update password & delete token (in transaction) ──────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { userId: tokenRecord.userId },
      }),
    ]);

    return NextResponse.json(
      { message: "Password reset successfully. You can now sign in." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
