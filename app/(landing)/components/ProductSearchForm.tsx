"use client";
import { useProduct } from "@/context/product";
import React, { FormEventHandler } from "react";
import { CiSearch } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";

const ProductSearchForm = () => {
  const {
    fetchProductSearchResults,
    setProductSearchQuery,
    productSearchQuery,
  } = useProduct();
  return (
    <form className="w-full" role="search" onSubmit={fetchProductSearchResults}>
      <div className="flex border rounded-sm p-2 focus-within:border-secondary">
        <input
          type="search"
          placeholder="Cari Produk"
          aria-label="search"
          className="outline-none w-full"
          onChange={(e) => {
            setProductSearchQuery(e.target.value);
          }}
          value={productSearchQuery}
        />
        <button className="px-4 py-2" type="submit">
          <IoSearchOutline />
        </button>
      </div>
    </form>
  );
};

export default ProductSearchForm;
