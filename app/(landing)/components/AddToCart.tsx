"use client";
import Button from "@/app/components/Button";
import { useCart } from "@/context/cart";
import { Product } from "@/context/product";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";

interface AddToCartProps {
  product: Product;
  reviewAndCheckout?: boolean;
}

const AddToCart: FC<AddToCartProps> = ({
  product,
  reviewAndCheckout = true,
}) => {
  const { cartItems, addToCart, updateCartQuantity, removeFromCart } =
    useCart();

  const existingProduct = cartItems.find((item) => item.id === product.id);
  const initialQuantity = existingProduct ? existingProduct.quantity : 1;

  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(existingProduct ? existingProduct.quantity : 1);
  }, [existingProduct]);

  const handleIncrement = () => {
    if (quantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      updateCartQuantity(product, newQuantity);
    }
  };

  const handleDecrement = () => {
    if (!quantity) {
      return;
    }
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateCartQuantity(product, newQuantity);
    } else {
      removeFromCart(product.id);
      setQuantity(1);
    }
  };
  const handleAddToCart = () => {
    if (quantity) {
      addToCart(product, quantity);
    }
  };
  return (
    <div>
      {cartItems?.some((item) => item?.id === product?.id) ? (
        <>
          <div className="flex justify-between items-center w-full mt-3">
            <button
              type="button"
              onClick={handleDecrement}
              className="border-secondary border h-10 w-10 hover:bg-secondary/10"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="text-center outline-none no-spin-arrows"
            />
            <button
              type="button"
              onClick={handleIncrement}
              className="border-secondary border h-10 w-10 hover:bg-secondary/10"
            >
              +
            </button>
          </div>
          {reviewAndCheckout && (
            <Link href={"/cart"}>
              <div className=" flex justify-center items-center rounded-lg px-4 h-10 font-bold text-center text-nowrap transition-all duration-200 ease-linear border border-secondary hover:bg-secondary/10 text-secondary mt-3">
                Tinjau & Checkout
              </div>
            </Link>
          )}
        </>
      ) : (
        <Button onClick={handleAddToCart} className="w-full mt-3">
          Add to cart
        </Button>
      )}
    </div>
  );
};

export default AddToCart;
