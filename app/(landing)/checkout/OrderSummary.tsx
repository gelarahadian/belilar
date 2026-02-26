"use client";

import Image from "next/image";
import { CartItemDetail } from "@/services/cart.service";

interface OrderSummaryProps {
  items: CartItemDetail[];
  subtotal: number;
  discount: number;
  shipping: number;
}

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

export default function OrderSummary({
  items,
  subtotal,
  discount,
  shipping,
}: OrderSummaryProps) {
  const total = subtotal - discount + shipping;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">
          Order Summary
          <span className="ml-2 text-gray-400 font-normal">
            ({items.length} item{items.length > 1 ? "s" : ""})
          </span>
        </h2>
      </div>

      {/* Items */}
      <ul className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
        {items.map((item) => {
          const image = item.product.images[0]?.secure_url ?? "";
          return (
            <li key={item.id} className="flex items-center gap-3 px-5 py-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                {image && (
                  <Image
                    src={image}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                )}
                {/* Quantity badge */}
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-primary-600 text-white text-[10px] font-bold rounded-full">
                  {item.quantity}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                  {item.product.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatUSD(item.product.price)} × {item.quantity}
                </p>
              </div>

              <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                {formatUSD(item.product.price * item.quantity)}
              </p>
            </li>
          );
        })}
      </ul>

      {/* Totals */}
      <div className="px-5 py-4 border-t border-gray-100 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span className="font-medium text-gray-800">
            {formatUSD(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-secondary-600 font-medium">Discount</span>
            <span className="text-secondary-600 font-bold">
              -{formatUSD(discount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          <span className="font-medium text-gray-800">
            {shipping === 0 ? "Calculated by Stripe" : formatUSD(shipping)}
          </span>
        </div>

        <div className="border-t border-gray-100 pt-2 flex justify-between items-baseline">
          <span className="text-sm font-bold text-gray-900">Total</span>
          <span className="text-xl font-black text-primary-700">
            {formatUSD(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
