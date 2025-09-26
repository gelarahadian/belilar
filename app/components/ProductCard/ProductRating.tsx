"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";
import Modal from "@/app/components/Modal";
import { Product, useProduct } from "@/context/product";
import { calculateAverageRating } from "@/lib/helpers";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Rating as RatingStarts } from "react-simple-star-rating";

interface ProductRatingProps {
  product: Product;
  leaveRating?: boolean;
}

const ProductRating: FC<ProductRatingProps> = ({
  product,
  leaveRating = true,
}) => {
  const { data: session, status } = useSession();
  const {
    showRatingModal,
    setShowRatingModal,
    currentRating,
    setCurrentRating,
    comment,
    setComment,
  } = useProduct();

  const [productRatings, setProductRatings] = useState(product.ratings || []);
  const [averageRating, setAverageRating] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      setAverageRating(calculateAverageRating(product.ratings));
    };
  }, [averageRating]);

  const submitRating = async () => {
    if (status !== "authenticated") {
      toast.error("Kamu harus login untung memberi ulasan");
      router.push(`/login?callbackUrl=${pathname}`);
      return;
    }

    try {
      const response = await fetch(`${process.env.API}/user/product/rating`, {
        method: "POST",
        body: JSON.stringify({
          productId: product?.id,
          rating: currentRating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal Memeberi kan Ulasan");
      }

      const data = await response.json();
      setProductRatings(data?.ratings);
      toast.success("Kamu Sudah Memberikan Ulasan");
      setShowRatingModal(false);
      setCurrentRating(0);
      setComment("");
      window.location.reload();
    } catch (err: any) {
      console.log(err.message);
      setShowRatingModal(false);
      setCurrentRating(0);
      setComment("");
      toast.error("Gagal Memeberi kan Ulasan");
    }
  };

  const existingRating =
    product.ratings &&
    product.ratings.find((rating) => rating.postedById === session?.user.id);

  // Catch Rating value
  const handleRating = (rate: number) => {
    setCurrentRating(rate);
    // other logic
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-secondaryText flex items-center space-x-2">
          <RatingStarts
            initialValue={averageRating}
            size={16}
            SVGclassName="inline-block"
            readonly
          />
          {product.ratings && product.ratings.length > 0 && (
            <span>({product.ratings.length})</span>
          )}
        </p>
        {leaveRating && (
          <p
            onClick={() => setShowRatingModal(true)}
            className="cursor-pointer "
          >
            {existingRating ? "edit ulasan" : "beri ulasan"}
          </p>
        )}
      </div>
      {showRatingModal && (
        <Modal onClose={() => setShowRatingModal(false)} label="Komen">
          <Input
            id="komen"
            placeholder="Beri Koment"
            value={comment}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setComment(e.target.value)
            }
          />
          <div className="flex justify-between">
            <RatingStarts
              SVGclassName="inline-block "
              onClick={handleRating}
              initialValue={currentRating}
            />
            <Button onClick={submitRating}>Kirim</Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProductRating;
