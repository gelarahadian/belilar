"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { useUpdateProduct } from "@/hooks/use-admin-product";
import { AdminProduct } from "@/services/admin-product.service";
import ProductForm from "../../ProductForm";

interface Props {
  product: AdminProduct;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}

export default function EditProductClient({
  product,
  categories,
  tags,
}: Props) {
  const router = useRouter();
  const { mutate: update, isPending } = useUpdateProduct();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/admin/products"
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors duration-150"
        >
          <HiChevronLeft className="text-sm" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">Edit Product</h1>
          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
            {product.title}
          </p>
        </div>
      </div>

      <ProductForm
        initial={product}
        categories={categories}
        tags={tags}
        isPending={isPending}
        onCancel={() => router.push("/dashboard/admin/products")}
        onSubmit={(payload) => update({ id: product.id, payload })}
      />
    </div>
  );
}
