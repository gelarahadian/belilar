"use client";

import { useState } from "react";
import {
  HiPlus,
  HiTrash,
  HiX,
  HiCheck,
  HiTicket,
  HiChevronDown,
  HiChevronUp,
  HiClipboard,
  HiExclamation,
} from "react-icons/hi";
import {
  useAdminCoupons,
  useCreateAdminCoupon,
  useDeleteAdminCoupon,
  useAdminCoupon,
} from "@/hooks/use-admin-coupon";
import toast from "react-hot-toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isExpired(unix: number | null) {
  if (!unix) return false;
  return unix * 1000 < Date.now();
}

// ─── Coupon detail row (expandable) ──────────────────────────────────────────

function CouponRow({
  coupon,
  onDelete,
}: {
  coupon: any;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data, isFetching } = useAdminCoupon(expanded ? coupon.id : "");

  const expired = isExpired(coupon.redeem_by);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied!");
  };

  return (
    <div className="border-b border-gray-50 last:border-0">
      {/* Main row */}
      <div className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
        {/* Icon */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${expired ? "bg-gray-100" : "bg-primary-50"}`}
        >
          <HiTicket
            className={`text-sm ${expired ? "text-gray-400" : "text-primary-600"}`}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-gray-900">{coupon.name}</p>
            {expired && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-md">
                Expired
              </span>
            )}
            {!coupon.valid && !expired && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-50 text-red-500 rounded-md">
                Invalid
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            <span className="font-semibold text-primary-600">
              {coupon.percent_off
                ? `${coupon.percent_off}% off`
                : `$${((coupon.amount_off ?? 0) / 100).toFixed(2)} off`}
            </span>
            {" · "}
            {coupon.times_redeemed} used
            {coupon.max_redemptions && ` / ${coupon.max_redemptions} max`}
            {coupon.redeem_by && ` · expires ${formatDate(coupon.redeem_by)}`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            {expanded ? (
              <HiChevronUp className="text-sm" />
            ) : (
              <HiChevronDown className="text-sm" />
            )}
          </button>

          {confirmDelete ? (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  onDelete(coupon.id);
                  setConfirmDelete(false);
                }}
                className="h-8 px-2 text-[10px] font-bold bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="h-8 px-2 text-[10px] font-bold border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
            >
              <HiTrash className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded promo codes */}
      {expanded && (
        <div className="px-5 pb-4 space-y-2">
          {isFetching ? (
            <div className="h-8 bg-gray-100 rounded-xl animate-pulse" />
          ) : data?.promoCodes?.length ? (
            data.promoCodes.map((promo: any) => (
              <div
                key={promo.id}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl"
              >
                <code className="flex-1 text-xs font-bold text-gray-700 font-mono">
                  {promo.code}
                </code>
                <span className="text-[10px] text-gray-400">
                  {promo.times_redeemed} used
                  {promo.max_redemptions && ` / ${promo.max_redemptions}`}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${promo.active ? "bg-primary-50 text-primary-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {promo.active ? "Active" : "Inactive"}
                </span>
                <button
                  type="button"
                  onClick={() => copyCode(promo.code)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                >
                  <HiClipboard className="text-xs" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">
              No promotion codes found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Create coupon form ───────────────────────────────────────────────────────

function CreateCouponForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "percent" as "percent" | "fixed",
    percent_off: "",
    amount_off: "",
    max_redemptions: "",
    expires_at: "",
  });

  const { mutate: create, isPending } = useCreateAdminCoupon();

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const isValid =
    form.name.trim() &&
    form.code.trim() &&
    (form.type === "percent" ? !!form.percent_off : !!form.amount_off);

  const handleSubmit = () => {
    if (!isValid) return;
    create(
      {
        name: form.name,
        code: form.code.toUpperCase(),
        type: form.type,
        percent_off:
          form.type === "percent" ? Number(form.percent_off) : undefined,
        amount_off: form.type === "fixed" ? Number(form.amount_off) : undefined,
        max_redemptions: form.max_redemptions
          ? Number(form.max_redemptions)
          : undefined,
        expires_at: form.expires_at || undefined,
      },
      { onSuccess: onClose },
    );
  };

  const inputCls =
    "w-full h-10 px-3.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all placeholder:text-gray-400";

  return (
    <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">New Coupon</h3>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <HiX className="text-sm" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Name */}
        <div className="col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Coupon Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Summer Sale"
            className={inputCls}
          />
        </div>

        {/* Code */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Code <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.code}
            onChange={(e) =>
              setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
            }
            placeholder="SUMMER20"
            className={`${inputCls} font-mono uppercase`}
          />
        </div>

        {/* Type toggle */}
        <div className="col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Discount Type <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            {(["percent", "fixed"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    type: t,
                    percent_off: "",
                    amount_off: "",
                  }))
                }
                className={`h-9 px-4 text-xs font-bold rounded-xl border transition-all duration-150 ${
                  form.type === t
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                }`}
              >
                {t === "percent" ? "Percentage %" : "Fixed Amount $"}
              </button>
            ))}
          </div>
        </div>

        {/* Discount value */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">
            {form.type === "percent" ? "Discount %" : "Amount Off (cents)"}
            <span className="text-red-400"> *</span>
          </label>
          <div className="relative">
            {form.type === "percent" ? (
              <>
                <input
                  type="number"
                  value={form.percent_off}
                  onChange={set("percent_off")}
                  placeholder="20"
                  min={1}
                  max={100}
                  className={`${inputCls} pr-8`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">
                  %
                </span>
              </>
            ) : (
              <>
                <input
                  type="number"
                  value={form.amount_off}
                  onChange={set("amount_off")}
                  placeholder="1000"
                  min={1}
                  className={`${inputCls} pl-7`}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">
                  $
                </span>
              </>
            )}
          </div>
          {form.type === "fixed" && (
            <p className="text-[10px] text-gray-400">
              Enter in cents — e.g. 1000 = $10.00
            </p>
          )}
        </div>

        {/* Max redemptions */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Max Uses{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="number"
            value={form.max_redemptions}
            onChange={set("max_redemptions")}
            placeholder="100"
            min={1}
            className={inputCls}
          />
        </div>

        {/* Expiry */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Expiry Date{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            value={form.expires_at}
            onChange={set("expires_at")}
            min={new Date().toISOString().split("T")[0]}
            className={inputCls}
          />
        </div>
      </div>

      {/* Preview */}
      {form.code && (form.percent_off || form.amount_off) && (
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-primary-200 rounded-xl">
          <HiTicket className="text-primary-600 flex-shrink-0" />
          <p className="text-xs text-gray-600">
            Code{" "}
            <span className="font-mono font-bold text-gray-900">
              {form.code.toUpperCase()}
            </span>{" "}
            gives{" "}
            <span className="font-bold text-primary-600">
              {form.type === "percent"
                ? `${form.percent_off}% off`
                : `$${(Number(form.amount_off) / 100).toFixed(2)} off`}
            </span>
            {form.max_redemptions && ` · max ${form.max_redemptions} uses`}
            {form.expires_at &&
              ` · expires ${new Date(form.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
          </p>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="h-9 px-4 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !isValid}
          className="flex items-center gap-1.5 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <HiCheck className="text-sm" />
          )}
          Create Coupon
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCouponsPage() {
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useAdminCoupons();
  const { mutate: remove } = useDeleteAdminCoupon();

  const coupons = data?.coupons ?? [];
  const active = coupons.filter((c) => c.valid && !isExpired(c.redeem_by));
  const expired = coupons.filter((c) => !c.valid || isExpired(c.redeem_by));

  return (
    <div className="space-y-5 max-w-2xl">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Coupons</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {coupons.length} coupons · managed via Stripe
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <HiPlus className="text-base" /> Add Coupon
        </button>
      </div>

      {/* ── Create form ───────────────────────────────────────────────────── */}
      {showForm && <CreateCouponForm onClose={() => setShowForm(false)} />}

      {/* ── Active coupons ────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <div className="w-1 h-5 rounded-full bg-primary-500" />
          <h2 className="text-sm font-bold text-gray-900">Active</h2>
          <span className="text-xs font-bold px-2 py-0.5 bg-primary-50 text-primary-600 rounded-lg">
            {active.length}
          </span>
        </div>

        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 px-5 flex items-center">
                <div className="h-4 bg-gray-100 rounded flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        ) : active.length > 0 ? (
          active.map((c) => (
            <CouponRow key={c.id} coupon={c} onDelete={remove} />
          ))
        ) : (
          <div className="py-10 text-center">
            <HiTicket className="text-3xl text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No active coupons</p>
          </div>
        )}
      </div>

      {/* ── Expired / invalid coupons ─────────────────────────────────────── */}
      {expired.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <div className="w-1 h-5 rounded-full bg-gray-300" />
            <h2 className="text-sm font-bold text-gray-900">
              Expired / Inactive
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg">
              {expired.length}
            </span>
          </div>
          {expired.map((c) => (
            <CouponRow key={c.id} coupon={c} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
