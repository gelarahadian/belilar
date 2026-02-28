import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditProductClient from "./EditProductClient";

export const metadata = { title: "Edit Product — Admin" };

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") redirect("/");

  const [product, categories, tags] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { category: { select: { id: true, name: true } } },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  return (
    <EditProductClient
      product={JSON.parse(JSON.stringify(product))}
      categories={categories}
      tags={tags}
    />
  );
}
