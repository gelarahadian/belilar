import React from "react";
import { Product } from "@/context/product";
import Banner from "./components/Banner";
import ListProduct from "./components/ListProduct";
import Footer from "../components/Footer/Footer";

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
    return data;
  } catch (err: any) {
    console.log(err);
    throw new Error("Failed to fetch products");
  }
};

const page = async ({ searchParams }: { searchParams: { page: string } }) => {
  const { currentPage, totalProducts, totalPages, products } =
    await fetchProducts(searchParams.page);

  return (
    <main className="container w-full">
      <Banner />
      <ListProduct
        currentPage={currentPage}
        totalPages={totalPages}
        products={products}
      />
    </main>
  );
};

export default page;
