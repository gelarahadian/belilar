"use client";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import ProductLike from "./ProductLike";
import ProductRating from "./ProductRating";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import AddToCart from "./AddToCart";
import { Product } from "@/context/product";
import { calculateAverageRating } from "@/lib/helpers";
import { IoStar } from "react-icons/io5";

dayjs.locale("id");
dayjs.extend(relativeTime);

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <li
      key={product.id}
      className="flex flex-col justify-between w-full sm:w-52 border-1 rounded bg-white border"
    >
      <Link href={`/product/${product.slug}`}>
        <div className=" mb-2">
          <div className="w-full h-48 rounded overflow-hidden relative">
            <Image
              src={
                (product?.images[0] as { secure_url?: string })?.secure_url ??
                ""
              }
              fill
              alt={product.title}
              className="object-cover"
            />
          </div>
        </div>

        <div className="px-3 mb-2 space-y-1">
          <h4 className="text-sm truncate">{product.title}</h4>
          <p className="text-sm font-bold">
            Rp{product.price.toLocaleString("id-ID")}
          </p>

          <section className="space-y-1">
            <div className="flex justify-between items-center">
              <p className="text-sm flex items-center">
                <IoStar className="mr-1 text-orange-400" />
                {calculateAverageRating(product.ratings)}
              </p>
              <p className="text-xs">1rb+ Terjual</p>
            </div>
          </section>
        </div>
      </Link>
    </li>
  );
};

export default ProductCard;
