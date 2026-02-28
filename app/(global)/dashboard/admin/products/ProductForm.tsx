"use client";

import { useState } from "react";
import { HiCheck, HiX } from "react-icons/hi";
import { AdminProduct, ProductPayload } from "@/services/admin-product.service";
import ImageUploader from "./ImageUploader";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
}
interface Tag {
  id: string;
  name: string;
}

interface ProductFormProps {
  initial?: AdminProduct | null;
  categories: Category[];
  tags: Tag[];
  onSubmit: (payload: ProductPayload) => void;
  onCancel: () => void;
  isPending: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls =
  "w-full h-10 px-3.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 placeholder:text-gray-400 bg-white";

const textareaCls =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 placeholder:text-gray-400 resize-none bg-white";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
        {hint && (
          <span className="text-gray-400 font-normal ml-1">({hint})</span>
        )}
      </label>
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductForm({
  initial,
  categories,
  tags,
  onSubmit,
  onCancel,
  isPending,
}: ProductFormProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    price: initial?.price ? String(initial.price) : "",
    previousPrice: initial?.previousPrice ? String(initial.previousPrice) : "",
    brand: initial?.brand ?? "",
    stock:
      initial?.stock !== null && initial?.stock !== undefined
        ? String(initial.stock)
        : "",
    shipping:
      initial?.shipping !== null && initial?.shipping !== undefined
        ? String(initial.shipping)
        : "",
    color: initial?.color?.join(", ") ?? "",
    categoryId: initial?.categoryId ?? "",
    tagIds: initial?.tagIds ?? ([] as string[]),
    images:
      initial?.images ?? ([] as { public_id: string; secure_url: string }[]),
  });

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleTag = (tagId: string) =>
    setForm((f) => ({
      ...f,
      tagIds: f.tagIds.includes(tagId)
        ? f.tagIds.filter((id) => id !== tagId)
        : [...f.tagIds, tagId],
    }));

  const isValid =
    form.title &&
    form.description &&
    form.price &&
    form.brand &&
    form.categoryId;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      title: form.title,
      description: form.description,
      price: Number(form.price),
      previousPrice: form.previousPrice ? Number(form.previousPrice) : null,
      brand: form.brand,
      stock: form.stock !== "" ? Number(form.stock) : null,
      shipping: form.shipping !== "" ? Number(form.shipping) : null,
      color: form.color
        ? form.color
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
      categoryId: form.categoryId,
      tagIds: form.tagIds,
      images: form.images,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ── Images ────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-gray-900">Product Images</h2>
        <ImageUploader
          images={form.images}
          onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))}
        />
      </div>

      {/* ── Basic info ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-900">Basic Info</h2>

        <Field label="Title" required>
          <input
            type="text"
            value={form.title}
            onChange={set("title")}
            placeholder="Product title"
            className={inputCls}
          />
        </Field>

        <Field label="Description" required>
          <textarea
            value={form.description}
            onChange={set("description")}
            placeholder="Product description..."
            rows={4}
            className={textareaCls}
          />
        </Field>

        <Field label="Brand" required>
          <input
            type="text"
            value={form.brand}
            onChange={set("brand")}
            placeholder="Brand name"
            className={inputCls}
          />
        </Field>

        <Field label="Colors" hint="comma separated">
          <input
            type="text"
            value={form.color}
            onChange={set("color")}
            placeholder="Red, Blue, Black"
            className={inputCls}
          />
        </Field>
      </div>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-900">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (cents)" required hint="e.g. 9900 = $99.00">
            <input
              type="number"
              value={form.price}
              onChange={set("price")}
              placeholder="9900"
              min={0}
              className={inputCls}
            />
          </Field>
          <Field label="Previous Price (cents)" hint="for discount display">
            <input
              type="number"
              value={form.previousPrice}
              onChange={set("previousPrice")}
              placeholder="12900"
              min={0}
              className={inputCls}
            />
          </Field>
          <Field label="Stock">
            <input
              type="number"
              value={form.stock}
              onChange={set("stock")}
              placeholder="100"
              min={0}
              className={inputCls}
            />
          </Field>
          <Field label="Shipping (cents)">
            <input
              type="number"
              value={form.shipping}
              onChange={set("shipping")}
              placeholder="500"
              min={0}
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      {/* ── Category & Tags ───────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-900">Category & Tags</h2>

        <Field label="Category" required>
          <select
            value={form.categoryId}
            onChange={set("categoryId")}
            className={inputCls}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        {tags.length > 0 && (
          <Field label="Tags">
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`h-7 px-3 text-xs font-semibold rounded-lg border transition-all duration-150 ${
                    form.tagIds.includes(tag.id)
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </Field>
        )}
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 h-10 px-5 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-150"
        >
          <HiX className="text-sm" /> Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !isValid}
          className="flex items-center gap-1.5 h-10 px-5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <HiCheck className="text-base" />
          )}
          {initial ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </div>
  );
}
