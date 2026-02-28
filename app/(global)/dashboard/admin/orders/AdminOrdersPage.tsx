"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiSearch,
  HiChevronLeft,
  HiChevronRight,
  HiEye,
  HiFilter,
} from "react-icons/hi";
import { useAdminOrders } from "@/hooks/use-admin-order";

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

const DELIVERY_BADGE: Record<string, string> = {
  NotProcessed: "bg-gray-100 text-gray-500",
  Processing: "bg-blue-50 text-blue-600",
  Dispatched: "bg-orange-50 text-orange-600",
  Delivered: "bg-primary-50 text-primary-700",
  Refunded: "bg-gray-100 text-gray-500",
  Cancelled: "bg-red-50 text-red-500",
};

const ORDER_STATUS_BADGE: Record<string, string> = {
  paid: "bg-primary-50 text-primary-700",
  pending: "bg-yellow-50 text-yellow-700",
  refunded: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-50 text-red-500",
  failed: "bg-red-50 text-red-500",
};

const DELIVERY_STATUSES = [
  "NotProcessed",
  "Processing",
  "Dispatched",
  "Delivered",
  "Cancelled",
  "Refunded",
];
const ORDER_STATUSES = ["paid", "pending", "refunded", "cancelled", "failed"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminOrders({
    page,
    search: query,
    status,
    deliveryStatus,
  });

  const orders = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.totalOrders ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  const handleFilter = (key: "status" | "deliveryStatus", val: string) => {
    if (key === "status") setStatus(val);
    if (key === "deliveryStatus") setDeliveryStatus(val);
    setPage(1);
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-black text-gray-900">Orders</h1>
        <p className="text-xs text-gray-400 mt-0.5">{total} orders total</p>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, charge ID..."
              className="w-64 h-9 pl-9 pr-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="h-9 px-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        {/* Order status filter */}
        <select
          value={status}
          onChange={(e) => handleFilter("status", e.target.value)}
          className="h-9 px-3 text-xs font-semibold border border-gray-200 rounded-xl bg-white outline-none focus:border-primary-400 text-gray-600"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {/* Delivery status filter */}
        <select
          value={deliveryStatus}
          onChange={(e) => handleFilter("deliveryStatus", e.target.value)}
          className="h-9 px-3 text-xs font-semibold border border-gray-200 rounded-xl bg-white outline-none focus:border-primary-400 text-gray-600"
        >
          <option value="">All Delivery</option>
          {DELIVERY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "NotProcessed" ? "Not Processed" : s}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {(query || status || deliveryStatus) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setQuery("");
              setStatus("");
              setDeliveryStatus("");
              setPage(1);
            }}
            className="h-9 px-3 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_60px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
          {["Customer", "Amount", "Status", "Delivery", "Date", ""].map((h) => (
            <p
              key={h}
              className="text-xs font-bold text-gray-500 uppercase tracking-wide"
            >
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_60px] gap-4 px-5 py-4"
              >
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {orders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_60px] gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors duration-150"
              >
                {/* Customer */}
                <div className="flex items-center gap-2.5 min-w-0">
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
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {order.user?.name ?? "—"}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {order.user?.email}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <p className="text-sm font-bold text-gray-900">
                  {formatAUD(order.amount_captured)}
                </p>

                {/* Order status */}
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg w-fit ${ORDER_STATUS_BADGE[order.status] ?? "bg-gray-100 text-gray-500"}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>

                {/* Delivery status */}
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg w-fit ${DELIVERY_BADGE[order.deliveryStatus] ?? "bg-gray-100 text-gray-500"}`}
                >
                  {order.deliveryStatus === "NotProcessed"
                    ? "Pending"
                    : order.deliveryStatus}
                </span>

                {/* Date */}
                <p className="text-xs text-gray-400">
                  {formatDate(order.createdAt)}
                </p>

                {/* Action */}
                <Link
                  href={`/dashboard/admin/orders/${order.id}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-all duration-150"
                >
                  <HiEye className="text-sm" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-gray-500">
              No orders found
            </p>
          </div>
        )}
      </div>

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="text-xs text-gray-400 px-1">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                      page === p
                        ? "bg-primary-600 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
