"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HiShoppingBag,
  HiHeart,
  HiLocationMarker,
  HiStar,
  HiArrowRight,
  HiReceiptRefund,
  HiTruck,
  HiClock,
  HiCheckCircle,
} from "react-icons/hi";
import { Order, DeliveryStatus, OrderStatus } from "@/services/order.service";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  stats: {
    totalOrders: number;
    wishlistCount: number;
    addressCount: number;
    reviewCount: number;
  };
  recentOrders: Order[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAUD(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const DELIVERY_ICON: Record<DeliveryStatus, React.ReactNode> = {
  NotProcessed: <HiClock className="text-gray-400" />,
  Processing: <HiClock className="text-blue-400" />,
  Dispatched: <HiTruck className="text-secondary-500" />,
  Delivered: <HiCheckCircle className="text-primary-500" />,
  Refunded: <HiReceiptRefund className="text-gray-400" />,
  Cancelled: <HiReceiptRefund className="text-red-400" />,
};

const DELIVERY_COLOR: Record<DeliveryStatus, string> = {
  NotProcessed: "text-gray-500 bg-gray-50 border-gray-200",
  Processing: "text-blue-600 bg-blue-50 border-blue-200",
  Dispatched: "text-secondary-600 bg-secondary-50 border-secondary-200",
  Delivered: "text-primary-700 bg-primary-50 border-primary-200",
  Refunded: "text-gray-500 bg-gray-100 border-gray-200",
  Cancelled: "text-red-500 bg-red-50 border-red-200",
};

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all duration-150 group"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <Icon className="text-xl" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
      </div>
      <HiArrowRight className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0" />
    </Link>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardClient({ user, stats, recentOrders }: Props) {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-6">
      {/* ── Greeting ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-600 text-white text-xl font-black">
              {user.name[0].toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">{greeting()},</p>
          <h1 className="text-xl font-black text-gray-900">{user.name} 👋</h1>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
      </div>

      {/* ── Stats grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={HiShoppingBag}
          label="Total Orders"
          value={stats.totalOrders}
          href="/dashboard/user/orders"
          color="bg-primary-50 text-primary-600"
        />
        <StatCard
          icon={HiHeart}
          label="Wishlist Items"
          value={stats.wishlistCount}
          href="/dashboard/user/wishlist"
          color="bg-red-50 text-red-500"
        />
        <StatCard
          icon={HiLocationMarker}
          label="Saved Addresses"
          value={stats.addressCount}
          href="/dashboard/user/addresses"
          color="bg-secondary-50 text-secondary-600"
        />
        <StatCard
          icon={HiStar}
          label="Reviews Given"
          value={stats.reviewCount}
          href="/dashboard/user/reviews"
          color="bg-yellow-50 text-yellow-500"
        />
      </div>

      {/* ── Recent orders ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/dashboard/user/orders"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View all <HiArrowRight className="text-xs" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3"
              >
                {/* Item thumbnails */}
                <div className="flex -space-x-2 flex-shrink-0">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border-2 border-white flex-shrink-0"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiShoppingBag className="text-gray-300 text-sm" />
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-xl bg-gray-100 border-2 border-white flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-gray-500">
                        +{order.items.length - 3}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800">
                    {formatAUD(order.amount_captured)}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Delivery status */}
                <span
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border flex-shrink-0 ${DELIVERY_COLOR[order.deliveryStatus]}`}
                >
                  {DELIVERY_ICON[order.deliveryStatus]}
                  {order.deliveryStatus === "NotProcessed"
                    ? "Pending"
                    : order.deliveryStatus}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <HiShoppingBag className="text-3xl text-gray-200 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">No orders yet</p>
            <Link
              href="/shop"
              className="text-xs text-primary-600 hover:underline mt-1 inline-block"
            >
              Start shopping →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
