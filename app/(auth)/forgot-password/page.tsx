"use client";

import FormForgotPassword from "../components/FormForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-sm text-gray-500 mt-1">
          No worries — we'll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <FormForgotPassword />
    </div>
  );
}
