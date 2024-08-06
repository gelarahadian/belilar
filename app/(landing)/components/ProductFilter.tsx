"use client";
import { useCategory } from "@/context/category";
import { useProduct } from "@/context/product";
import { useTag } from "@/context/tag";
import { priceRanges } from "@/lib/filterData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useEffect } from "react";
import { Rating } from "react-simple-star-rating";

interface ProductFilterProps {
  searchParams: { [key: string]: string | undefined };
}

const ProductFilter: FC<ProductFilterProps> = ({ searchParams }) => {
  const pathname = "/shop/";
  const { minPrice, maxPrice, ratings, category, tag, brand } = searchParams;
  const router = useRouter();
  const { fetchCategoriesPublic, categories } = useCategory();
  const { fetchTagsPublic, tags } = useTag();
  const { fetchBrands, brands } = useProduct();

  useEffect(() => {
    fetchCategoriesPublic();
    fetchTagsPublic();
    fetchBrands();
  }, []);

  const handleRemoveFilter = (filterName: string | string[]) => {
    const updatedSearchParams = Object.fromEntries(
      Object.entries(searchParams).filter(([key, value]) => value !== undefined)
    );

    if (typeof filterName === "string") {
      delete updatedSearchParams[filterName];
    } else if (Array.isArray(filterName)) {
      filterName.forEach((name) => {
        delete updatedSearchParams[name];
      });
    }

    updatedSearchParams.page = "1";

    const queryString = new URLSearchParams(
      updatedSearchParams as Record<string, string>
    ).toString();
    const newUrl = `${pathname}?${queryString}`;
    router.push(newUrl);
  };
  return (
    <div className="fixed left-0 w-72 p-3 h-[90vh] overflow-y-scroll slim-scroll">
      <h1 className="text-2xl font-bold mb-3">Filter Product</h1>
      <Link href={"/shop"}>
        <p className="mb-3 text-body text-red-500">Reset Filter</p>
      </Link>
      <h2 className="p-3 w-full bg-blue-200 mb-3">Harga</h2>
      <div className="flex w-full flex-wrap gap-3">
        {priceRanges.map((priceRange) => {
          const url = {
            pathname,
            query: {
              ...searchParams,
              minPrice: priceRange?.min,
              maxPrice: priceRange?.max,
              page: 1,
            },
          };

          const isActive =
            minPrice === String(priceRange.min) &&
            maxPrice === String(priceRange.max);
          return (
            <>
              <Link
                key={priceRange.label}
                href={url}
                className={`flex justify-center items-center p-3 ${
                  isActive ? "bg-secondary text-primary" : "bg-primary"
                }   rounded text-body shadow-md `}
              >
                {priceRange.label}
              </Link>
              {isActive && (
                <button
                  onClick={() => handleRemoveFilter(["minPrice", "maxPrice"])}
                >
                  X
                </button>
              )}
            </>
          );
        })}
      </div>

      <h2 className="p-3 w-full bg-blue-200 my-3">Ulasan</h2>
      <div className="flex w-full flex-wrap gap-3">
        {[5, 4, 3, 2, 1].map((ratingValue) => {
          const isActive = String(ratings) === String(ratingValue);
          const url = {
            pathname,
            query: {
              ...searchParams,
              ratings: ratingValue,
              page: 1,
            },
          };

          return (
            <>
              <Link
                key={ratingValue}
                href={url}
                className={`flex justify-center items-center p-3 rounded ${
                  isActive ? "bg-secondary" : "bg-primary "
                } text-body shadow-md`}
              >
                <Rating
                  initialValue={ratingValue}
                  size={16}
                  SVGclassName="inline-block"
                  readonly
                />
              </Link>
              {isActive && (
                <button onClick={() => handleRemoveFilter("ratings")}>X</button>
              )}
            </>
          );
        })}
      </div>

      <h2 className="p-3 w-full bg-blue-200 my-3">Kategori</h2>
      <div className="flex w-full flex-wrap gap-3 max-h-52 overflow-y-scroll slim-scroll">
        {categories.map((c) => {
          const isActive = category === c.id;
          const url = {
            pathname,
            query: {
              ...searchParams,
              category: c.id,
              page: 1,
            },
          };

          return (
            <>
              <Link
                key={c.id}
                href={url}
                className={`flex justify-center items-center p-3 rounded ${
                  isActive ? "bg-secondary text-primary" : "bg-primary  "
                } text-body shadow-md`}
              >
                {c.name}
              </Link>
              {isActive && (
                <button onClick={() => handleRemoveFilter("category")}>
                  X
                </button>
              )}
            </>
          );
        })}
      </div>

      {category && (
        <>
          <h2 className="p-3 w-full bg-blue-200 my-3">Tag</h2>
          <div className="flex w-full flex-wrap gap-3 max-h-52 overflow-y-scroll slim-scroll">
            {tags
              .filter((t) => t.categoryId === category)
              .map((t) => {
                const isActive = tag === t.id;
                const url = {
                  pathname,
                  query: {
                    ...searchParams,
                    tag: t.id,
                    page: 1,
                  },
                };

                return (
                  <>
                    <Link
                      key={t.id}
                      href={url}
                      className={`flex justify-center items-center p-3 rounded ${
                        isActive ? "bg-secondary text-primary" : "bg-primary "
                      } text-body shadow-md`}
                    >
                      {t.name}
                    </Link>
                    {isActive && (
                      <button onClick={() => handleRemoveFilter("tag")}>
                        X
                      </button>
                    )}
                  </>
                );
              })}
          </div>
        </>
      )}

      <h2 className="p-3 w-full bg-blue-200 my-3">Brand</h2>
      <div className="flex w-full flex-wrap gap-3 max-h-52 overflow-y-scroll slim-scroll">
        {brands.map((b) => {
          const isActive = brand === b.brand;
          const url = {
            pathname,
            query: {
              ...searchParams,
              brand: b.brand,
              page: 1,
            },
          };

          return (
            <>
              <Link
                key={b.brand}
                href={url}
                className={`flex justify-center items-center p-3 rounded ${
                  isActive ? "bg-secondary text-primary" : "bg-primary  "
                } text-body shadow-md`}
              >
                {b.brand}
              </Link>
              {isActive && (
                <button onClick={() => handleRemoveFilter("brand")}>X</button>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFilter;
