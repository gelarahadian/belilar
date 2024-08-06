"use client";
import { usePathname } from "next/navigation";
import React from "react";

const Title = () => {
  const pathName = usePathname();
  const wordAfterAdmin = pathName.split("/")[3];

  const splitText = wordAfterAdmin.split("-");

  let title: string | string[] =
    wordAfterAdmin.charAt(0).toUpperCase() + wordAfterAdmin.slice(1);

  if (splitText.length > 1) {
    title = splitText.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    title = title.join(" ");
  }

  return <h3 className="mb-3 text-2xl font-medium">{title}</h3>;
};

export default Title;
