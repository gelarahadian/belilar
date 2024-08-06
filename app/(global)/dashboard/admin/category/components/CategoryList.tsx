import Label from "@/app/components/Label";
import { useCategory } from "@/context/category";
import React from "react";

const CategoryList = () => {
  const { categories, setValue } = useCategory();

  const handleClick = (name: string, id: string) => {
    setValue("name", name);
    setValue("id", id);
  };
  console.log(categories);
  return (
    <ul className="flex justify-center flex-wrap space-x-3 mt-3 ">
      {categories.map((category) => (
        <Label
          key={category.id}
          onClick={() => handleClick(category.name, category.id)}
        >
          {category.name}
        </Label>
      ))}
    </ul>
  );
};

export default CategoryList;
