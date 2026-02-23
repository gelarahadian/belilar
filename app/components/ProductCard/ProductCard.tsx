"use client";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { IoStar } from "react-icons/io5";
import { Product } from "@/context/product";
import { calculateAverageRating } from "@/lib/helpers";

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const imageUrl =
    (product?.images[0] as { secure_url?: string })?.secure_url ?? "";
  const rating = calculateAverageRating(product.ratings);

  return (
    <li className="group relative flex flex-col w-full sm:w-[188px] bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
      <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            fill
            alt={product.title}
            className="object-cover"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />

          {/* Badge terjual */}
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur rounded-lg px-2 py-0.5 text-[10px] font-bold text-gray-600 border border-gray-100 shadow-sm">
            1rb+ Sold
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-3 space-y-1.5">
          <h4 className="text-sm text-gray-800 font-medium leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">
            {product.title}
          </h4>

          <p className="text-base font-black text-primary-700">
            ${product.price.toLocaleString("id-ID")}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 pt-0.5">
            <IoStar className="text-secondary-400 text-xs flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-700">
              {rating}
            </span>
            <span className="text-xs text-gray-400 ml-1">
              ({product.ratings?.length ?? 0})
            </span>
          </div>
        </div>
      </Link>

      {/* Add to cart bar — slides up on hover */}
      <div className="px-3 pb-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
        <button className="w-full bg-primary hover:bg-primary-700 text-white text-xs font-bold py-2 rounded-xl transition-colors duration-150">
          + Add to Cart
        </button>
      </div>
    </li>
  );
};

export default ProductCard;
