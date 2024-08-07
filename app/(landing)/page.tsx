import React from "react";
import ProductCard from "./components/ProductCard";

const fetchProducts = async () => {
  try {
    const res = await fetch(`${process.env.API}/product`);
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

const page = async () => {
  const { products } = await fetchProducts();
  return (
    <main className="max-w-6xl mx-auto w-full p-3">
      <h1 className="text-2xl font-bold text-center mb-3">Product Unggul</h1>
      <ul className="flex flex-wrap gap-3">
        {products &&
          products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </ul>
    </main>
  );
};

export default page;
