"use client";
import React, { Suspense } from "react";
import SearchResult from "./components/SearchResult";

const SearchProuctPage = () => {
  return (
    <main className="max-w-6xl mx-auto w-full p-3">
      <Suspense>
        <SearchResult />
      </Suspense>
    </main>
  );
};

export default SearchProuctPage;
