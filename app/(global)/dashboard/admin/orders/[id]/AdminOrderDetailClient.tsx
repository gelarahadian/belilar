"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HiChevronLeft,
  HiExternalLink,
  HiLocationMarker,
  HiReceiptRefund,
  HiShoppingBag,
  HiCheck,
} from "react-icons/hi";
import {
  useAdminOrder,
  useUpdateDeliveryStatus,
  useAdminRefundOrder,
} from "@/hooks/use-admin-order";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAUD(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const DELIVERY_STATUSES = [
  "NotProcessed",
  "Processing",
  "Dispatched",
  "Delivered",
  "Cancelled",
];

const DELIVERY_BADGE: Record<string, string> = {
  NotProcessed: "bg-gray-100 text-gray-500",
  Processing: "bg-blue-50 text-blue-600",
  Dispatched: "bg-orange-50 text-orange-600",
  Delivered: "bg-primary-50 text-primary-700",
  Refunded: "bg-gray-100 text-gray-500",
  Cancelled: "bg-red-50 text-red-500",
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminOrderDetailClient({ id }: { id: string }) {
  const { data, isLoading } = useAdminOrder(id);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateDeliveryStatus();
  const { mutate: refund, isPending: isRefunding } = useAdminRefundOrder();

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data?.order) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-semibold text-gray-500">Order not found.</p>
        <Link
          href="/dashboard/admin/orders"
          className="text-xs text-primary-600 mt-2 inline-block"
        >
          ← Back to orders
        </Link>
      </div>
    );
  }

  const order = data.order;
  const canRefund = order.status === "paid" && !order.refunded;

  return (
    <div className="max-w-2xl space-y-4">
      {/* ── Back + header ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/admin/orders"
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <HiChevronLeft className="text-sm" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">Order Detail</h1>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">
            {order.chargeId}
          </p>
        </div>
      </div>

      {/* ── Customer ──────────────────────────────────────────────────────── */}
      <Section title="Customer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
            {order.user?.image ? (
              <Image
                src={order.user.image}
                alt={order.user.name ?? ""}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                {order.user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {order.user?.name ?? "—"}
            </p>
            <p className="text-xs text-gray-400">{order.user?.email}</p>
          </div>
        </div>
      </Section>

      {/* ── Order summary ─────────────────────────────────────────────────── */}
      <Section title="Order Summary">
        <div className="space-y-3">
          {/* Items */}
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiShoppingBag className="text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400">
                  {formatAUD(item.price)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                {formatAUD(item.price * item.quantity)}
              </p>
            </div>
          ))}

          {/* Totals */}
          <div className="border-t border-gray-100 pt-3 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Total charged</span>
              <span className="font-black text-gray-900 text-sm">
                {formatAUD(order.amount_captured)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Currency</span>
              <span className="uppercase">{order.currency}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Date</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Shipping address ──────────────────────────────────────────────── */}
      <Section title="Shipping Address">
        <div className="flex items-start gap-2 text-sm text-gray-700">
          <HiLocationMarker className="text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5 text-xs text-gray-500">
            <p>
              {order.shipping.address.line1}
              {order.shipping.address.line2 &&
                `, ${order.shipping.address.line2}`}
            </p>
            <p>
              {order.shipping.address.city}, {order.shipping.address.state}{" "}
              {order.shipping.address.postal_code}
            </p>
            <p>{order.shipping.address.country}</p>
          </div>
        </div>
      </Section>

      {/* ── Status management ─────────────────────────────────────────────── */}
      <Section title="Status Management">
        <div className="space-y-4">
          {/* Current badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                order.status === "paid"
                  ? "bg-primary-50 text-primary-700 border-primary-200"
                  : order.status === "refunded"
                    ? "bg-gray-100 text-gray-500 border-gray-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${DELIVERY_BADGE[order.deliveryStatus]} border-current/20`}
            >
              {order.deliveryStatus === "NotProcessed"
                ? "Not Processed"
                : order.deliveryStatus}
            </span>
          </div>

          {/* Update delivery status */}
          {!order.refunded && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600">
                Update Delivery Status
              </p>
              <div className="flex flex-wrap gap-2">
                {DELIVERY_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      updateStatus({ id: order.id, deliveryStatus: s })
                    }
                    disabled={isUpdating || order.deliveryStatus === s}
                    className={`flex items-center gap-1 h-8 px-3 text-xs font-semibold rounded-xl border transition-all duration-150 disabled:cursor-not-allowed ${
                      order.deliveryStatus === s
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600 disabled:opacity-40"
                    }`}
                  >
                    {order.deliveryStatus === s && (
                      <HiCheck className="text-xs" />
                    )}
                    {s === "NotProcessed" ? "Not Processed" : s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Receipt + refund */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href={order.receipt_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <HiExternalLink className="text-sm" /> Receipt
            </Link>

            {canRefund && (
              <button
                type="button"
                onClick={() => refund(order.id)}
                disabled={isRefunding}
                className="flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isRefunding ? (
                  <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <HiReceiptRefund className="text-sm" />
                )}
                Refund Order
              </button>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
