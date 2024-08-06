"use client";
import React, { useEffect } from "react";

import { useCategory } from "@/context/category";
import CategoryForm from "./components/CategoryForm";
import CategoryList from "./components/CategoryList";

const page = () => {
  const { fetchCategories } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <>
      <CategoryForm />
      <div className="h-[1px] w-full bg-grey"></div>
      <CategoryList />
    </>
  );
};

export default page;
