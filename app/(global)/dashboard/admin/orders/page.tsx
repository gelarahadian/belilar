"use client";
import Pagination from "@/app/(landing)/components/Pagination";
import {
  Address,
  CartItem,
  DeliveryStatus,
  Order as PrismaOrder,
  User,
} from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Order extends PrismaOrder {
  cartItems: CartItem[];
  user: User;
}

const AdminOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  //   Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  console.log(orders);

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (page: string | null) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.API}/admin/orders?page=${page || 1}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      console.log(data);
      setOrders(data.orders);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    newStatus: DeliveryStatus,
    orderId: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/orders/${orderId}`,
        {
          method: "PUT",
          body: JSON.stringify({ delivery_status: newStatus }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        toast.error("Gagal Mengubah Status Order, Silahkan Coba Lagi");
      } else {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, deliveryStatus: newStatus } : o
          )
        );
        toast.success("Status Order Berhasil!");
        // fetchOrders();
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
                  <th className="p-3 text-start">Nama Pemesan:</th>
                  <td className="p-3">{order.user.name}</td>
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
                          onClick={() => router.push(`/product/${item.slug}`)}
                          className="cursor-pointer text-blue-500"
                        >
                          {item.quantity} x {item.title} - Rp.
                          {item.price.toFixed(2)}
                          <br />
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>

                <tr>
                  <th className="text-start p-3">Status Pesanan:</th>
                  <td>
                    <select
                      onChange={(e) =>
                        handleStatusChange(
                          e.target.value as DeliveryStatus,
                          order.id
                        )
                      }
                      value={order.deliveryStatus}
                      disabled={order.refunded}
                    >
                      <option value="NotProcessed"> Belum Di Proses</option>
                      <option value="Processing">Di Proses</option>
                      <option value="Dispatched">Di Kirim</option>

                      {order.refunded && (
                        <option value="Cancelled">Dibatalkan</option>
                      )}
                      <option value="Delivered">Di Antar</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      <Pagination currentPage={currentPage} totalPages={totalPages} />

      <pre>
        <code>{JSON.stringify(orders, null, 4)}</code>
      </pre>
    </div>
  );
};

export default AdminOrder;
