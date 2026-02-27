"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/context/product";
import { HiMinus, HiPlus, HiShoppingCart } from "react-icons/hi";
import {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
} from "@/hooks/use-cart";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface AddToCartProps {
  product: Product;
  reviewAndCheckout?: boolean;
}

const AddToCart: FC<AddToCartProps> = ({
  product,
  reviewAndCheckout = true,
}) => {
  const { data: cart } = useCart();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const { data: session } = useSession();

  const existingItem = cart?.items.find(
    (item) => item.product.id === product.id,
  );
  const [quantity, setQuantity] = useState(existingItem?.quantity ?? 1);

  useEffect(() => {
    setQuantity(existingItem?.quantity ?? 1);
  }, [existingItem]);

  const isInCart = !!existingItem;
  const isPending = isAdding || isUpdating;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleIncrement = () => {
    if (!existingItem) return;
    const next = quantity + 1;
    setQuantity(next);
    updateItem({ itemId: existingItem.id, quantity: next });
  };

  const handleDecrement = () => {
    if (!existingItem) return;
    if (quantity > 1) {
      const next = quantity - 1;
      setQuantity(next);
      updateItem({ itemId: existingItem.id, quantity: next });
    } else {
      removeItem(existingItem.id);
      setQuantity(1);
    }
  };

  const handleQtyInput = (val: number) => {
    if (!existingItem || val < 1) return;
    setQuantity(val);
    updateItem({ itemId: existingItem.id, quantity: val });
  };

  const handleAddToCart = () => {
    if (!session) {
      toast.error("Please login first.");
      return;
    }
    addToCart({ productId: product.id, quantity });
  };

  // ── In Cart: stepper ─────────────────────────────────────────────────────────
  if (isInCart) {
    return (
      <div className="space-y-2 mt-3">
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl overflow-hidden h-10">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={isPending}
            aria-label="Decrease quantity"
            className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors duration-150 disabled:opacity-40"
          >
            <HiMinus className="text-sm" />
          </button>

          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQtyInput(Number(e.target.value))}
            disabled={isPending}
            aria-label="Quantity"
            className="flex-1 text-center text-sm font-bold text-gray-800 outline-none bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-40"
          />

          <button
            type="button"
            onClick={handleIncrement}
            disabled={
              isPending ||
              (product.stock !== undefined &&
                product.stock !== null &&
                quantity >= product.stock)
            }
            aria-label="Increase quantity"
            className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-150 disabled:opacity-40"
          >
            <HiPlus className="text-sm" />
          </button>
        </div>

        {reviewAndCheckout && (
          <Link href="/cart">
            <div className="w-full h-10 flex items-center justify-center rounded-xl border-2 border-secondary-500 text-secondary-600 text-sm font-bold hover:bg-secondary-50 transition-colors duration-150">
              Review & Checkout
            </div>
          </Link>
        )}
      </div>
    );
  }

  // ── Not in cart: Add button ───────────────────────────────────────────────────
  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isAdding}
      className="w-full mt-3 h-10 flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary-900 active:bg-primary-950 text-white text-sm font-bold rounded-xl transition-colors duration-150 shadow-md shadow-primary-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isAdding ? (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <HiShoppingCart className="text-base" />
      )}
      {isAdding ? "Adding…" : "Add to Cart"}
    </button>
  );
};

export default AddToCart;
