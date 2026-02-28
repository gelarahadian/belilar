"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { HiPlus, HiTrash, HiPhotograph } from "react-icons/hi";
import { uploadImage, deleteImage } from "@/services/admin-product.service";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  images: { public_id: string; secure_url: string }[];
  onChange: (images: { public_id: string; secure_url: string }[]) => void;
}

export default function ImageUploader({
  images,
  onChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);

    try {
      const uploads = await Promise.all(
        Array.from(files).map((file) => {
          return new Promise<{ public_id: string; secure_url: string }>(
            (resolve, reject) => {
              const reader = new FileReader();
              reader.onload = async () => {
                try {
                  const result = await uploadImage(reader.result as string);
                  resolve(result);
                } catch (err) {
                  reject(err);
                }
              };
              reader.readAsDataURL(file);
            },
          );
        }),
      );
      onChange([...images, ...uploads]);
      toast.success(
        `${uploads.length} image${uploads.length > 1 ? "s" : ""} uploaded!`,
      );
    } catch {
      toast.error("Failed to upload one or more images.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (public_id: string) => {
    try {
      await deleteImage(public_id);
      onChange(images.filter((img) => img.public_id !== public_id));
    } catch {
      toast.error("Failed to remove image.");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {/* Existing images */}
        {images.map((img) => (
          <div
            key={img.public_id}
            className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group"
          >
            <Image
              src={img.secure_url}
              alt="Product image"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(img.public_id)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            >
              <HiTrash className="text-white text-xl" />
            </button>
          </div>
        ))}

        {/* Upload button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50 flex flex-col items-center justify-center gap-1 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <span className="w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
          ) : (
            <>
              <HiPlus className="text-xl text-gray-400" />
              <span className="text-[10px] font-semibold text-gray-400">
                Add Image
              </span>
            </>
          )}
        </button>
      </div>

      {images.length === 0 && !uploading && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <HiPhotograph className="text-sm" />
          No images added yet
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
