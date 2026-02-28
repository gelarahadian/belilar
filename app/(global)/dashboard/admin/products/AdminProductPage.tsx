"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiPlus,
  HiSearch,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
  HiPhotograph,
} from "react-icons/hi";
import { useAdminProducts, useDeleteProduct } from "@/hooks/use-admin-product";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAUD(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data, isLoading } = useAdminProducts({ page, search: query });
  const { mutate: remove, isPending: isDeleting } = useDeleteProduct();

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.totalProducts ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Products</h1>
          <p className="text-xs text-gray-400 mt-0.5">{total} products total</p>
        </div>
        <Link
          href="/dashboard/admin/products/new"
          className="flex items-center gap-1.5 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors duration-150"
        >
          <HiPlus className="text-base" />
          Add Product
        </Link>
      </div>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or brand..."
            className="w-full h-10 pl-9 pr-3.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          className="h-10 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-colors duration-150"
        >
          Search
        </button>
        {query && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setQuery("");
              setPage(1);
            }}
            className="h-10 px-4 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-150"
          >
            Clear
          </button>
        )}
      </form>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
          {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
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
                className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-4"
              >
                {[1, 2, 3, 4, 5].map((j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors duration-150"
              >
                {/* Product */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0].secure_url}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiPhotograph className="text-gray-300 text-base" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {product.brand}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg w-fit">
                  {product.category.name}
                </span>

                {/* Price */}
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {formatAUD(product.price)}
                  </p>
                  {product.previousPrice && (
                    <p className="text-xs text-gray-400 line-through">
                      {formatAUD(product.previousPrice)}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <span
                  className={`text-xs font-bold ${
                    product.stock === null
                      ? "text-gray-400"
                      : product.stock === 0
                        ? "text-red-500"
                        : product.stock <= 5
                          ? "text-secondary-600"
                          : "text-primary-600"
                  }`}
                >
                  {product.stock === null
                    ? "—"
                    : product.stock === 0
                      ? "Out of stock"
                      : `${product.stock} left`}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/dashboard/admin/products/${product.id}/edit`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-all duration-150"
                  >
                    <HiPencil className="text-sm" />
                  </Link>

                  {confirmId === product.id ? (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          remove(product.id);
                          setConfirmId(null);
                        }}
                        disabled={isDeleting}
                        className="h-8 px-2 text-[10px] font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="h-8 px-2 text-[10px] font-bold border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(product.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-150"
                    >
                      <HiTrash className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-gray-500">
              No products found
            </p>
            {query && (
              <p className="text-xs text-gray-400 mt-1">
                No results for "{query}"
              </p>
            )}
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
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
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
                  <span
                    key={`ellipsis-${i}`}
                    className="text-xs text-gray-400 px-1"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-colors duration-150 ${
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
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <HiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
