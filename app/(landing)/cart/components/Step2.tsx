"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { FC } from "react";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/context/cart";

interface Step2Props {
  onNextStep: () => void;
  onPrevStep: () => void;
}

const Step2: FC<Step2Props> = ({ onNextStep, onPrevStep }) => {
  const { data, status, update } = useSession();

  const { couponCode, setCouponCode, handleCoupon } = useCart();

  if (status !== "authenticated") {
    return (
      <div className="flex w-full gap-3">
        <Button className="flex-1" variant="danger" onClick={onPrevStep}>
          Sebelumnya
        </Button>
        <Link
          href={`/login?callbackUrl=${window.location.pathname}`}
          className="flex-1"
        >
          <div className="flex justify-center items-center rounded-lg px-4 h-10 font-bold text-center text-nowrap transition-all duration-200 ease-linear border border-secondary hover:bg-secondary/10 text-secondary">
            Tinjau & Checkout
          </div>
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-2 space-y-3">
        <p className="p-3 w-full bg-blue-200 mb-3">Detail Kontak</p>
        <Input
          value={data?.user?.name || ""}
          id="name"
          placeholder="name"
          disabled
        />
        <Input
          value={data?.user?.email || ""}
          id="email"
          placeholder="email"
          disabled
        />

        <Input
          id="coupon"
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Masukan Kode Kupon Disini!"
        />
        <Button
          onClick={() => handleCoupon(couponCode.trim())}
          disabled={!couponCode}
        >
          Teerapkan Kupon
        </Button>
        <div className="flex gap-3">
          <Button className="flex-1" variant="danger" onClick={onPrevStep}>
            Sebelumnya
          </Button>
          <Button className="flex-1" onClick={onNextStep}>
            Selanjutnya
          </Button>
        </div>
      </div>
      <div className="col-span-1">
        <OrderSummary />
      </div>
    </div>
  );
};

export default Step2;
