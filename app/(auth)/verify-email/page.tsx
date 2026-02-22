import { Suspense } from "react";
import FormVerifyOtp from "../components/FormVerifyOTP";

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter the verification code we sent you
        </p>
      </div>

      {/* OTP Form — wrapped in Suspense for useSearchParams */}
      <Suspense
        fallback={<div className="h-40 animate-pulse bg-gray-100 rounded-xl" />}
      >
        <FormVerifyOtp />
      </Suspense>
    </div>
  );
}
