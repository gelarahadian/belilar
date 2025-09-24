"use client";
import { useCart } from "@/context/cart";
import Link from "next/link";
import React from "react";
import { BsFillCartCheckFill } from "react-icons/bs";
import { IoCartOutline } from "react-icons/io5";

const Cart = () => {
  const { cartItems } = useCart();
  return (
    <div className="relative">
      <Link href={"/cart"} className="flex items-center space-x-2">
        <IoCartOutline size={24} />
        <span className="absolute flex justify-center items-center -right-1 -top-1 w-4 h-4 text-white bg-secondary rounded-full">
          {cartItems.length}
        </span>
      </Link>
    </div>
  );
};

export default Cart;
