import ProductImage from "./components/ProductImage";
import ProductRating from "../../../components/ProductCard/ProductRating";
import UserReviews from "../../components/UserReviews";
import AddToCart from "../../../components/ProductCard/AddToCart";
import CouponCode from "../../components/CouponCode";
import { HiTag, HiCollection, HiShieldCheck, HiTruck } from "react-icons/hi";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const data = await fetchProduct(params?.slug);
  const { product } = data;
  return {
    title: `${product?.title} — Belilar`,
    description: product?.description?.substring(0, 160),
    openGraph: { image: product?.images[0]?.secure_url },
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchProduct(slug: string) {
  const res = await fetch(`${process.env.API}/product/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUSD(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { product } = await fetchProduct(params.slug);

  const discount =
    product.previousPrice && product.previousPrice > product.price
      ? Math.round(
          ((product.previousPrice - product.price) / product.previousPrice) *
            100,
        )
      : null;

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* ── Product Section ─────────────────────────────────────────────────── */}
      <article className="flex flex-col lg:flex-row gap-10">
        {/* Left: Images */}
        <section className="lg:w-[480px] flex-shrink-0">
          <ProductImage product={product} />
        </section>

        {/* Right: Info */}
        <section className="flex-1 space-y-5">
          {/* Category + Brand badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary-50 text-primary-600 border border-primary-100">
              {product.category.name}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 border border-gray-200">
              {product.brand}
            </span>
            {discount && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-secondary-50 text-secondary-600 border border-secondary-100">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            {product.title}
          </h1>

          {/* Rating */}
          <ProductRating product={product} compact />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-primary-700">
              {formatUSD(product.price)}
            </span>
            {product.previousPrice && product.previousPrice > product.price && (
              <span className="text-base text-gray-400 line-through">
                {formatUSD(product.previousPrice)}
              </span>
            )}
          </div>

          {/* Coupon */}
          <CouponCode product={product} />

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <HiTag className="text-gray-400 text-sm flex-shrink-0" />
              {product.tags.map((tag: { id: string; name: string }) => (
                <span
                  key={tag.id}
                  className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>

          {/* Trust signals */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: HiShieldCheck, text: "Secure Payment" },
              { icon: HiTruck, text: "Fast Shipping" },
              { icon: HiCollection, text: "Quality Guaranteed" },
              { icon: HiTag, text: "Best Price" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100"
              >
                <Icon className="text-primary-500 text-sm flex-shrink-0" />
                <span className="text-xs font-medium text-gray-600">
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Stock indicator */}
          {product.stock !== null && (
            <p
              className={`text-xs font-semibold ${product.stock > 10 ? "text-primary-600" : product.stock > 0 ? "text-secondary-600" : "text-red-500"}`}
            >
              {product.stock > 10
                ? `✓ In Stock (${product.stock} available)`
                : product.stock > 0
                  ? `⚠ Only ${product.stock} left in stock`
                  : "✕ Out of Stock"}
            </p>
          )}

          {/* Add to Cart */}
          <AddToCart product={product} reviewAndCheckout />
        </section>
      </article>

      {/* ── Reviews ──────────────────────────────────────────────────────────── */}
      <article className="mt-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full bg-secondary-500" />
          <h2 className="text-lg font-black text-gray-900">Customer Reviews</h2>
          <span className="text-sm text-gray-400">
            ({product.ratings?.length ?? 0})
          </span>
        </div>
        <UserReviews reviews={product.ratings} />
      </article>

      {/* ── Related Products ─────────────────────────────────────────────────── */}
      <article className="mt-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full bg-primary-500" />
          <h2 className="text-lg font-black text-gray-900">
            You May Also Like
          </h2>
        </div>
        {/* Plug in your related products component here */}
      </article>
    </main>
  );
}
