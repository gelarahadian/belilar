"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import toast from "react-hot-toast";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";

export default function FormLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("redirected") === "true") {
      toast.error("Please login first.");
    }
  }, [searchParams]);

  const handleSubmit = async (formData: FormData) => {
    flushSync(() => setLoading(true));

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log(email, password);

    // Step 1: Validasi via custom API
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInRes?.error) {
      toast.error("Invalid email or password");
      setLoading(false);
      return;
    }

    toast.success("Login Success");
    router.push("/");
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Email */}
      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        placeholder="user@gmail.com"
        autoComplete="email"
        required
      />

      {/* Password */}
      <div className="space-y-1">
        <Input
          label="Password"
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="accent-primary-600 w-3.5 h-3.5"
          />
          <span className="text-xs text-gray-500 select-none">
            Show Password
          </span>
        </label>
      </div>

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="accent-primary-600 w-3.5 h-3.5"
          />
          <span className="text-xs text-gray-500 select-none">Remember Me</span>
        </label>
        <Link
          href="/forgot-password"
          className="text-xs font-semibold text-secondary-600 hover:text-secondary-700 hover:underline transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold py-2.5 rounded-xl transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          "Sign In"
        )}
      </Button>

      {/* Sign-up link */}
      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="font-bold text-secondary-600 hover:text-secondary-700 hover:underline transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
