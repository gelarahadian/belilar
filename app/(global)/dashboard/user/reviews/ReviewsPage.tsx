"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiStar, HiPencil, HiCheckCircle } from "react-icons/hi";
import { useReviews, useSubmitReview } from "@/hooks/use-review";
import { Review, ReviewableItem } from "@/services/review.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── StarRating ───────────────────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
  readonly,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`text-xl transition-colors duration-100 ${
            readonly ? "cursor-default" : "cursor-pointer"
          } ${star <= (hover || value) ? "text-yellow-400" : "text-gray-200"}`}
        >
          <HiStar />
        </button>
      ))}
    </div>
  );
}

// ─── ReviewableCard ───────────────────────────────────────────────────────────

function ReviewableCard({ item }: { item: ReviewableItem }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { mutate: submit, isPending } = useSubmitReview();

  const handleSubmit = () => {
    if (!rating) return;
    submit(
      { productId: item.productId, rating, comment },
      {
        onSuccess: () => {
          setOpen(false);
          setRating(0);
          setComment("");
        },
      },
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Product row */}
      <div className="flex items-center gap-3 p-4">
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
              <HiStar className="text-gray-200 text-xl" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 line-clamp-1">
            {item.title}
          </p>
          <p className="text-xs text-secondary-500 font-semibold mt-0.5">
            Awaiting your review
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 h-8 px-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors duration-150 flex-shrink-0"
        >
          <HiPencil className="text-xs" />
          Review
        </button>
      </div>

      {/* Review form */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-600">Your Rating</p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">
              Comment{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 resize-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-9 px-4 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || rating === 0}
              className="flex items-center gap-1.5 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <HiCheckCircle className="text-sm" />
              )}
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ReviewCard ───────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3">
      {/* Product image */}
      <Link
        href={`/product/${review.product.slug}`}
        className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0"
      >
        {review.product.images[0] ? (
          <Image
            src={review.product.images[0].secure_url}
            alt={review.product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HiStar className="text-gray-200 text-xl" />
          </div>
        )}
      </Link>

      {/* Review info */}
      <div className="flex-1 min-w-0 space-y-1">
        <Link
          href={`/product/${review.product.slug}`}
          className="text-sm font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1"
        >
          {review.product.title}
        </Link>
        <p className="text-xs text-gray-400">{review.product.brand}</p>
        <StarRating value={review.rating} readonly />
        {review.comment && (
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
            "{review.comment}"
          </p>
        )}
        <p className="text-[10px] text-gray-400">
          {formatDate(review.createdAt)}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewsPage() {
  const { data, isLoading } = useReviews();
  const reviews = data?.reviews ?? [];
  const reviewable = data?.reviewable ?? [];

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-2 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-2 space-y-6">
      <h1 className="text-xl font-black text-gray-900">My Reviews</h1>

      {/* ── Pending reviews ───────────────────────────────────────────────── */}
      {reviewable.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-secondary-500" />
            <h2 className="text-sm font-bold text-gray-900">Awaiting Review</h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-secondary-50 text-secondary-600 border border-secondary-200 rounded-lg">
              {reviewable.length}
            </span>
          </div>
          <div className="space-y-2">
            {reviewable.map((item) => (
              <ReviewableCard key={item.productId} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* ── Written reviews ───────────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-primary-500" />
            <h2 className="text-sm font-bold text-gray-900">Reviews Written</h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-primary-50 text-primary-600 border border-primary-200 rounded-lg">
              {reviews.length}
            </span>
          </div>
          <div className="space-y-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {reviews.length === 0 && reviewable.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <HiStar className="text-3xl text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No reviews yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-5">
            Reviews will appear here after your orders are delivered
          </p>
          <Link
            href="/shop"
            className="h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors duration-150"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}
