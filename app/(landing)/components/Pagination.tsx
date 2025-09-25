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
    <nav className="flex justify-center w-full mt-3">
      <ul className="flex flex-wrap mx-auto space-x-3">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          const active = currentPage === page;
          return (
            <a href={`${pathname}?page=${page}`}>
              <li
                key={page}
                className={`flex justify-center items-center text-sm ${
                  active ? "bg-secondary text-white" : "border-secondary"
                } w-8 h-6 text-center bg-primary shadow-md`}
              >
                {page}
              </li>
            </a>
          );
        })}
      </ul>
    </nav>
  );
};

export default Pagination;
