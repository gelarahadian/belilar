import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body ?? {};

    // ── 1. Validate input ────────────────────────────────────────────────────
    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 },
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "OTP must be a 6-digit number." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── 2. Find user ─────────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { emailVerificationTokens: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email." },
        { status: 404 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified. Please sign in." },
        { status: 409 },
      );
    }

    // ── 3. Find matching token ───────────────────────────────────────────────
    const hashedOtp = hashOtp(otp);
    const tokenRecord = user.emailVerificationTokens.find(
      (t) => t.otp === hashedOtp,
    );

    if (!tokenRecord) {
      return NextResponse.json(
        { message: "Invalid verification code. Please try again." },
        { status: 400 },
      );
    }

    // ── 4. Check expiry ──────────────────────────────────────────────────────
    if (tokenRecord.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: { id: tokenRecord.id },
      });
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new one." },
        { status: 400 },
      );
    }

    // ── 5. Mark email as verified & clean up tokens ──────────────────────────
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      }),
      prisma.emailVerificationToken.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return NextResponse.json(
      { message: "Email verified successfully! You can now sign in." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[VERIFY_OTP]", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
