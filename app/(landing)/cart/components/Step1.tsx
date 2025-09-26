import { useCart } from "@/context/cart";
import Image from "next/image";
import React, { FC } from "react";
import AddToCart from "../../../components/ProductCard/AddToCart";
import Button from "@/app/components/Button";
import OrderSummary from "./OrderSummary";

interface Step1Props {
  onNextStep: () => void;
}

const Step1: FC<Step1Props> = ({ onNextStep }) => {
  const { cartItems } = useCart();
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-2 space-y-3">
        <p className="p-3 w-full bg-blue-200 mb-3">
          Tinjau Kerangjang / Sesuaikan Jumlah
        </p>
        {cartItems.map((product) => (
          <div key={product.id} className="flex shadow-md  ">
            <div className="relative h-[200px] w-1/3">
              <Image
                src={product?.images[0]?.secure_url}
                alt={product.title}
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="w-2/3 p-3">
              <h3 className="text-2xl font-bold truncate">{product.title}</h3>
              <p className="text-xl font-bold ">
                Rp.{product.price.toFixed(2)}
              </p>
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    product?.description?.length > 160
                      ? `${product.description.slice(0, 160)}...`
                      : product.description,
                }}
              />
              <AddToCart product={product} reviewAndCheckout={false} />
            </div>
          </div>
        ))}
        <div className="flex justify-end w-full">
          <Button onClick={onNextStep}>Selanjutnya</Button>
        </div>
      </div>
      <div className="col-span-1">
        <OrderSummary />
      </div>
    </div>
  );
};

export default Step1;
