import { useCart } from "@/context/cart";
import Image from "next/image";
import React from "react";

const OrderSummary = () => {
  const { cartItems } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item?.product?.price * (item?.quantity || 1),
      0,
    );
  };

  const totalItems = cartItems?.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  const itemOrItems = totalItems === 1 ? "item" : "items";
  console.log(cartItems);
  return (
    <div>
      <p className="p-3 w-full bg-blue-200 mb-3">Order Summary</p>
      <ul className="space-y-3">
        {cartItems?.map((product) => (
          <li key={product.id} className="flex flex-wrap shadow-md h-24 ">
            <div className="w-3/12 relative h-24">
              <Image
                src={product?.product?.images?.[0]?.secure_url}
                alt={product.product.title}
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="w-6/12 p-3">
              {/* <p className="truncate">{product.title}</p> */}
            </div>
            <div className="w-3/12 p-3">
              {/* <p className="font-semibold">Rp.{product.price.toFixed(2)}</p> */}
              <p>Jmlh:{product?.quantity}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-3">
        <p>
          Total {totalItems} {itemOrItems}:
        </p>
        <p className="text-2xl font-semibold">
          Rp.{calculateTotal().toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
