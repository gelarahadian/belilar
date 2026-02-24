"use client";
import { Address, CartItem, Order as PrismaOrder } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Order extends PrismaOrder {
  cartItems: CartItem[];
}

const UserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.API}/user/orders`, {
        method: "GET",
      });

      const data = await response.json();
      console.log(data);
      setOrders(data.orders);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(
        `${process.env.API}/user/orders/refund?orderId=${orderId}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error("Ada Kesalahan, Silahkan Ulangi lagi");
      } else {
        toast.success("Membatalkan Order berhasil");
        fetchOrders();
      }
    } catch (err) {
      console.log(err);
      toast.error("Terjadi Kesalahan Coba Lagi");
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <h2 className="text-3xl">Sedang Memuat...</h2>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto space-y-3">
      <h3 className="text-center font-semibold font-2xl">Order Terkini</h3>
      {orders.length > 0 &&
        orders.map((order) => (
          <div className="p-3 bg-slate-300 w-full">
            <table className="w-full">
              <tbody>
                <tr className="bg-slate-200">
                  <th className="p-3 text-start">Nomor Tagihan:</th>
                  <td className="p-3">{order.chargeId}</td>
                </tr>

                <tr>
                  <th className="p-3 text-start">Tanggal Dibuat:</th>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>

                <tr className="bg-slate-200">
                  <th className="p-3 text-start">Maksud Pembayaran:</th>
                  <td className="p-3">{order.payment_intent}</td>
                </tr>

                <tr>
                  <th className="p-3 text-start">Kuitansi:</th>
                  <td className="p-3">
                    <Link href={order.receipt_url}>Lihat Kuitansi</Link>
                  </td>
                </tr>

                <tr className="bg-slate-200">
                  <th className="p-3 text-start">Refund:</th>
                  <td className="p-3">{order.refunded ? "Ya" : " Tidak"}</td>
                </tr>

                <tr>
                  <th className="p-3 text-start">Status:</th>
                  <td className="p-3">{order.status}</td>
                </tr>

                <tr className="bg-slate-200">
                  <th className="p-3 text-start">Total Tagihan:</th>
                  <td className="p-3">Rp.{order.amount_captured.toFixed(2)}</td>
                </tr>

                <tr>
                  <th className="p-3 text-start">Pengiriman</th>
                  <td>
                    {order.shipping.address.line1} <br />
                    {order.shipping.address.line2 &&
                      order.shipping.address.line2}
                    , {order.shipping.address.city},{" "}
                    {order.shipping.address.state},{" "}
                    {order.shipping.address.postal_code} <br />{" "}
                    {order.shipping.address.country}
                  </td>
                </tr>

                <tr className="bg-slate-200">
                  <th className="p-3 text-start">Pesanan Produk:</th>
                  <td>
                    <div>
                      {order.cartItems.map((item) => (
                        <div
                          key={item.id}
                          // onClick={() => router.push(`/product/${item.slug}`)}
                          className="cursor-pointer text-blue-500"
                        >
                          {/* {item.quantity} x {item.title} - Rp. */}
                          {/* {item.price.toFixed(2)} */}
                          <br />
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>

                <tr>
                  <th className="text-start">Status Pesanan:</th>
                  <td>
                    {order.deliveryStatus}
                    {order.deliveryStatus === "NotProcessed" &&
                      !order.refunded && (
                        <>
                          <br />
                          <span
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Batalkan Pesanan
                          </span>
                        </>
                      )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

      <pre>
        <code>{JSON.stringify(orders, null, 4)}</code>
      </pre>
    </div>
  );
};

export default UserOrders;
