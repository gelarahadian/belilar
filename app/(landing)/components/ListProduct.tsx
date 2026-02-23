import { FC } from "react";
import { Product } from "@/context/product";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "./Pagination";
import { HiSparkles } from "react-icons/hi";

interface ListProductProps {
  currentPage: number;
  totalPages: number;
  products: Product[];
  totalProducts?: number;
}

const ListProduct: FC<ListProductProps> = ({
  currentPage,
  totalPages,
  products,
  totalProducts,
}) => {
  return (
    <section className="mt-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Accent bar */}
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-secondary-400 to-secondary-600" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Recommended
              </h2>
            </div>
            {totalProducts && (
              <p className="text-xs text-gray-400 mt-0.5">
                {totalProducts.toLocaleString("id-ID")} produk tersedia
              </p>
            )}
          </div>
        </div>

        {/* Filter chip placeholder */}
        <div className="hidden sm:flex items-center gap-2">
          {["Terbaru", "Terlaris", "Termurah"].map((f) => (
            <button
              key={f}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-150"
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      {products && products.length > 0 ? (
        <ul className="flex xl:justify-start justify-center flex-wrap gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <HiSparkles className="text-2xl text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Product Not Found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try to change the filter or search keyword
          </p>
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
};

export default ListProduct;
