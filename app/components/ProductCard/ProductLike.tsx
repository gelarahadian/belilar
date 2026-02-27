"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { wishlistKeys } from "@/hooks/wishlist.keys";

interface ProductLikeProps {
  product: {
    id: string;
    likes: { userId: string }[];
  };
}

export default function ProductLike({ product }: ProductLikeProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isLiked = product.likes.some((l) => l.userId === session?.user?.id);
  const [liked, setLiked] = useState(isLiked);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    if (!session?.user?.id) {
      router.push("/sign-in");
      return;
    }

    setIsPending(true);
    const prev = liked;
    setLiked((v) => !v); // optimistic

    try {
      const res = await fetch("/api/user/product/like", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLiked(prev); // revert
        toast.error(data.message ?? "Something went wrong.");
        return;
      }

      // Sync wishlist cache if open
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list() });

      toast.success(
        data.liked ? "Added to wishlist!" : "Removed from wishlist.",
      );
    } catch {
      setLiked(prev); // revert
      toast.error("Something went wrong.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
        liked
          ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
          : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-100"
      }`}
    >
      {liked ? (
        <BiSolidLike className="text-sm text-red-500" />
      ) : (
        <BiLike className="text-sm" />
      )}
    </button>
  );
}
