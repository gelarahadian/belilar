"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HiShoppingBag,
  HiReceiptRefund,
  HiExternalLink,
  HiLocationMarker,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiTruck,
  HiBan,
} from "react-icons/hi";
import { useListOrders, useRefundOrder } from "@/hooks/use-order";
import { Order, DeliveryStatus, OrderStatus } from "@/services/order.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Status badges ────────────────────────────────────────────────────────────

const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  paid: "bg-primary-50 text-primary-700 border-primary-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  refunded: "bg-gray-100 text-gray-500 border-gray-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  failed: "bg-red-50 text-red-600 border-red-200",
};

const DELIVERY_STATUS_STYLE: Record<DeliveryStatus, string> = {
  NotProcessed: "bg-gray-50 text-gray-500 border-gray-200",
  Processing: "bg-blue-50 text-blue-600 border-blue-200",
  Dispatched: "bg-secondary-50 text-secondary-600 border-secondary-200",
  Delivered: "bg-primary-50 text-primary-700 border-primary-200",
  Refunded: "bg-gray-100 text-gray-500 border-gray-200",
  Cancelled: "bg-red-50 text-red-600 border-red-200",
};

const DELIVERY_ICON: Record<DeliveryStatus, React.ReactNode> = {
  NotProcessed: <HiClock className="text-sm" />,
  Processing: <HiClock className="text-sm" />,
  Dispatched: <HiTruck className="text-sm" />,
  Delivered: <HiCheckCircle className="text-sm" />,
  Refunded: <HiReceiptRefund className="text-sm" />,
  Cancelled: <HiXCircle className="text-sm" />,
};

// ─── OrderCard ────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const { mutate: refund, isPending } = useRefundOrder();

  const canRefund = order.deliveryStatus === "NotProcessed" && !order.refunded;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Order status */}
          <span
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${ORDER_STATUS_STYLE[order.status]}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>

          {/* Delivery status */}
          <span
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${DELIVERY_STATUS_STYLE[order.deliveryStatus]}`}
          >
            {DELIVERY_ICON[order.deliveryStatus]}
            {order.deliveryStatus === "NotProcessed"
              ? "Not Processed"
              : order.deliveryStatus}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{formatDate(order.createdAt)}</span>
          <span className="text-gray-200">|</span>
          <span className="font-mono text-[11px] truncate max-w-[120px]">
            {order.chargeId}
          </span>
        </div>
      </div>

      {/* ── Items ───────────────────────────────────────────────────────────── */}
      <div className="px-5 py-4 space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {/* Image */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <HiShoppingBag className="text-gray-300 text-xl" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                {item.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatAUD(item.price)} × {item.quantity}
              </p>
            </div>

            <p className="text-sm font-bold text-gray-900 flex-shrink-0">
              {formatAUD(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-t border-gray-100 space-y-3">
        {/* Shipping address */}
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <HiLocationMarker className="text-gray-400 mt-0.5 flex-shrink-0" />
          <span>
            {order.shipping.address.line1}
            {order.shipping.address.line2 &&
              `, ${order.shipping.address.line2}`}
            ,&nbsp;
            {order.shipping.address.city}, {order.shipping.address.state}&nbsp;
            {order.shipping.address.postal_code},{" "}
            {order.shipping.address.country}
          </span>
        </div>

        {/* Total + actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Total charged</p>
            <p className="text-base font-black text-gray-900">
              {formatAUD(order.amount_captured)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Receipt */}
            <Link
              href={order.receipt_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-150"
            >
              <HiExternalLink className="text-sm" />
              Receipt
            </Link>

            {/* Refund */}
            {canRefund && (
              <button
                type="button"
                onClick={() => refund(order.id)}
                disabled={isPending}
                className="flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-red-500 hover:text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <HiBan className="text-sm" />
                )}
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserOrders() {
  const { data, isLoading } = useListOrders();
  const orders = data?.orders ?? [];

  console.log(isLoading)
  console.log(orders)
  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <HiShoppingBag className="text-3xl text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-700">No orders yet</p>
        <p className="text-xs text-gray-400 mt-1 mb-6">
          Your order history will appear here
        </p>
        <Link
          href="/"
          className="h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors duration-150"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // ── Orders ─────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-black text-gray-900">My Orders</h1>
        <span className="text-xs text-gray-400">
          {orders.length} order{orders.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </main>
  );
}
