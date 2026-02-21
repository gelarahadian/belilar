"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import FormSignUp from "../components/FormSignUp";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
        <p className="text-sm text-gray-500 mt-1">
          Join Belilar and start shopping today
        </p>
      </div>

      {/* Sign-up Form */}
      <FormSignUp />

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
        <Image src="/google-color-svgrepo.svg" width={20} height={20} alt="" />
        Continue with Google
      </button>
    </div>
  );
}
