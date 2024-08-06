import Image from "next/image";
import React from "react";
import ProductImage from "./components/ProductImage";
import ProductRating from "../../components/ProductRating";
import UserReviews from "../../components/UserReviews";
import CouponCode from "../../components/CouponCode";
import AddToCart from "../../components/AddToCart";

export async function generateMetadata({ params }) {
  const data = await fetchProduct(params?.slug);
  const { product } = data;

  return {
    title: product?.title,
    description: product?.description.substring(0, 160),
    openGraph: {
      image: product?.images[0]?.secure_url,
    },
  };
}

const fetchProduct = async (slug: string) => {
  const res = await fetch(`${process.env.API}/product/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Fetching product failed");
    return;
  }

  const data = await res.json();
  return data;
};

const page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const data = await fetchProduct(slug);
  const { product } = data;
  return (
    <main className="max-w-6xl mx-auto p-3 ">
      <article className="flex gap-6">
        <section className="flex-1">
          <ProductImage product={product} />
        </section>
        <section className="flex-1">
          <h1 className="text-title">{product.title}</h1>
          <CouponCode product={product} />
          <ProductRating product={product} />
          <h3 className=""> Kategori: {product.category.name}</h3>
          <h3>
            Tag:{" "}
            {product.tags.length > 0
              ? product.tags.map((tag: any) => <span>{tag.name},</span>)
              : ""}
          </h3>

          <p>{product.description}</p>
          <p className="p-3 w-full bg-blue-200 mb-3 my-3">
            {" "}
            brand: {product.brand}
          </p>
          <AddToCart product={product} />
        </section>
      </article>
      <article>
        <UserReviews reviews={product.ratings} />
      </article>
      <article>
        <h2>Produk Serupa</h2>
      </article>
    </main>
  );
};

export default page;
