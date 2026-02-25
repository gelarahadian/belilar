"use client";

import Image from "next/image";
import { FC, useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { HiZoomIn } from "react-icons/hi";
import { Product } from "@prisma/client";
import Modal from "@/app/components/Modal";
import { useProduct } from "@/context/product";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageItem {
  secure_url: string;
  public_id: string;
}

interface ProductImageProps {
  product: Product & { images: ImageItem[] };
}

// ─── Component ────────────────────────────────────────────────────────────────

const ProductImage: FC<ProductImageProps> = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { imageModal, openImageModal, closeImageModal } = useProduct();
  const sliderRef = useRef<Slider | null>(null);

  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_: number, next: number) => setActiveIndex(next),
  };

  const goTo = (index: number) => {
    sliderRef.current?.slickGoTo(index);
    setActiveIndex(index);
  };

  return (
    <div className="space-y-3">
      {/* ── Main Slider ──────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
        <Slider
          ref={(s) => {
            sliderRef.current = s;
          }}
          {...settings}
        >
          {product.images.map((image) => (
            <div key={image.public_id} className="relative w-full h-[400px]">
              <Image
                src={image.secure_url}
                alt={image.public_id}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          ))}
        </Slider>

        {/* Prev / Next */}
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white rounded-xl shadow-sm border border-gray-100 text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200"
          aria-label="Previous image"
        >
          <MdNavigateBefore className="text-lg" />
        </button>
        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white rounded-xl shadow-sm border border-gray-100 text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200"
          aria-label="Next image"
        >
          <MdNavigateNext className="text-lg" />
        </button>

        {/* Zoom trigger */}
        <button
          onClick={() => openImageModal(product.images[activeIndex])}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
          aria-label="Zoom image"
        >
          <HiZoomIn className="text-sm" />
        </button>

        {/* Dot indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {product.images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-200 ${
                i === activeIndex
                  ? "w-4 h-1.5 bg-primary-600"
                  : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Thumbnails ───────────────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {product.images.map((image, index) => (
          <button
            key={image.public_id}
            onClick={() => goTo(index)}
            className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-150 ${
              index === activeIndex
                ? "border-primary-500 shadow-sm shadow-primary-500/20"
                : "border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={image.secure_url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover object-center"
            />
          </button>
        ))}
      </div>

      {/* ── Zoom Modal ───────────────────────────────────────────────────────── */}
      {imageModal && (
        <Modal label="Image Preview" onClose={closeImageModal}>
          <div className="w-full h-[520px] relative rounded-xl overflow-hidden">
            <Image
              src={imageModal.secure_url}
              alt={imageModal.public_id}
              fill
              className="object-contain"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProductImage;
