import { Suspense } from "react";
import FormResetPassword from "../components/FormResetPassword";

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-sm text-gray-500 mt-1">
          Choose a strong new password for your account
        </p>
      </div>

      {/* Form — wrapped in Suspense for useSearchParams */}
      <Suspense
        fallback={<div className="h-40 animate-pulse bg-gray-100 rounded-xl" />}
      >
        <FormResetPassword />
      </Suspense>
    </div>
  );
}
