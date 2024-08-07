import Button from "@/app/components/Button";
import { useCart } from "@/context/cart";
import React, { FC, useState } from "react";
import { FaLock } from "react-icons/fa6";
import { HiCreditCard } from "react-icons/hi";
import OrderSummary from "./OrderSummary";
import toast from "react-hot-toast";

interface Step3Props {
  onPrevStep: () => void;
}

const Step3: FC<Step3Props> = ({ onPrevStep }) => {
  const { cartItems, couponCode, validCoupon } = useCart();

  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const payload: { cartItems: any[]; couponCode?: string } = {
        cartItems: [],
      };

      const cartData = cartItems?.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      payload.cartItems = cartData;
      if (validCoupon) {
        payload.couponCode = couponCode;
      }

      const response = await fetch(`${process.env.API}/user/stripe/session`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.url;
      } else {
        toast.error(data.err);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan");
      setLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-2 ">
        <p className="p-3 w-full bg-blue-200 mb-3">Metode Pembayaran</p>
        <div className="flex justify-center w-full space-x-3 text-2xl mb-3">
          <FaLock />
          <HiCreditCard />
        </div>
        <p className="mb-3">
          Tarif Pembaran tetap sebesar Rp.11.000.00 berlaku di seluruh
          Indonesia!
        </p>
        <p className="p-6 bg-gray-600 text-primary">
          mengklik tempat pemesanan akan mengarahkan Anda dengan aman ke mitra
          pembayaran tepercaya kami, Stripe untuk menyelesaikan pesanan Anda
        </p>
        <div className="flex gap-3 mt-3">
          <Button
            className="flex-1"
            variant="border-danger"
            onClick={onPrevStep}
          >
            Sebelumnya
          </Button>

          <Button onClick={handleClick} disabled={loading} className="flex-1">
            {loading ? "Loading..." : "Pesan Order"}
          </Button>
        </div>
      </div>
      <div className="col-span-1">
        <OrderSummary />
      </div>
    </div>
  );
};

export default Step3;