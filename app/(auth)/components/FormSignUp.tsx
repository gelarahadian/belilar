"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { HiMail, HiLockClosed, HiUser } from "react-icons/hi";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";

// ─── Types ────────────────────────────────────────────────────────────────────

type SignUpFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// ─── API ──────────────────────────────────────────────────────────────────────

async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${process.env.API}register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res;
}

// ─── Validation Rules ─────────────────────────────────────────────────────────

const EMAIL_PATTERN = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Please enter a valid email address",
};

const PASSWORD_PATTERN = {
  value: /^(?=.*[A-Z]).{8,}$/,
  message: "Must be at least 8 characters and contain one uppercase letter",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FormSignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);

    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const res = await registerUser(fullName, data.email, data.password);

    if (!res.ok) {
      toast.error("Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    toast.success("Account created! Redirecting to login…");
    router.push("/sign-in");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1" noValidate>
        <Input
          id="firstName"
          label="First Name"
          placeholder="John"
          leftIcon={<HiUser />}
          required
          register={register}
          errors={errors}
        />
        <Input
          id="lastName"
          label="Last Name"
          placeholder="Doe"
          leftIcon={<HiUser />}
          register={register}
          errors={errors}
        />

      {/* Email */}
      <Input
        id="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        leftIcon={<HiMail />}
        helperText="We'll never share your email with anyone."
        required
        // pattern={EMAIL_PATTERN}
        register={register}
        errors={errors}
      />

      {/* Password */}
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        leftIcon={<HiLockClosed />}
        helperText="Min. 8 characters with at least one uppercase letter."
        required
        // pattern={PASSWORD_PATTERN}
        register={register}
        errors={errors}
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
            Creating account…
          </span>
        ) : (
          "Create Account"
        )}
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-gray-500 pt-1">
        Already have an account?{" "}
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