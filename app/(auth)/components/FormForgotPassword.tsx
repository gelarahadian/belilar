"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";
import { HiMail, HiArrowLeft, HiCheckCircle } from "react-icons/hi";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_PATTERN = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Please enter a valid email address",
};

// ─── API ──────────────────────────────────────────────────────────────────────

async function requestPasswordReset(email: string) {
  const res = await fetch(`${process.env.API}forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FormForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);

    const res = await requestPasswordReset(data.email);

    if (!res.ok) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setSentEmail(data.email);
    setSubmitted(true);
    setLoading(false);
  };

  // ── Success State ────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
          <HiCheckCircle className="text-4xl text-primary-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-base">
            Check your inbox
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            We've sent a password reset link to{" "}
            <span className="font-semibold text-gray-700">{sentEmail}</span>.
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Didn't receive it? Check your spam folder or{" "}
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-secondary-600 font-semibold hover:underline"
          >
            try again
          </button>
          .
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors mt-2"
        >
          <HiArrowLeft className="text-base" />
          Back to Sign In
        </Link>
      </div>
    );
  }

  // ── Form State ───────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1" noValidate>
      <Input
        id="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        leftIcon={<HiMail />}
        helperText="We'll send a password reset link to this address."
        required
        validation={{ pattern: EMAIL_PATTERN }}
        register={register}
        errors={errors}
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold py-2.5 rounded-xl transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Sending link…
          </span>
        ) : (
          "Send Reset Link"
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
