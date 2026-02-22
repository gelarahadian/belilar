"use client";

import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  HiLockClosed,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";
import { getStrength } from "@/lib/getStrength";

// ─── Validation ───────────────────────────────────────────────────────────────

const PASSWORD_PATTERN = {
  value: /^(?=.*[A-Z]).{8,}$/,
  message: "Must be at least 8 characters and contain one uppercase letter",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FormResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const watchedPassword = watch("password", "");
  const strength = getStrength(watchedPassword);

  // Guard: no token in URL
  useEffect(() => {
    if (!token) setTokenInvalid(true);
  }, [token]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: data.password }),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message ?? "Something went wrong. Please try again.");
      if (res.status === 400) setTokenInvalid(true);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/sign-in"), 3000);
  };

  // ── Invalid / expired token ──────────────────────────────────────────────────
  if (tokenInvalid) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <HiExclamationCircle className="text-4xl text-red-400" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-base">
            Link Invalid or Expired
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            This password reset link is no longer valid.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors duration-150"
        >
          Request a New Link
        </Link>
      </div>
    );
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
          <HiCheckCircle className="text-4xl text-primary-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-base">Password Reset!</h3>
          <p className="text-sm text-gray-500 mt-1">
            Your password has been updated. Redirecting you to sign in…
          </p>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1" noValidate>
      {/* New password */}
      <Input
        id="password"
        label="New Password"
        type="password"
        placeholder="••••••••"
        leftIcon={<HiLockClosed />}
        required
        register={register}
        errors={errors}
        validation={{
          required: "Password is required",
          validate: (val: string) =>
            val === watchedPassword || "Passwords do not match"
        , pattern: PASSWORD_PATTERN}}
      />

      {/* Password strength bar */}
      {watchedPassword.length > 0 && (
        <div className="space-y-1 pb-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i <= strength.score ? strength.color : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          {strength.label && (
            <p
              className={`text-xs font-semibold ${
                strength.score <= 2
                  ? "text-red-400"
                  : strength.score === 3
                    ? "text-secondary-500"
                    : "text-primary-600"
              }`}
            >
              {strength.label}
            </p>
          )}
        </div>
      )}

      {/* Confirm password */}
      <Input
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        leftIcon={<HiLockClosed />}
        required
        register={register}
        errors={errors}
        validation={{validate:(val: string) =>
          val === watchedPassword || "Passwords do not match"
        }}
      />

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold py-2.5 rounded-xl transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Resetting…
          </span>
        ) : (
          "Reset Password"
        )}
      </Button>

      <p className="text-center text-sm text-gray-500 pt-1">
        Remember your password?{" "}
        <Link
          href="/sign-in"
          className="font-bold text-secondary-600 hover:text-secondary-700 hover:underline transition-colors"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
