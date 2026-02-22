import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mail";
import { generateOtp, hashOtp } from "@/lib/otp";

const OTP_EXPIRY_MS = 15 * 60 * 1000;
// Cooldown: prevent spam — 1 minute between resends
const RESEND_COOLDOWN_MS = 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 },
      );
    }

    // ── 1. Find user ─────────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        emailVerificationTokens: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email." },
        { status: 404 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified." },
        { status: 409 },
      );
    }

    // ── 2. Cooldown check ────────────────────────────────────────────────────
    const lastToken = user.emailVerificationTokens[0];
    if (lastToken) {
      const elapsed = Date.now() - lastToken.createdAt.getTime();
      if (elapsed < RESEND_COOLDOWN_MS) {
        const secondsLeft = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
        return NextResponse.json(
          {
            message: `Please wait ${secondsLeft} seconds before requesting a new code.`,
            secondsLeft,
          },
          { status: 429 },
        );
      }
    }

    // ── 3. Delete old tokens & generate new OTP ──────────────────────────────
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await prisma.emailVerificationToken.create({
      data: { otp: hashOtp(otp), userId: user.id, expiresAt },
    });

    await sendOtpEmail({ to: email, name: user.name ?? "there", otp });

    return NextResponse.json(
      { message: "A new verification code has been sent to your email." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[RESEND_OTP]", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
