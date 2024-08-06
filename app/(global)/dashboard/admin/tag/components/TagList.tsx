import Label from "@/app/components/Label";
import Info from "@/app/components/Label";
import { useTag } from "@/context/tag";
import React from "react";

const TagList = () => {
  const { tags, setValue, watch } = useTag();

  const handleClick = (name: string, id: string, categoryId: string) => {
    setValue("name", name);
    setValue("categoryId", categoryId);
    setValue("id", id);
  };
  return (
    <ul className="flex justify-center flex-wrap space-x-3 mt-3 ">
      {tags.map((tag) => (
        <Label onClick={() => handleClick(tag.name, tag.id, tag.categoryId)}>
          {tag.name}
        </Label>
      ))}
    </ul>
  );
};

export default TagList;
