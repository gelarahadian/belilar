"use client";
import { useCart } from "@/context/cart";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const UserStripeSuccess = () => {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, []);
  return (
    <div className=" flex justify-center items-center w-full h-full text-center">
      <div>
        <p>
          Terima kasih atas pembelian Anda. Anda sekarang dapat memeriksa status
          pesanan Anda di dashboard
        </p>
        <Link
          className="p-3 mt-6 inline-block bg-secondary text-white"
          href={"/dashboard/user/orders"}
        >
          Lihat Status Order
        </Link>
      </div>
    </div>
  );
};

export default UserStripeSuccess;
