"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import FormLogin from "../components/FormLogin";

const GOOGLE_ICON = "/google-color-svgrepo.svg";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-sm text-gray-500 mt-1">
          Sign in to your Belilar account
        </p>
      </div>

      {/* Credentials Form */}
      <FormLogin />

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-400 tracking-widest">
          OR
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google SSO */}
      <button
        type="button"
        onClick={() => signIn("google")}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150"
      >
        <Image src={GOOGLE_ICON} width={20} height={20} alt="" />
        Continue With Google
      </button>
    </div>
  );
}
