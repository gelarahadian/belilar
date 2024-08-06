"use client";
import { useProduct } from "@/context/product";
import React, { useEffect } from "react";
import ListProduct from "./components/ListProduct";

const page = () => {
  const { products, fetchProducts } = useProduct();

  useEffect(() => {
    fetchProducts();
  }, []);

  console.log(products);

  return (
    <>
      <ListProduct />
    </>
  );
};

export default page;
