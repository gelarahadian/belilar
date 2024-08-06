"use client";
import { useProduct } from "@/context/product";
import React, { useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import { useSearchParams } from "next/navigation";

const SearchProuctPage = () => {
  const {
    setProductSearchQuery,
    setProductSearchResults,
    productSearchResults,
  } = useProduct();

  const productSearchParams = useSearchParams();
  const query = productSearchParams.get("productSearchQuery");

  useEffect(() => {
    if (query) {
      setProductSearchQuery(query);
      fetchProductResultsOnLoad();
    }
  }, [query]);

  const fetchProductResultsOnLoad = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/search/products?productSearchQuery=${query}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      console.log("search results data => ", data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="max-w-6xl mx-auto w-full p-3">
      <div className="flex justify-center flex-wrap w-full gap-3 mx-auto">
        product results {productSearchResults.length}
        {productSearchResults.map((product) => {
          return <ProductCard product={product} />;
        })}
      </div>
    </main>
  );
};

export default SearchProuctPage;
