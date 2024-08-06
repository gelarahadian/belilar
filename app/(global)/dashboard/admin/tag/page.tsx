"use client";
import React, { useEffect } from "react";
import FormTag from "./components/TagForm";
import { useTag } from "@/context/tag";
import TagList from "./components/TagList";

const page = () => {
  const { tags, fetchTags } = useTag();

  useEffect(() => {
    fetchTags();
  }, []);
  return (
    <>
      <FormTag />
      <div className="h-[1px] w-full bg-grey"></div>
      <TagList />
    </>
  );
};

export default page;
