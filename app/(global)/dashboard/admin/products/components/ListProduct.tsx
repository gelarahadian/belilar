import Button from "@/app/components/Button";
import { useProduct } from "@/context/product";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ListProduct = () => {
  const { setValue, deleteProduct } = useProduct();
  const router = useRouter();

  const colors = [
    {
      id: 1,
      name: "Merah",
      class: "bg-red-500",
    },
    {
      id: 2,
      name: "Biru",
      class: "bg-blue-500",
    },
    {
      id: 3,
      name: "Kuning",
      class: "bg-yellow-500",
    },
    {
      id: 4,
      name: "Orange",
      class: "bg-orange-500",
    },
    {
      id: 5,
      name: "Hijau",
      class: "bg-green-500",
    },
    {
      id: 6,
      name: "Ungu",
      class: "bg-purple-500",
    },
  ];

  const onEdit = (product: Product) => {
    setValue("id", product.id);
    setValue("title", product.title);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("previousPrice", product.previousPrice);
    setValue("images", product.images);
    setValue("color", product.color);
    setValue("brand", product.brand);
    setValue("categoryId", product.categoryId);
    setValue("tagIDs", product.tagIds);
    router.push("/dashboard/admin/add-product");
  };

  const onDelete = (id: string) => {
    setValue("id", id);
    deleteProduct();
  };
  const { products } = useProduct();
  return (
    <ul className="grid gap-6 grid-cols-4 ">
      {products.map((product) => (
        <li key={product.id} className="flex flex-col justify-between">
          <div className="space-y-2 mb-2">
            <div className="w-full h-48 rounded overflow-hidden relative">
              <Image
                src={
                  (product?.images[0] as { secure_url?: string })?.secure_url ??
                  ""
                }
                fill
                alt={product.title}
                className="object-cover"
              />
            </div>
            <h4 className="text-subtitle truncate">{product.title}</h4>
            <p className="text-sm text-gray-500 truncate">
              {product.description}
            </p>
            <div className="space-x-1">
              {product.color.map((color) => (
                <span
                  key={color}
                  className={`inline-block w-6 h-6 rounded-full ${
                    color === "Merah"
                      ? "bg-red-500"
                      : color === "Biru"
                      ? "bg-blue-500"
                      : color === "Yellow"
                      ? "bg-yellow-500"
                      : color === "Orange"
                      ? "bg-orange-500"
                      : color === "Hijau"
                      ? "bg-green-500"
                      : color === "Ungu"
                      ? "bg-purple-500"
                      : ""
                  } `}
                ></span>
              ))}
            </div>
            <p>Rp{product.price}</p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="danger" onClick={() => onDelete(product.id)}>
              Hapus
            </Button>
            <Button variant="info" onClick={() => onEdit(product)}>
              Edit
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ListProduct;
