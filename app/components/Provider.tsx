import CartProvider from "@/context/cart";
import CategoryProvider from "@/context/category";
import ProductProvider from "@/context/product";
import TagProvider from "@/context/tag";
import { SessionProvider } from "next-auth/react";
import React, { FC } from "react";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <ProductProvider>
      <TagProvider>
        <CategoryProvider>
          <CartProvider>
            <SessionProvider>{children}</SessionProvider>
          </CartProvider>
        </CategoryProvider>
      </TagProvider>
    </ProductProvider>
  );
};

export default Provider;
