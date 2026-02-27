"use client";

import { useEffect, useState } from "react";
import { HiCheck, HiX } from "react-icons/hi";
import { Address, AddressPayload } from "@/services/address.service";

interface AddressFormProps {
  initial?: Address | null;
  onSubmit: (payload: AddressPayload) => void;
  onCancel: () => void;
  isPending: boolean;
}

const EMPTY: AddressPayload = {
  label: "",
  recipient: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  isDefault: false,
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full h-10 px-3.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 placeholder:text-gray-400";

export default function AddressForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
}: AddressFormProps) {
  const [form, setForm] = useState<AddressPayload>(
    initial
      ? {
          label: initial.label,
          recipient: initial.recipient,
          phone: initial.phone ?? "",
          line1: initial.line1,
          line2: initial.line2 ?? "",
          city: initial.city,
          state: initial.state,
          postal_code: initial.postal_code,
          country: initial.country,
          isDefault: initial.isDefault,
        }
      : EMPTY,
  );

  useEffect(() => {
    setForm(
      initial
        ? {
            label: initial.label,
            recipient: initial.recipient,
            phone: initial.phone ?? "",
            line1: initial.line1,
            line2: initial.line2 ?? "",
            city: initial.city,
            state: initial.state,
            postal_code: initial.postal_code,
            country: initial.country,
            isDefault: initial.isDefault,
          }
        : EMPTY,
    );
  }, [initial]);

  const set =
    (key: keyof AddressPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid =
    form.label &&
    form.recipient &&
    form.line1 &&
    form.city &&
    form.state &&
    form.postal_code &&
    form.country;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Label */}
        <Field label="Label" required>
          <input
            type="text"
            value={form.label}
            onChange={set("label")}
            placeholder='e.g. "Home", "Office"'
            className={inputCls}
          />
        </Field>

        {/* Recipient */}
        <Field label="Recipient Name" required>
          <input
            type="text"
            value={form.recipient}
            onChange={set("recipient")}
            placeholder="Full name"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Phone */}
      <Field label="Phone Number">
        <input
          type="tel"
          value={form.phone ?? ""}
          onChange={set("phone")}
          placeholder="+61 400 000 000"
          className={inputCls}
        />
      </Field>

      {/* Line 1 */}
      <Field label="Address Line 1" required>
        <input
          type="text"
          value={form.line1}
          onChange={set("line1")}
          placeholder="Street address"
          className={inputCls}
        />
      </Field>

      {/* Line 2 */}
      <Field label="Address Line 2">
        <input
          type="text"
          value={form.line2 ?? ""}
          onChange={set("line2")}
          placeholder="Apartment, suite, unit (optional)"
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        {/* City */}
        <Field label="City" required>
          <input
            type="text"
            value={form.city}
            onChange={set("city")}
            placeholder="City"
            className={inputCls}
          />
        </Field>

        {/* State */}
        <Field label="State / Province" required>
          <input
            type="text"
            value={form.state}
            onChange={set("state")}
            placeholder="State"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Postal code */}
        <Field label="Postal Code" required>
          <input
            type="text"
            value={form.postal_code}
            onChange={set("postal_code")}
            placeholder="Postal code"
            className={inputCls}
          />
        </Field>

        {/* Country */}
        <Field label="Country" required>
          <input
            type="text"
            value={form.country}
            onChange={set("country")}
            placeholder="Country"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Set as default */}
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <div
          onClick={() => setForm((f) => ({ ...f, isDefault: !f.isDefault }))}
          className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
            form.isDefault
              ? "bg-primary-600 border-primary-600"
              : "border-gray-300 group-hover:border-primary-400"
          }`}
        >
          {form.isDefault && <HiCheck className="text-white text-[10px]" />}
        </div>
        <span className="text-xs font-medium text-gray-600">
          Set as default address
        </span>
      </label>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 h-9 px-4 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-150"
        >
          <HiX className="text-sm" />
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit(form)}
          disabled={isPending || !isValid}
          className="flex items-center gap-1.5 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <HiCheck className="text-sm" />
          )}
          {initial ? "Save Changes" : "Add Address"}
        </button>
      </div>
    </div>
  );
}
