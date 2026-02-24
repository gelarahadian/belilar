"use client";

import CartProvider from "@/context/cart";
import CategoryProvider from "@/context/category";
import ProductProvider from "@/context/product";
import TagProvider from "@/context/tag";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React, { FC, useState } from "react";
import ToasterProvider from "./ToasterProvider";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <ToasterProvider>
      <QueryClientProvider client={queryClient}>
        <ProductProvider>
          <TagProvider>
            <CategoryProvider>
              <CartProvider>
                <SessionProvider>{children}</SessionProvider>
              </CartProvider>
            </CategoryProvider>
          </TagProvider>
        </ProductProvider>
      </QueryClientProvider>
    </ToasterProvider>
  );
};

export default Provider;
