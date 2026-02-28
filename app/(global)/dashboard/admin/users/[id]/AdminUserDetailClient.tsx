"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiChevronLeft,
  HiBan,
  HiCheckCircle,
  HiShoppingBag,
  HiStar,
  HiHeart,
  HiLocationMarker,
} from "react-icons/hi";
import {
  useAdminUser,
  useUpdateAdminUser,
  useDeleteAdminUser,
} from "@/hooks/use-admin-user";

function formatAUD(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);
}
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export default function AdminUserDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading } = useAdminUser(id);
  const { mutate: update, isPending: isUpdating } = useUpdateAdminUser();
  const { mutate: remove, isPending: isDeleting } = useDeleteAdminUser();

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-semibold text-gray-500">User not found.</p>
        <Link
          href="/dashboard/admin/users"
          className="text-xs text-primary-600 mt-2 inline-block"
        >
          ← Back
        </Link>
      </div>
    );
  }

  const user = data.user;

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/admin/users"
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <HiChevronLeft className="text-sm" />
        </Link>
        <h1 className="text-xl font-black text-gray-900">User Detail</h1>
      </div>

      {/* Profile */}
      <Section title="Profile">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? ""}
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-black text-gray-400">
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">
              {user.name ?? "—"}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${user.role === "admin" ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-gray-100 text-gray-500"}`}
              >
                {user.role}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${user.banned ? "bg-red-50 text-red-600 border border-red-200" : "bg-primary-50 text-primary-700 border border-primary-200"}`}
              >
                {user.banned ? "Banned" : "Active"}
              </span>
              {user.emailVerified && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  Verified
                </span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-gray-400 flex-shrink-0">
            Joined {formatDate(user.createdAt)}
          </p>
        </div>
      </Section>

      {/* Activity stats */}
      <Section title="Activity">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: HiShoppingBag, label: "Orders", value: user._count.orders },
            { icon: HiStar, label: "Reviews", value: user._count.reviews },
            { icon: HiHeart, label: "Wishlist", value: user._count.likes },
            {
              icon: HiLocationMarker,
              label: "Addresses",
              value: user._count.addresses ?? 0,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center p-3 bg-gray-50 rounded-xl">
              <Icon className="text-gray-400 text-lg mx-auto mb-1" />
              <p className="text-lg font-black text-gray-900">{value}</p>
              <p className="text-[10px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Recent orders */}
      {user.orders && user.orders.length > 0 && (
        <Section title="Recent Orders">
          <div className="space-y-2">
            {user.orders.map((order) => (
              <div key={order.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900">
                    {formatAUD(order.amount_captured)}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg ${DELIVERY_BADGE[order.deliveryStatus] ?? "bg-gray-100 text-gray-500"}`}
                >
                  {order.deliveryStatus === "NotProcessed"
                    ? "Pending"
                    : order.deliveryStatus}
                </span>
                <Link
                  href={`/dashboard/admin/orders/${order.id}`}
                  className="text-[10px] font-semibold text-primary-600 hover:underline flex-shrink-0"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Actions */}
      <Section title="Account Actions">
        <div className="space-y-3">
          {/* Role */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-700">Role</p>
              <p className="text-[11px] text-gray-400">
                Change user access level
              </p>
            </div>
            <div className="flex gap-2">
              {(["user", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => update({ id: user.id, payload: { role: r } })}
                  disabled={isUpdating || user.role === r}
                  className={`h-8 px-3 text-xs font-bold rounded-xl border transition-all duration-150 disabled:cursor-not-allowed ${
                    user.role === r
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary-300 disabled:opacity-40"
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Ban */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-700">
                {user.banned ? "Unban User" : "Ban User"}
              </p>
              <p className="text-[11px] text-gray-400">
                {user.banned
                  ? "Restore access to this account"
                  : "Prevent user from signing in"}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                update({ id: user.id, payload: { banned: !user.banned } })
              }
              disabled={isUpdating}
              className={`flex items-center gap-1.5 h-8 px-3 text-xs font-bold rounded-xl border transition-all disabled:opacity-50 ${
                user.banned
                  ? "text-primary-600 border-primary-200 hover:bg-primary-50"
                  : "text-red-500 border-red-200 hover:bg-red-50"
              }`}
            >
              {user.banned ? (
                <>
                  <HiCheckCircle className="text-sm" /> Unban
                </>
              ) : (
                <>
                  <HiBan className="text-sm" /> Ban
                </>
              )}
            </button>
          </div>

          {/* Delete */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <p className="text-xs font-semibold text-red-600">
                Delete Account
              </p>
              <p className="text-[11px] text-gray-400">
                Permanently remove this user and all their data
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                remove(user.id, {
                  onSuccess: () => router.push("/dashboard/admin/users"),
                })
              }
              disabled={isDeleting}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-bold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}
