"use client";
import { useCart } from "@/context/cart";
import { Product } from "@/context/product";
import { useSearchParams } from "next/navigation";
import React, { FC, useEffect } from "react";

interface CouponCodeProps {
  product: Product;
}

const CouponCode: FC<CouponCodeProps> = ({ product }) => {
  const { handleCoupon, setCouponCode, percentOff, validCoupon } = useCart();
  const searchParams = useSearchParams();
  const code = searchParams.get("couponCode");

  useEffect(() => {
    if (code) {
      setCouponCode(code);
      handleCoupon(code);
    }
  }, []);
  return (
    <div className="flex justify-between items-center">
      {validCoupon ? (
        <del>
          <h4 className="text-2xl text-red-500 ">
            Rp.{product?.price?.toFixed(2)}
          </h4>
        </del>
      ) : (
        <h4>{product?.price?.toFixed(2)}</h4>
      )}

      {percentOff > 0 && (
        <h4 className="text-2xl text-red-500 bg-red-200 p-3">
          Rp.{((product?.price * (100 - percentOff)) / 100).toFixed(2)}{" "}
          {percentOff}% Kupon Diskon
        </h4>
      )}
    </div>
  );
};

export default CouponCode;
