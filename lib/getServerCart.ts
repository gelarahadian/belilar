import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CartResponse } from "@/services/cart.service";

// ─── getServerCart ─────────────────────────────────────────────────────────────
// Use this in Next.js Server Components or generateMetadata to prefetch cart
// so the page is already populated on first load (no loading flicker).
//
// Usage in a Server Component:
//
//   import { getServerCart } from "@/lib/getServerCart";
//   import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
//   import { cartKeys } from "@/hooks/cart.keys";
//
//   export default async function CartPage() {
//     const queryClient = new QueryClient();
//     await queryClient.prefetchQuery({
//       queryKey: cartKeys.detail(),
//       queryFn: getServerCart,
//     });
//     return (
//       <HydrationBoundary state={dehydrate(queryClient)}>
//         <CartPageClient />
//       </HydrationBoundary>
//     );
//   }

export async function getServerCart(): Promise<CartResponse> {
  const session = await auth()

  if (!session?.user?.id) {
    return { id: null, items: [], total: 0 };
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              previousPrice: true,
              images: true,
              stock: true,
              brand: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cart) return { id: null, items: [], total: 0 };

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return {
    id: cart.id,
    items: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        title: item.product.title,
        slug: item.product.slug,
        price: item.product.price,
        previousPrice: item.product.previousPrice,
        images: item.product.images as { secure_url: string }[],
        stock: item.product.stock,
        brand: item.product.brand,
      },
    })),
    total,
  };
}
