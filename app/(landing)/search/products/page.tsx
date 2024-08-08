"use client";
import React, { Suspense } from "react";
import SearchResult from "./components/SearchResult";

const SearchProuctPage = () => {
  return (
    <main className="max-w-6xl mx-auto w-full p-3">
      <div className="flex justify-center flex-wrap w-full gap-3 mx-auto">
        <Suspense>
          <SearchResult />
        </Suspense>
      </div>
    </main>
  );
};

export default SearchProuctPage;
