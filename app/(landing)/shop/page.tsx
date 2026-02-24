import { Product } from "@/context/product";
import ProductFilter from "./ProductFilter";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../components/Pagination";
import { HiSparkles } from "react-icons/hi";

export const dynamic = "force-dynamic";

// ─── API ──────────────────────────────────────────────────────────────────────

interface ProductResponse {
  currentPage: number;
  totalProducts: number;
  totalPages: number;
  products: Product[];
}

async function fetchProducts(
  searchParams: Record<string, string | undefined>,
): Promise<ProductResponse> {
  const query = new URLSearchParams({
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
    const res = await fetch(`${process.env.API}/product/filters?${query}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    if (!data || !Array.isArray(data.products))
      throw new Error("Invalid response");

    return data;
  } catch (err) {
    console.error("[SHOP_FETCH]", err);
    return { products: [], currentPage: 1, totalPages: 1, totalProducts: 0 };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { currentPage, totalProducts, totalPages, products } =
    await fetchProducts(searchParams);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
      <div className="flex gap-6 items-start">
        {/* ── Sidebar Filter ─────────────────────────────────────────────── */}
        <ProductFilter searchParams={searchParams} />

        {/* ── Product Area ───────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-gray-900">All Products</h1>
            </div>
            {totalProducts > 0 && (
              <p className="text-xs text-gray-400">
                {totalProducts.toLocaleString("id-ID")} products found
              </p>
            )}
          </div>

          {/* Grid */}
          {products.length > 0 ? (
            <ul className="flex flex-wrap gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                <HiSparkles className="text-2xl text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                No products found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </main>
      </div>
    </div>
  );
}
