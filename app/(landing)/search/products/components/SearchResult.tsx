"use client";
import ProductCard from "@/app/(landing)/components/ProductCard";
import { useProduct } from "@/context/product";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const SearchResult = () => {
  const { setProductSearchQuery, productSearchResults } = useProduct();

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
    <div>
      product results {productSearchResults.length}
      {productSearchResults.map((product) => {
        return <ProductCard product={product} />;
      })}
    </div>
  );
};

export default SearchResult;
