"use client";
import { useProduct } from "@/context/product";
import React, { FormEventHandler } from "react";
import { CiSearch } from "react-icons/ci";

const ProductSearchForm = () => {
  const {
    fetchProductSearchResults,
    setProductSearchQuery,
    productSearchQuery,
  } = useProduct();
  return (
    <form role="search" onSubmit={fetchProductSearchResults}>
      <input
        type="search"
        placeholder="Cari Produk"
        aria-label="search"
        onChange={(e) => {
          setProductSearchQuery(e.target.value);
        }}
        value={productSearchQuery}
      />
      <button type="submit">
        <CiSearch />
      </button>
    </form>
  );
};

export default ProductSearchForm;
