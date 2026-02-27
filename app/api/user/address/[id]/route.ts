import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── Helper — verify ownership ────────────────────────────────────────────────

async function getOwnedAddress(addressId: string, userId: string) {
  return prisma.address.findFirst({
    where: { id: addressId, userId },
  });
}

// ─── PATCH /api/user/address/[id] — edit ──────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const existing = await getOwnedAddress(params.id, session.user.id);
    if (!existing) {
      return NextResponse.json(
        { message: "Address not found." },
        { status: 404 },
      );
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

    // If setting as default, unset all others
    if (isDefault && !existing.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, id: { not: params.id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: params.id },
      data: {
        label,
        recipient,
        phone: phone || null,
        line1,
        line2: line2 || null,
        city,
        state,
        postal_code,
        country,
        isDefault: isDefault ?? existing.isDefault,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ address }, { status: 200 });
  } catch (error) {
    console.error("[ADDRESS_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/user/address/[id] ───────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const existing = await getOwnedAddress(params.id, session.user.id);
    if (!existing) {
      return NextResponse.json(
        { message: "Address not found." },
        { status: 404 },
      );
    }

    await prisma.address.delete({ where: { id: params.id } });

    // If deleted address was default, auto-assign next address as default
    if (existing.isDefault) {
      const next = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
      if (next) {
        await prisma.address.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ message: "Address deleted." }, { status: 200 });
  } catch (error) {
    console.error("[ADDRESS_DELETE]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── PUT /api/user/address/[id] — set as default ─────────────────────────────

export async function PUT(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const existing = await getOwnedAddress(params.id, session.user.id);
    if (!existing) {
      return NextResponse.json(
        { message: "Address not found." },
        { status: 404 },
      );
    }

    // Unset all, then set this one
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: params.id },
        data: { isDefault: true },
      }),
    ]);

    return NextResponse.json(
      { message: "Default address updated." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[ADDRESS_SET_DEFAULT]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
