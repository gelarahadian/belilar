"use client";
import { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Span } from "next/dist/trace";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { BiLike, BiSolidLike } from "react-icons/bi";

interface ProductLikeProps {
  product: Product;
}

const ProductLike: FC<ProductLikeProps> = ({ product }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [likes, setLikes] = useState(product.likes || []);

  const handleLike = async () => {
    if (status === "unauthenticated") {
      toast.error("Silahkan Login Terlebih dahulu");
      router.push(`/login?callbackUrl=${pathname}`);
      return;
    }
    const res = await fetch(`${process.env.API}/user/product/like`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: product.id }),
    });
    console.log(await res.json());
    window.location.reload();
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center truncate text-secondaryText cursor-pointer"
    >
      {likes.includes(session?.user?.id || "") ? (
        <BiSolidLike className="mr-[2px] text-red-500" />
      ) : (
        <BiLike className="mr-[2px]" />
      )}
      {likes.length > 0 ? <span>{likes.length} like</span> : <span>like</span>}
    </button>
  );
};

export default ProductLike;
