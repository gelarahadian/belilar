"use client";

import Link from "next/link";
import { HiCheckCircle, HiShoppingBag, HiHome } from "react-icons/hi";

export default function UserStripeSuccess() {

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
          <HiCheckCircle className="text-5xl text-primary-500" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900">
            Payment Successful!
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Thank you for your purchase. You can track your order status from
            your dashboard.
          </p>
        </div>

        <div className="border-t border-gray-100" />

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard/user/orders"
            className="w-full h-11 flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-colors duration-150 shadow-md shadow-primary/20"
          >
            <HiShoppingBag className="text-base" />
            View My Orders
          </Link>
          <Link
            href="/"
            className="w-full h-11 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-150"
          >
            <HiHome className="text-base" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
