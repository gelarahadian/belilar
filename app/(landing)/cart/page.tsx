"use client";
import React, { useState } from "react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import { GoCheckCircleFill } from "react-icons/go";
import { useCart } from "@/context/cart";
import Link from "next/link";
import Button from "@/app/components/Button";

const Cart = () => {
  // context
  const { cartItems } = useCart();
  // state
  const [step, setStep] = useState<number>(1);

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  const tickIcon = (stepNumber: number) => {
    return step === stepNumber ? (
      <GoCheckCircleFill className="text-secondary" />
    ) : null;
  };
  if (!cartItems?.length) {
    return (
      <div className="max-w-6xl mx-auto flex justify-center items-center w-full h-screen">
        <div className="text-center space-y-3">
          <p className="text-body">Keranjang Kosong!</p>
          <Link href={"/shop"} className="">
            <Button className="text-lg">Lanjutkan Belanja</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex justify-between w-full my-6">
          <div className="flex space-x-3 items-center">
            {tickIcon(1)} <p>Peninjauan</p>
          </div>
          <div className="flex space-x-3 items-center">
            {tickIcon(2)} <p>Detail Kontak</p>
          </div>
          <div className="flex space-x-3 items-center">
            {tickIcon(3)} <p>Pembayaran</p>
          </div>
        </div>

        <div>
          {step === 1 && <Step1 onNextStep={handleNextStep} />}
          {step === 2 && (
            <Step2 onPrevStep={handlePrevStep} onNextStep={handleNextStep} />
          )}
          {step === 3 && <Step3 onPrevStep={handlePrevStep} />}
        </div>
      </div>
    </>
  );
};

export default Cart;
