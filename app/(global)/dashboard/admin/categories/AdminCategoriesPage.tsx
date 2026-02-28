"use client";

import { useState } from "react";
import { HiPlus, HiPencil, HiTrash, HiCheck, HiX, HiTag } from "react-icons/hi";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useAdminTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "@/hooks/use-admin-category";
import { AdminCategory, AdminTag } from "@/services/admin-category.service";

// ─── Inline editable row ──────────────────────────────────────────────────────

function CategoryRow({ category }: { category: AdminCategory }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: update, isPending: isUpdating } = useUpdateCategory();
  const { mutate: remove, isPending: isDeleting } = useDeleteCategory();

  const handleSave = () => {
    if (!name.trim() || name === category.name) {
      setEditing(false);
      return;
    }
    update({ id: category.id, name }, { onSuccess: () => setEditing(false) });
  };

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
      {editing ? (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setEditing(false);
            }}
            className="flex-1 h-8 px-3 text-sm border border-primary-300 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 transition-all"
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isUpdating ? (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiCheck className="text-sm" />
            )}
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setName(category.name);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <HiX className="text-sm" />
          </button>
        </>
      ) : (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">{category.name}</p>
            <p className="text-[11px] text-gray-400">
              /{category.slug} · {category._count.products} products ·{" "}
              {category.tags.length} tags
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-all"
            >
              <HiPencil className="text-sm" />
            </button>

            {confirmDelete ? (
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    remove(category.id);
                    setConfirmDelete(false);
                  }}
                  disabled={isDeleting}
                  className="h-8 px-2 text-[10px] font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="h-8 px-2 text-[10px] font-bold border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={category._count.products > 0}
                title={
                  category._count.products > 0
                    ? "Cannot delete — has products"
                    : "Delete"
                }
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <HiTrash className="text-sm" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Tag row ──────────────────────────────────────────────────────────────────

function TagRow({
  tag,
  categories,
}: {
  tag: AdminTag;
  categories: AdminCategory[];
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(tag.name);
  const [categoryId, setCategoryId] = useState(tag.categoryId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: update, isPending: isUpdating } = useUpdateTag();
  const { mutate: remove, isPending: isDeleting } = useDeleteTag();

  const handleSave = () => {
    if (!name.trim()) {
      setEditing(false);
      return;
    }
    update(
      { id: tag.id, name, categoryId },
      { onSuccess: () => setEditing(false) },
    );
  };

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
      {editing ? (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setEditing(false);
            }}
            className="flex-1 h-8 px-3 text-sm border border-primary-300 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 transition-all"
            autoFocus
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-8 px-2 text-xs border border-gray-200 rounded-xl bg-white outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isUpdating ? (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiCheck className="text-sm" />
            )}
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setName(tag.name);
              setCategoryId(tag.categoryId);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <HiX className="text-sm" />
          </button>
        </>
      ) : (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">{tag.name}</p>
            <p className="text-[11px] text-gray-400">
              /{tag.slug} · {tag.category.name} · {tag._count.products} products
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-all"
            >
              <HiPencil className="text-sm" />
            </button>
            {confirmDelete ? (
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    remove(tag.id);
                    setConfirmDelete(false);
                  }}
                  disabled={isDeleting}
                  className="h-8 px-2 text-[10px] font-bold bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="h-8 px-2 text-[10px] font-bold border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
              >
                <HiTrash className="text-sm" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
  const { data: catData, isLoading: catLoading } = useAdminCategories();
  const { data: tagData, isLoading: tagLoading } = useAdminTags();

  const categories = catData?.categories ?? [];
  const tags = tagData?.tags ?? [];

  // Add category form
  const [newCat, setNewCat] = useState("");
  const [showCatForm, setShowCatForm] = useState(false);
  const { mutate: createCat, isPending: isCreatingCat } = useCreateCategory();

  // Add tag form
  const [newTagName, setNewTagName] = useState("");
  const [newTagCatId, setNewTagCatId] = useState("");
  const [showTagForm, setShowTagForm] = useState(false);
  const { mutate: createTag, isPending: isCreatingTag } = useCreateTag();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-black text-gray-900">Categories & Tags</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage product taxonomy</p>
      </div>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900">Categories</h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg">
              {categories.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowCatForm((v) => !v)}
            className="flex items-center gap-1.5 h-8 px-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <HiPlus className="text-sm" /> Add
          </button>
        </div>

        {/* Add form */}
        {showCatForm && (
          <div className="flex items-center gap-2 px-5 py-3 bg-primary-50 border-b border-primary-100">
            <input
              type="text"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newCat.trim()) {
                  createCat(newCat, {
                    onSuccess: () => {
                      setNewCat("");
                      setShowCatForm(false);
                    },
                  });
                }
                if (e.key === "Escape") setShowCatForm(false);
              }}
              placeholder="Category name..."
              className="flex-1 h-8 px-3 text-sm bg-white border border-primary-300 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 transition-all"
              autoFocus
            />
            <button
              type="button"
              onClick={() =>
                createCat(newCat, {
                  onSuccess: () => {
                    setNewCat("");
                    setShowCatForm(false);
                  },
                })
              }
              disabled={isCreatingCat || !newCat.trim()}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isCreatingCat ? (
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <HiCheck className="text-sm" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowCatForm(false)}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <HiX className="text-sm" />
            </button>
          </div>
        )}

        {catLoading ? (
          <div className="divide-y divide-gray-50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 px-5 py-3 flex items-center gap-3">
                <div className="h-4 bg-gray-100 rounded flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <CategoryRow key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <HiTag className="text-3xl text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No categories yet</p>
          </div>
        )}
      </div>

      {/* ── Tags ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900">Tags</h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg">
              {tags.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowTagForm((v) => !v);
              setNewTagCatId(categories[0]?.id ?? "");
            }}
            disabled={categories.length === 0}
            className="flex items-center gap-1.5 h-8 px-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <HiPlus className="text-sm" /> Add
          </button>
        </div>

        {/* Add tag form */}
        {showTagForm && (
          <div className="flex items-center gap-2 px-5 py-3 bg-primary-50 border-b border-primary-100">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag name..."
              className="flex-1 h-8 px-3 text-sm bg-white border border-primary-300 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 transition-all"
              autoFocus
            />
            <select
              value={newTagCatId}
              onChange={(e) => setNewTagCatId(e.target.value)}
              className="h-8 px-2 text-xs bg-white border border-gray-200 rounded-xl outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                createTag(
                  { name: newTagName, categoryId: newTagCatId },
                  {
                    onSuccess: () => {
                      setNewTagName("");
                      setShowTagForm(false);
                    },
                  },
                )
              }
              disabled={isCreatingTag || !newTagName.trim() || !newTagCatId}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isCreatingTag ? (
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <HiCheck className="text-sm" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowTagForm(false)}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <HiX className="text-sm" />
            </button>
          </div>
        )}

        {tagLoading ? (
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 px-5 py-3 flex items-center gap-3">
                <div className="h-4 bg-gray-100 rounded flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        ) : tags.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {tags.map((tag) => (
              <TagRow key={tag.id} tag={tag} categories={categories} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <HiTag className="text-3xl text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No tags yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
