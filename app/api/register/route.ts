import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mail";
import { generateOtp, hashOtp } from "@/lib/otp";
import bcrypt from "bcryptjs";

// OTP expires in 15 minutes
const OTP_EXPIRY_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body ?? {};

    // ── 1. Validate input ────────────────────────────────────────────────────
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
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

    const normalizedEmail = email.trim().toLowerCase();

    // ── 2. Check existing email ──────────────────────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      // If already verified, reject
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { message: "An account with this email already exists." },
          { status: 409 },
        );
      }

      // If registered but not verified, resend a new OTP
      await prisma.emailVerificationToken.deleteMany({
        where: { userId: existingUser.id },
      });

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

      await prisma.emailVerificationToken.create({
        data: {
          otp: hashOtp(otp),
          userId: existingUser.id,
          expiresAt,
        },
      });

      await sendOtpEmail({
        to: normalizedEmail,
        name: existingUser.name ?? "there",
        otp,
      });

      return NextResponse.json(
        {
          message: "A new verification code has been sent to your email.",
          email: normalizedEmail,
        },
        { status: 200 },
      );
    }

    // ── 3. Create user (unverified) ──────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        emailVerified: null, // not verified yet
      },
    });

    // ── 4. Generate & store OTP ──────────────────────────────────────────────
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await prisma.emailVerificationToken.create({
      data: {
        otp: hashOtp(otp),
        userId: user.id,
        expiresAt,
      },
    });

    // ── 5. Send OTP email ────────────────────────────────────────────────────
    await sendOtpEmail({
      to: normalizedEmail,
      name: user.name ?? "there",
      otp,
    });

    return NextResponse.json(
      {
        message:
          "Account created! Please check your email for the verification code.",
        email: normalizedEmail,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[REGISTER]", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
