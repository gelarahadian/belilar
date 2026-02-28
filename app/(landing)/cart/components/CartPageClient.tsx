"use client";

// ─── app/cart/CartPageClient.tsx ───────────────────────────────────────────────
// Example usage of all cart hooks — replace UI with your own design

import Image from "next/image";
import Link from "next/link";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "@/hooks/use-cart";
import { HiMinus, HiPlus, HiTrash, HiShoppingCart } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPageClient() {
  const { data: cart, isLoading } = useCart();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();
  const router = useRouter();

  const { data: session, status } = useSession();
    useEffect(() => {
    if (status === "unauthenticated") {
        router.replace("/sign-in?redirected=true");
    }
    }, [status]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <HiShoppingCart className="text-4xl text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mt-1 mb-6">
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/"
          className="bg-primary-800 hover:bg-primary-800 text-white font-bold px-6 py-2.5 rounded-xl transition-colors duration-150"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // ── Cart ─────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">
          Your Cart{" "}
          <span className="text-base font-semibold text-gray-400">
            ({cart.items.length} item{cart.items.length > 1 ? "s" : ""})
          </span>
        </h1>
        <button
          type="button"
          onClick={() => clearCart()}
          disabled={isClearing}
          className="text-xs font-semibold text-red-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors duration-150 disabled:opacity-50"
        >
          {isClearing ? "Clearing…" : "Clear All"}
        </button>
      </div>

      {/* Items */}
      <ul className="space-y-3">
        {cart.items.map((item) => {
          const image = item.product.images[0]?.secure_url ?? "";

          return (
            <li
              key={item.id}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 transition-colors duration-150"
            >
              {/* Image */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <Image
                  src={image}
                  fill
                  alt={item.product.title}
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="text-sm font-semibold text-gray-800 hover:text-primary line-clamp-1 transition-colors duration-150"
                >
                  {item.product.title}
                </Link>
                <p className="text-base font-black text-primary-800">
                  {(item.product.price * item.quantity).toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "USD",
                    },
                  )}
                </p>
                <p className="text-xs text-gray-400">
                  {item.product.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}{" "}
                  / item
                </p>
              </div>

              {/* Qty stepper */}
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden h-9 flex-shrink-0">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() =>
                    item.quantity > 1
                      ? updateItem({
                          itemId: item.id,
                          quantity: item.quantity - 1,
                        })
                      : removeItem(item.id)
                  }
                  className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-150 disabled:opacity-40"
                >
                  <HiMinus className="text-xs" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-gray-800">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  disabled={
                    isUpdating ||
                    (item.product.stock !== null &&
                      item.quantity >= item.product.stock)
                  }
                  onClick={() =>
                    updateItem({ itemId: item.id, quantity: item.quantity + 1 })
                  }
                  className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-primary-800 hover:bg-primary-50 transition-colors duration-150 disabled:opacity-40"
                >
                  <HiPlus className="text-xs" />
                </button>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all duration-150"
                aria-label="Remove item"
              >
                <HiTrash className="text-base" />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal ({cart.items.length} items)</span>
          <span className="font-semibold text-gray-800">
            {cart.total.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          <span className="text-primary-800 font-semibold">
            Calculated at checkout
          </span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-black text-xl text-primary-800">
            {cart.total.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-primary-800 hover:bg-primary-900 active:bg-primary-900 text-white text-sm font-bold py-3 rounded-xl text-center transition-colors duration-150 shadow-md shadow-primary-200"
        >
          Proceed to Checkout
        </Link>
      </div>
    </main>
  );
}
