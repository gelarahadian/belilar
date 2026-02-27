"use client";

import { FC, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { Product } from "@/context/product";

interface ProductRatingProps {
  product: Product;
  /** compact = just show stars + average (for ProductCard) */
  compact?: boolean;
}

const ProductRating: FC<ProductRatingProps> = ({
  product,
  compact = false,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [ratings, setRatings] = useState<{ userId: string; value: number }[]>(
    (product.reviews as any[]) || [],
  );
  const [hovered, setHovered] = useState<number | null>(null);

  const userRating =
    ratings.find((r) => r.userId === session?.user?.id)?.value ?? 0;
  const average =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
      : 0;

  const handleRate = async (value: number) => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to rate this product.");
      router.push(`/sign-in?callbackUrl=${pathname}`);
      return;
    }

    // Optimistic update
    const prev = [...ratings];
    setRatings((current) => {
      const filtered = current.filter((r) => r.userId !== session!.user!.id);
      return [...filtered, { userId: session!.user!.id!, value }];
    });

    const res = await fetch(`${process.env.API}/user/product/rate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product.id, rating: value }),
    });

    if (!res.ok) {
      setRatings(prev); // revert
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Rating submitted!");
    }
  };

  // ── Compact mode: display only (for ProductCard) ─────────────────────────
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <IoStar className="text-secondary-400 text-xs flex-shrink-0" />
        <span className="text-xs font-semibold text-gray-700">
          {average > 0 ? average.toFixed(1) : "—"}
        </span>
        <span className="text-xs text-gray-400">({ratings.length})</span>
      </div>
    );
  }

  // ── Full mode: interactive stars (for product detail page) ───────────────
  return (
    <div className="space-y-2">
      {/* Average display */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <IoStar
              key={star}
              className={`text-base ${
                star <= Math.round(average)
                  ? "text-secondary-400"
                  : "text-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-gray-700">
          {average > 0 ? average.toFixed(1) : "No ratings yet"}
        </span>
        <span className="text-xs text-gray-400">
          ({ratings.length} reviews)
        </span>
      </div>

      {/* Interactive rating */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-1">Your rating:</span>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered ?? userRating);
          return (
            <button
              key={star}
              type="button"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              className="focus:outline-none transition-transform duration-100 hover:scale-110"
            >
              {filled ? (
                <IoStar className="text-xl text-secondary-400" />
              ) : (
                <IoStarOutline className="text-xl text-gray-300" />
              )}
            </button>
          );
        })}
        {userRating > 0 && (
          <span className="text-xs text-gray-400 ml-1">
            (You rated {userRating}★)
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductRating;
