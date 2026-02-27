import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── GET /api/user/address ────────────────────────────────────────────────────

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ addresses }, { status: 200 });
  } catch (error) {
    console.error("[ADDRESS_GET]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── POST /api/user/address ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const {
      label,
      recipient,
      phone,
      line1,
      line2,
      city,
      state,
      postal_code,
      country,
      isDefault,
    } = body;

    // Validate required fields
    if (
      !label ||
      !recipient ||
      !line1 ||
      !city ||
      !state ||
      !postal_code ||
      !country
    ) {
      return NextResponse.json(
        { message: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    // If setting as default, unset all others first
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    // If this is the first address, auto-set as default
    const count = await prisma.address.count({
      where: { userId: session.user.id },
    });

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        label,
        recipient,
        phone: phone || null,
        line1,
        line2: line2 || null,
        city,
        state,
        postal_code,
        country,
        isDefault: isDefault || count === 0,
      },
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("[ADDRESS_POST]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
