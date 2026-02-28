import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewProductClient from "./NewProductClient";

export const metadata = { title: "Add Product — Admin" };

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") redirect("/");

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return <NewProductClient categories={categories} tags={tags} />;
}
