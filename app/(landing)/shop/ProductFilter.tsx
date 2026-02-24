"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import { HiX, HiAdjustments } from "react-icons/hi";

import { useCategory } from "@/context/category";
import { useProduct } from "@/context/product";
import { useTag } from "@/context/tag";
import { priceRanges } from "@/lib/filterData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductFilterProps {
  searchParams: { [key: string]: string | undefined };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-4 rounded-full bg-primary-500" />
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
        {children}
      </h2>
    </div>
  );
}

function FilterChip({
  label,
  active,
  href,
  onRemove,
}: {
  label: React.ReactNode;
  active: boolean;
  href: object;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Link
        href={href}
        className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
          active
            ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
            : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
        }`}
      >
        {label}
      </Link>
      {active && onRemove && (
        <button
          onClick={onRemove}
          className="w-5 h-5 flex items-center justify-center rounded-md bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-400 transition-colors duration-150"
          aria-label="Remove filter"
        >
          <HiX className="text-[10px]" />
        </button>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  const hasActiveFilter =
    minPrice || maxPrice || ratings || category || tag || brand;

  const handleRemoveFilter = (filterName: string | string[]) => {
    const updated = Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v !== undefined),
    ) as Record<string, string>;

    if (typeof filterName === "string") {
      delete updated[filterName];
    } else {
      filterName.forEach((k) => delete updated[k]);
    }

    updated.page = "1";
    router.push(`${pathname}?${new URLSearchParams(updated).toString()}`);
  };

  return (
    <aside className="w-60 flex-shrink-0">
      <div className="sticky top-20 bg-white border border-gray-100 rounded-2xl p-4 overflow-y-auto max-h-[calc(100vh-6rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <HiAdjustments className="text-primary-600 text-base" />
            <h1 className="text-sm font-bold text-gray-900">Filters</h1>
          </div>
          {hasActiveFilter && (
            <Link
              href="/shop"
              className="text-xs font-semibold text-red-400 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors duration-150"
            >
              Reset
            </Link>
          )}
        </div>

        <div className="space-y-6">
          {/* ── Price ─────────────────────────────────────────────────────── */}
          <div>
            <SectionTitle>Price</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {priceRanges.map((range) => {
                const isActive =
                  minPrice === String(range.min) &&
                  maxPrice === String(range.max);
                return (
                  <FilterChip
                    key={range.label}
                    label={range.label}
                    active={isActive}
                    href={{
                      pathname,
                      query: {
                        ...searchParams,
                        minPrice: range.min,
                        maxPrice: range.max,
                        page: 1,
                      },
                    }}
                    onRemove={() =>
                      handleRemoveFilter(["minPrice", "maxPrice"])
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* ── Rating ────────────────────────────────────────────────────── */}
          <div>
            <SectionTitle>Rating</SectionTitle>
            <div className="flex flex-col gap-1.5">
              {[5, 4, 3, 2, 1].map((val) => {
                const isActive = String(ratings) === String(val);
                return (
                  <FilterChip
                    key={val}
                    active={isActive}
                    href={{
                      pathname,
                      query: { ...searchParams, ratings: val, page: 1 },
                    }}
                    onRemove={() => handleRemoveFilter("ratings")}
                    label={
                      <span className="flex items-center gap-1">
                        <Rating
                          initialValue={val}
                          size={12}
                          SVGclassName="inline-block"
                          readonly
                        />
                        <span className="text-[10px]">& up</span>
                      </span>
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* ── Category ──────────────────────────────────────────────────── */}
          <div>
            <SectionTitle>Category</SectionTitle>
            <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
              {categories.map((c) => {
                const isActive = category === c.id;
                return (
                  <FilterChip
                    key={c.id}
                    label={c.name}
                    active={isActive}
                    href={{
                      pathname,
                      query: { ...searchParams, category: c.id, page: 1 },
                    }}
                    onRemove={() => handleRemoveFilter("category")}
                  />
                );
              })}
            </div>
          </div>

          {/* ── Tag (visible only when category selected) ─────────────────── */}
          {category && (
            <div>
              <SectionTitle>Tag</SectionTitle>
              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                {tags
                  .filter((t) => t.categoryId === category)
                  .map((t) => {
                    const isActive = tag === t.id;
                    return (
                      <FilterChip
                        key={t.id}
                        label={t.name}
                        active={isActive}
                        href={{
                          pathname,
                          query: { ...searchParams, tag: t.id, page: 1 },
                        }}
                        onRemove={() => handleRemoveFilter("tag")}
                      />
                    );
                  })}
              </div>
            </div>
          )}

          {/* ── Brand ─────────────────────────────────────────────────────── */}
          <div>
            <SectionTitle>Brand</SectionTitle>
            <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
              {brands.map((b) => {
                const isActive = brand === b.brand;
                return (
                  <FilterChip
                    key={b.brand}
                    label={b.brand}
                    active={isActive}
                    href={{
                      pathname,
                      query: { ...searchParams, brand: b.brand, page: 1 },
                    }}
                    onRemove={() => handleRemoveFilter("brand")}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductFilter;
