import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ─── PATCH /api/user/profile/password ─────────────────────────────────────────
// Body: { currentPassword: string, newPassword: string }

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current and new password are required." },
        { status: 400 },
      );
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters." },
        { status: 400 },
      );
    }
    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json(
        { message: "New password must contain at least one uppercase letter." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      return NextResponse.json(
        { message: "No password set. Use social login or reset password." },
        { status: 400 },
      );
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Current password is incorrect." },
        { status: 401 },
      );
    }

    // Prevent same password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return NextResponse.json(
        { message: "New password must be different from current password." },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed, updatedAt: new Date() },
    });

    return NextResponse.json(
      { message: "Password changed successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PROFILE_PASSWORD]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
