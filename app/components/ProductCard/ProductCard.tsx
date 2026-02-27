"use client";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { IoStar } from "react-icons/io5";
import { Product } from "@/context/product";
import { calculateAverageRating } from "@/lib/helpers";
import AddToCart from "./AddToCart";
import ProductLike from "./ProductLike";

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const imageUrl =
    (product?.images[0] as { secure_url?: string })?.secure_url ?? "";
  const rating = calculateAverageRating(product.reviews);

  return (
    <li className="group relative flex flex-col w-full sm:w-[188px] bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/10 transition-all duration-300 hover:-translate-y-1">
      {/* ── Image ──────────────────────────────────────────────────────────── */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative w-full h-48 overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            fill
            alt={product.title}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary-950/0 group-hover:bg-primary-950/5 transition-colors duration-300" />

          {/* Sold badge */}
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-0.5 text-[10px] font-bold text-gray-600 border border-gray-100 shadow-sm">
            1k+ Sold
          </div>
        </div>
      </Link>

      {/* ── Info ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3 space-y-1.5">
        <Link href={`/product/${product.slug}`}>
          <h4 className="text-sm text-gray-800 font-medium leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">
            {product.title}
          </h4>
        </Link>

        <p className="text-base font-black text-primary-700">
          {product.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>

        {/* Rating + Like row */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1">
            <IoStar className="text-secondary-400 text-xs flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-700">
              {rating}
            </span>
            <span className="text-xs text-gray-400">
              ({product.reviews?.length ?? 0})
            </span>
          </div>

          <ProductLike product={product as any} />
        </div>

        {/* Add to Cart — visible on hover */}
        <div className="opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pt-1">
          <AddToCart product={product} reviewAndCheckout={false} />
        </div>
      </div>
    </li>
  );
};

export default ProductCard;
