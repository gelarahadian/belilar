import React from "react";
import ProductCard from "./components/ProductCard";
import Pagination from "./components/Pagination";
import { Product } from "@/context/product";

const fetchProducts = async (
  page: string
): Promise<{
  currentPage: number;
  totalProducts: number;
  totalPages: number;
  products: Product[];
}> => {
  try {
    const res = await fetch(`${process.env.API}/product?page=${page}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.log("Fetching products Error: " + res);
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (err: any) {
    console.log(err);
    throw new Error("Failed to fetch products");
  }
};

const page = async ({ searchParams }: { searchParams: { page: string } }) => {
  console.log(searchParams);
  const { currentPage, totalProducts, totalPages, products } =
    await fetchProducts(searchParams.page);

  console.log("totalProducts====>", totalProducts);
  console.log("totalPages====>", totalPages);
  return (
    <main className="max-w-6xl mx-auto w-full p-3">
      <h1 className="text-2xl font-bold text-center mb-3">Product Unggul</h1>
      <ul className="flex flex-wrap gap-3">
        {products &&
          products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </ul>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </main>
  );
};

export default page;
