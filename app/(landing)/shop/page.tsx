import React from "react";
import ProductFilter from "../components/ProductFilter";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

export const dynamic = "force-dynamic";

const fetchProducts = async (searchParams: {
  [key: string]: string | undefined;
}) => {
  const searchQuery = new URLSearchParams({
    page: String(searchParams.page || 1),
    minPrice: searchParams.minPrice || "",
    maxPrice: searchParams.maxPrice || "",
    ratings: searchParams.ratings || "",
    category: searchParams.category || "",
    tag: searchParams.tag || "",
    brand: searchParams.brand || "",
    search: searchParams.search || "",
  }).toString();

  try {
    const response = await fetch(
      `${process.env.API}/product/filters?${searchQuery}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.products)) {
      throw new Error("No product returned");
    }
    return data;
  } catch (err) {
    console.log(err);
    return { products: [], currenctPage: 1, totalPages: 1 };
  }
};

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { currentPage, totalProducts, totalPages, products } =
    await fetchProducts(searchParams);

  return (
    <main className="max-w-6xl mx-auto w-full p-3">
      <ProductFilter searchParams={searchParams} />
      <div className="flex justify-center flex-wrap w-full gap-3 mx-auto">
        {products.map((product) => {
          return <ProductCard product={product} />;
        })}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />

      <div>
        <pre>
          {JSON.stringify(
            { currentPage, totalProducts, totalPages, products },
            null,
            3
          )}
        </pre>
      </div>

      {/* <Pagination/> */}
    </main>
  );
};

export default page;
