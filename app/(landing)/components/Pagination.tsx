"use client";
import { usePathname } from "next/navigation";
import React, { FC } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const pathname = usePathname();

  return (
    <nav className="flex justify-center w-full">
      <ul className="flex flex-wrap mx-auto space-x-3">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          const active = currentPage === page;
          return (
            <li
              key={page}
              className={`flex justify-center items-center text-lg ${
                active ? "bg-secondary text-primary" : "border-secondary"
              } w-12 h-12 text-center bg-primary shadow-md rounded-full`}
            >
              <a href={`${pathname}?page=${page}`}>{page}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Pagination;
