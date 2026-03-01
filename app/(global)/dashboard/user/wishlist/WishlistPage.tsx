"use client";

import Image from "next/image";
import Link from "next/link";
import { HiHeart, HiTrash, HiShoppingCart, HiStar } from "react-icons/hi";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useAddToCart } from "@/hooks/use-cart";
import { WishlistItem } from "@/services/wishlist.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAUD(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);
}

function getAvgRating(ratings: { rating: number }[]) {
  if (!ratings.length) return null;
  return (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(
    1,
  );
}

// ─── WishlistCard ─────────────────────────────────────────────────────────────

function WishlistCard({ item }: { item: WishlistItem }) {
  const { mutate: remove, isPending: isRemoving } = useRemoveFromWishlist();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();

  const image = item.product.images[0]?.secure_url ?? "";
  const avg = getAvgRating(item.product.reviews);
  const discount =
    item.product.previousPrice &&
    item.product.previousPrice > item.product.price
      ? Math.round(
          ((item.product.previousPrice - item.product.price) /
            item.product.previousPrice) *
            100,
        )
      : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden group flex flex-col">
      {/* Image */}
      <Link
        href={`/product/${item.product.slug}`}
        className="relative block h-48 bg-gray-50 overflow-hidden flex-shrink-0"
      >
        {image ? (
          <Image
            src={image}
            alt={item.product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HiHeart className="text-4xl text-gray-200" />
          </div>
        )}
        {discount && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 bg-secondary-500 text-white rounded-lg">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            {item.product.category.name}
          </p>
          <Link
            href={`/product/${item.product.slug}`}
            className="text-sm font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug"
          >
            {item.product.title}
          </Link>

          {/* Rating */}
          {avg && (
            <div className="flex items-center gap-1">
              <HiStar className="text-yellow-400 text-xs" />
              <span className="text-xs text-gray-500">{avg}</span>
              <span className="text-xs text-gray-300">
                ({item.product.reviews.length})
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-black text-primary-700">
            {formatAUD(item.product.price)}
          </span>
          {item.product.previousPrice &&
            item.product.previousPrice > item.product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatAUD(item.product.previousPrice)}
              </span>
            )}
        </div>

        {/* Stock */}
        {item.product.stock !== null && (
          <p
            className={`text-[10px] font-semibold ${
              item.product.stock > 0 ? "text-primary-600" : "text-red-500"
            }`}
          >
            {item.product.stock > 0
              ? `${item.product.stock} in stock`
              : "Out of stock"}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() =>
              addToCart({ productId: item.product.id, quantity: 1 })
            }
            disabled={isAdding || item.product.stock === 0}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isAdding ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiShoppingCart className="text-sm" />
            )}
            Add to Cart
          </button>

          <button
            type="button"
            onClick={() => remove(item.productId)}
            disabled={isRemoving}
            className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-150 disabled:opacity-40"
            aria-label="Remove from wishlist"
          >
            {isRemoving ? (
              <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-red-400 rounded-full animate-spin" />
            ) : (
              <HiTrash className="text-sm" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const { data, isLoading } = useWishlist();
  const items = data?.likes ?? [];

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <HiHeart className="text-3xl text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-700">
          Your wishlist is empty
        </p>
        <p className="text-xs text-gray-400 mt-1 mb-6">
          Save items you love by tapping the heart icon
        </p>
        <Link
          href="/shop"
          className="h-9 px-4 leading-9 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors duration-150"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // ── Grid ───────────────────────────────────────────────────────────────────
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-black text-gray-900">My Wishlist</h1>
        <span className="text-xs text-gray-400">
          {items.length} item{items.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item: any) => (
          <WishlistCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
