"use client";
import Modal from "@/app/components/Modal";
import { Product } from "@prisma/client";
import Image from "next/image";
import React, { FC, useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useProduct } from "@/context/product";

interface ProductImageProps {
  product: Product & { images: { secure_url: string; public_id: string }[] };
}

interface ImageProps {
  secure_url: string;
  public_id: string;
}

const ProductImage: FC<ProductImageProps> = ({ product }) => {
  const [images] = useState(product.images);

  const { imageModal, openImageModal, closeImageModal } = useProduct();

  let sliderRef = useRef<Slider | null>(null);
  const next = () => {
    sliderRef.current?.slickNext();
  };
  const previous = () => {
    sliderRef.current?.slickPrev();
  };
  var settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <div className=" flex items-center w-[full] h-[360px] relative">
        <div className="absolute w-full h-full">
          <Slider
            ref={(slider) => {
              sliderRef.current = slider;
            }}
            {...settings}
          >
            {images.map((image: ImageProps) => (
              <div
                key={image?.public_id || ""}
                className="w-full h-[360px] relative"
              >
                <Image
                  src={image.secure_url || ""}
                  alt={image.public_id}
                  fill
                  className="object-cover object-center"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="flex justify-between w-full z-10 absolute">
          <button onClick={previous} className="bg-white/50 py-4 px-2">
            <MdNavigateBefore />
          </button>
          <button onClick={next} className="bg-white/50 py-4 px-2">
            <MdNavigateNext />
          </button>
        </div>
      </div>
      <div className="flex my-3 space-x-3">
        {product.images.map((image: any, index: any) => (
          <div
            key={image.public_id}
            onClick={() => openImageModal(image)}
            className="w-[72px] h-[72px] relative hover:ring-2 ring-secondary transition-all duration-300"
          >
            <div className=""></div>
            <Image
              key={index}
              src={image.secure_url}
              alt={product.title}
              fill
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>
      {imageModal && (
        <Modal label="Gambar" onClose={closeImageModal}>
          <div className="w-full h-[420px] relative">
            <Image
              src={imageModal.secure_url || ""}
              alt={imageModal.public_id}
              fill
              className="object-cover object-center"
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProductImage;
