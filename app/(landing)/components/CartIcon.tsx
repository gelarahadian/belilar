"use client";
import { useCart } from "@/context/cart";
import Link from "next/link";
import React from "react";
import { BsFillCartCheckFill } from "react-icons/bs";

const CartIcon = () => {
  const { cartItems } = useCart();
  return (
    <div className="text-secondary text-lg">
      <Link href={"/cart"} className="flex">
        <BsFillCartCheckFill size={25} />
        <p>{cartItems.length}</p>
      </Link>
    </div>
  );
};

export default CartIcon;
