"use client";

import { useRouter } from "next/navigation";

export default function AuthButton() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => router.push("/sign-up")}
        className="h-9 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary/10 transition-all duration-150"
      >
        Sign Up
      </button>
      <button
        type="button"
        onClick={() => router.push("/sign-in")}
        className="h-9 px-4 rounded-xl bg-primary/60 hover:bg-primary/70 text-white text-sm font-bold transition-colors duration-150 shadow-md shadow-primary/25 hover:shadow-primary/40"
      >
        Sign In
      </button>
    </div>
  );
}
