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

dayjs.locale("id");
dayjs.extend(relativeTime);

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <li
      key={product.id}
      className="flex flex-col justify-between w-52 border-1 rounded bg-white"
    >
      <div className=" mb-2">
        <Link href={`/product/${product.slug}`}>
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
        </Link>
      </div>

      {/* <p>Rp{product.price}</p> */}
      <div className="px-2 mb-2 space-y-1">
        <Link href={`/product/${product.slug}`}>
          <h4 className="text-subtitle truncate">
            <strong>Rp.{product.price}</strong> {product.title}
          </h4>
        </Link>
        <del>
          <h4 className="text-subtitle text-red-500">
            Rp.{product.previousPrice}
          </h4>
        </del>
        <p className="text-sm text-gray-500 truncate">{product.description}</p>
        <section className="space-y-1">
          <div className="flex justify-between border-b">
            <p className="truncate text-secondaryText">
              Kategori: {product?.category?.name}
            </p>
            <p className="truncate text-secondaryText">
              Tag:{" "}
              {product.tags &&
                product.tags.map((tag) => (
                  <span key={tag.id}>{tag.name},</span>
                ))}
            </p>
          </div>
          <div className="flex justify-between items-center border-b ">
            <ProductLike product={product} />

            <p className="text-secondaryText truncate">
              {dayjs(product.createdAt).fromNow()}
            </p>
          </div>
          <div className="flex justify-between items-center border-b">
            <p>brand: Naiki</p>
            <ProductRating product={product} leaveRating={false} />
          </div>
        </section>
        <AddToCart product={product} />
      </div>
    </li>
  );
};

export default ProductCard;
