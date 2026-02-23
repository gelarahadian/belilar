"use client";

import { useProduct } from "@/context/product";
import { IoSearchOutline } from "react-icons/io5";

export default function ProductSearchForm() {
  const {
    fetchProductSearchResults,
    setProductSearchQuery,
    productSearchQuery,
  } = useProduct();

  return (
    <form
      className="w-full max-w-xl"
      role="search"
      onSubmit={fetchProductSearchResults}
    >
      <div className="flex items-center gap-2 h-10 bg-gray-50 border border-gray-200 rounded-xl px-3 focus-within:bg-white focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100 transition-all duration-200">
        <IoSearchOutline className="text-gray-400 text-lg flex-shrink-0" />
        <input
          type="search"
          placeholder="Search product, brand, or category..."
          aria-label="Search product"
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 min-w-0"
          value={productSearchQuery}
          onChange={(e) => setProductSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="flex-shrink-0 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors duration-150"
        >
          Search
        </button>
      </div>
    </form>
  );
}
