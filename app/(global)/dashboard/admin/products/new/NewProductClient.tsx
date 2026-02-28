"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { useCreateProduct } from "@/hooks/use-admin-product";
import ProductForm from "../ProductForm";

interface Props {
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}

export default function NewProductClient({ categories, tags }: Props) {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateProduct();

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
          <h1 className="text-xl font-black text-gray-900">Add Product</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Create a new product listing
          </p>
        </div>
      </div>

      <ProductForm
        categories={categories}
        tags={tags}
        isPending={isPending}
        onCancel={() => router.push("/dashboard/admin/products")}
        onSubmit={(payload) => create(payload)}
      />
    </div>
  );
}
