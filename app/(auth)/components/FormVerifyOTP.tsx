"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiCheckCircle, HiMail } from "react-icons/hi";
import Link from "next/link";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function FormVerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Countdown timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ── Auto-submit when all digits filled ──────────────────────────────────────
  useEffect(() => {
    const code = otp.join("");
    if (code.length === OTP_LENGTH && !otp.includes("")) {
      handleVerify(code);
    }
  }, [otp]);

  // ── Input handlers ───────────────────────────────────────────────────────────
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const digit = value.slice(-1); // take last char if pasted single digit
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!paste) return;
    const newOtp = [...Array(OTP_LENGTH).fill("")];
    paste.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(paste.length, OTP_LENGTH - 1)]?.focus();
  };

  // ── Verify ───────────────────────────────────────────────────────────────────
  const handleVerify = async (code: string) => {
    if (loading) return;
    setLoading(true);

    const res = await fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: code }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message ?? "Invalid code. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setLoading(false);
      return;
    }

    setVerified(true);
    setLoading(false);
    setTimeout(() => router.push("/sign-in"), 2500);
  };

  // ── Resend ───────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);

    const res = await fetch("/api/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message ?? "Failed to resend code.");
      return;
    }

    toast.success("A new code has been sent to your email.");
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  };

  // ── Success state ────────────────────────────────────────────────────────────
  if (verified) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
          <HiCheckCircle className="text-4xl text-primary-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-base">Email Verified!</h3>
          <p className="text-sm text-gray-500 mt-1">
            Redirecting you to sign in…
          </p>
        </div>
      </div>
    );
  }

  // ── Form state ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Icon + description */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
          <HiMail className="text-2xl text-primary-500" />
        </div>
        <p className="text-sm text-gray-500">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-gray-700">{email}</span>.
          <br />
          Enter it below to verify your account.
        </p>
      </div>

      {/* OTP input boxes */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={loading}
            className={`
              w-11 h-13 text-center text-xl font-bold rounded-xl border-2 outline-none
              transition-all duration-150 caret-transparent
              ${digit ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 bg-white text-gray-800"}
              focus:border-primary-500 focus:ring-4 focus:ring-primary-100
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />
        ))}
      </div>

      {/* Manual submit (in case auto-submit didn't trigger) */}
      <button
        type="button"
        disabled={loading || otp.includes("")}
        onClick={() => handleVerify(otp.join(""))}
        className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold py-2.5 rounded-xl transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Verifying…
          </span>
        ) : (
          "Verify Email"
        )}
      </button>

      {/* Resend */}
      <p className="text-center text-sm text-gray-500">
        Didn't receive the code?{" "}
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="font-bold text-secondary-600 hover:text-secondary-700 hover:underline transition-colors"
          >
            Resend
          </button>
        ) : (
          <span className="text-gray-400">
            Resend in{" "}
            <span className="font-semibold text-gray-600 tabular-nums">
              {countdown}s
            </span>
          </span>
        )}
      </p>

      <p className="text-center text-sm text-gray-500">
        Wrong email?{" "}
        <Link
          href="/sign-up"
          className="font-bold text-secondary-600 hover:underline transition-colors"
        >
          Go back
        </Link>
      </p>
    </div>
  );
}
