"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FC } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");
  pages.push(total);

  return pages;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const linkClass = (active: boolean) =>
    `flex items-center justify-center w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-150 ${
      active
        ? "bg-primary-600 text-white shadow-md shadow-primary-600/30"
        : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50"
    }`;

  const navClass = (enabled: boolean) =>
    `flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-150 ${
      enabled
        ? "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 cursor-pointer"
        : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
    }`;

  return (
    <nav
      className="flex justify-center items-center gap-1.5 w-full mt-10 mb-6"
      aria-label="Pagination"
    >
      {/* Prev */}
      {hasPrev ? (
        <Link
          href={`${pathname}?page=${currentPage - 1}`}
          className={navClass(true)}
          aria-label="Previous page"
        >
          <HiChevronLeft className="text-lg" />
        </Link>
      ) : (
        <span className={navClass(false)} aria-disabled="true">
          <HiChevronLeft className="text-lg" />
        </span>
      )}

      {/* Pages */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex items-center justify-center w-9 h-9 text-gray-400 text-sm"
          >
            ···
          </span>
        ) : (
          <Link
            key={page}
            href={`${pathname}?page=${page}`}
            className={linkClass(page === currentPage)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ),
      )}

      {/* Next */}
      {hasNext ? (
        <Link
          href={`${pathname}?page=${currentPage + 1}`}
          className={navClass(true)}
          aria-label="Next page"
        >
          <HiChevronRight className="text-lg" />
        </Link>
      ) : (
        <span className={navClass(false)} aria-disabled="true">
          <HiChevronRight className="text-lg" />
        </span>
      )}
    </nav>
  );
};

export default Pagination;
