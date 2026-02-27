import { Product } from "@/context/product";
import Banner from "./components/Banner";
import ListProduct from "./components/ListProduct";

// ─── API ──────────────────────────────────────────────────────────────────────

interface ProductResponse {
  currentPage: number;
  totalProducts: number;
  totalPages: number;
  products: Product[];
}

async function fetchProducts(page: string): Promise<ProductResponse> {
  const res = await fetch(`${process.env.API}/product?page=${page}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.log(text);
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }

  return res.json();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: { page?: string };
}

export default async function HomePage({ searchParams }: PageProps) {
  const { currentPage, totalProducts, totalPages, products } =
    await fetchProducts(searchParams.page ?? "1");
  console.log(products);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <Banner />
      <ListProduct
        currentPage={currentPage}
        totalPages={totalPages}
        totalProducts={totalProducts}
        products={products}
      />
    </main>
  );
}
