"use client";

import { useCart } from "@/context/cart";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export default function Cart() {
  const { cartItems } = useCart();
  const count = cartItems.length;

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all duration-150"
      aria-label={`Keranjang, ${count} item`}
    >
      <IoCartOutline className="text-xl" />

      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-secondary-500 text-white text-[10px] font-bold rounded-full px-1 shadow-md shadow-secondary-500/40 ring-2 ring-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
