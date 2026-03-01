import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./components/DashboardClient";

export const metadata = { title: "Dashboard — Belilar" };

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard/user");
  }

  const userId = session.user.id;

  // ── Fetch all stats in parallel ───────────────────────────────────────────
  const [ordersData, wishlistCount, addressCount, reviewCount] =
    await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          items: {
            select: { title: true, image: true, price: true, quantity: true },
          },
        },
      }),
      prisma.like.count({ where: { userId } }),
      prisma.address.count({ where: { userId } }),
      prisma.review.count({ where: { userId } }),
    ]);

  const totalOrders = await prisma.order.count({ where: { userId } });

  return (
    <DashboardClient
      user={{
        name: session.user.name ?? "User",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }}
      stats={{
        totalOrders,
        wishlistCount,
        addressCount,
        reviewCount,
      }}
      recentOrders={JSON.parse(JSON.stringify(ordersData))}
    />
  );
}
