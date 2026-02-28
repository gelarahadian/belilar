"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HiCurrencyDollar,
  HiShoppingBag,
  HiUsers,
  HiCube,
  HiArrowUp,
  HiArrowDown,
  HiExclamation,
  HiArrowRight,
} from "react-icons/hi";
import { useAdminStats } from "@/hooks/use-admin-stats";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAUD(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const DELIVERY_BADGE: Record<string, string> = {
  NotProcessed: "bg-gray-100 text-gray-500",
  Processing: "bg-blue-50 text-blue-600",
  Dispatched: "bg-orange-50 text-orange-600",
  Delivered: "bg-primary-50 text-primary-700",
  Refunded: "bg-gray-100 text-gray-500",
  Cancelled: "bg-red-50 text-red-500",
};

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  growth,
  warning,
  iconColor,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  growth?: number | null;
  warning?: boolean;
  iconColor: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 hover:border-gray-200 hover:shadow-sm transition-all duration-150 group"
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}
        >
          <Icon className="text-lg" />
        </div>
        {growth != null ? (
          <span
            className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${
              growth >= 0
                ? "bg-primary-50 text-primary-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {growth >= 0 ? (
              <HiArrowUp className="text-xs" />
            ) : (
              <HiArrowDown className="text-xs" />
            )}
            {Math.abs(growth)}%
          </span>
        ) : warning ? (
          <span className="flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg bg-red-50 text-red-600">
            <HiExclamation className="text-xs" /> Low stock
          </span>
        ) : null}
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        <p className="text-xs text-gray-500 mt-2 font-medium">{sub}</p>
      </div>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="h-8 w-40 bg-gray-100 rounded-xl animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboardClient() {
  const { data, isLoading } = useAdminStats();

  if (isLoading || !data) return <Skeleton />;

  const { stats, recentOrders, topProducts } = {
    stats: {
      revenue: data.revenue,
      orders: data.orders,
      users: data.users,
      products: data.products,
    },
    recentOrders: data.recentOrders,
    topProducts: data.topProducts,
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Title ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-black text-gray-900">Dashboard</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Overview of your store performance
        </p>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={HiCurrencyDollar}
          label="Total Revenue"
          value={formatAUD(stats.revenue.total)}
          sub={`${formatAUD(stats.revenue.thisMonth)} this month`}
          growth={stats.revenue.growth}
          iconColor="bg-primary-50 text-primary-600"
          href="/dashboard/admin/orders"
        />
        <StatCard
          icon={HiShoppingBag}
          label="Total Orders"
          value={stats.orders.total.toLocaleString()}
          sub={`${stats.orders.thisMonth} this month`}
          growth={stats.orders.growth}
          iconColor="bg-blue-50 text-blue-600"
          href="/dashboard/admin/orders"
        />
        <StatCard
          icon={HiUsers}
          label="Total Users"
          value={stats.users.total.toLocaleString()}
          sub={`+${stats.users.thisMonth} this month`}
          iconColor="bg-secondary-50 text-secondary-600"
          href="/dashboard/admin/users"
        />
        <StatCard
          icon={HiCube}
          label="Total Products"
          value={stats.products.total.toLocaleString()}
          sub={`${stats.products.lowStock} low stock`}
          warning={stats.products.lowStock > 0}
          iconColor="bg-yellow-50 text-yellow-600"
          href="/dashboard/admin/products"
        />
      </div>

      {/* ── Bottom grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent orders */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
            <Link
              href="/dashboard/admin/orders"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all <HiArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    {order.user?.image ? (
                      <Image
                        src={order.user.image}
                        alt={order.user.name ?? ""}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {order.user?.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {order.user?.name ?? "Unknown"}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm font-black text-gray-900 flex-shrink-0">
                    {formatAUD(order.amount_captured)}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${DELIVERY_BADGE[order.deliveryStatus] ?? "bg-gray-100 text-gray-500"}`}
                  >
                    {order.deliveryStatus === "NotProcessed"
                      ? "Pending"
                      : order.deliveryStatus}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No orders yet
              </div>
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Top Products</h2>
            <Link
              href="/dashboard/admin/products"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all <HiArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {topProducts.length > 0 ? (
              topProducts.map((item, i) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <span className="text-xs font-black text-gray-300 w-4 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiCube className="text-gray-300 text-sm" />
                      </div>
                    )}
                  </div>
                  <p className="flex-1 text-xs font-semibold text-gray-800 truncate">
                    {item.title}
                  </p>
                  <span className="text-xs font-black text-gray-500 flex-shrink-0">
                    {item._sum.quantity} sold
                  </span>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No data yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
