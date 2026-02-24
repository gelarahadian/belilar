"use client";

import { FC, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { Product } from "@prisma/client";

interface ProductLikeProps {
  product: Product;
}

const ProductLike: FC<ProductLikeProps> = ({ product }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [likes, setLikes] = useState<string[]>([]);

  const isLiked = likes.includes(session?.user?.id ?? "");

  const handleLike = async () => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to like this product.");
      router.push(`/sign-in?callbackUrl=${pathname}`);
      return;
    }

    // Optimistic update
    const wasLiked = isLiked;
    setLikes((prev) =>
      wasLiked
        ? prev.filter((id) => id !== session?.user?.id)
        : [...prev, session!.user!.id!],
    );

    const res = await fetch(`${process.env.API}/user/product/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product.id }),
    });

    if (!res.ok) {
      // Revert on failure
      setLikes((prev) =>
        wasLiked
          ? [...prev, session!.user!.id!]
          : prev.filter((id) => id !== session?.user?.id),
      );
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      aria-label={isLiked ? "Unlike product" : "Like product"}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-150 ${
        isLiked
          ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
          : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {isLiked ? (
        <BiSolidLike className="text-base flex-shrink-0" />
      ) : (
        <BiLike className="text-base flex-shrink-0" />
      )}
      <span>
        {likes.length > 0
          ? `${likes.length} Like${likes.length > 1 ? "s" : ""}`
          : "Like"}
      </span>
    </button>
  );
};

export default ProductLike;
