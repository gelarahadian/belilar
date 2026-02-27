import { calculateAverageRating } from "@/lib/helpers";
import { Review } from "@/services/review.service";
import React, { FC } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { Rating } from "react-simple-star-rating";

interface RatingDistributionProps {
  reviews: Review[]; // Array of reviews with fields: rating, userId, productId, createdAt, updatedAt, user (user object with fields: id, name, avatar)
}

const RatingDistribution: FC<RatingDistributionProps> = ({ reviews }) => {
  const distribution: Record<number, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  let totalReview = 0;

  reviews.forEach((review) => {
    distribution[review.rating]++;
    totalReview++;
  });

  const ratingIcons = Object.keys(distribution).map((rating) => {
    const count = distribution[parseInt(rating)];
    let percentace: string | number = ((count / totalReview) * 100).toFixed(2);
    percentace =
      parseFloat(percentace) === parseInt(percentace)
        ? parseInt(percentace)
        : percentace;

    const starIcons = Array.from({ length: parseInt(rating) }, (_, index) => (
      <FaStar key={index} className="text-yellow-500" />
    ));

    const emptyStarIcons = Array.from(
      {
        length: 5 - parseInt(rating),
      },
      (_, index) => <FaRegStar key={index} />
    );

    return (
      <div className="flex space-x-3">
        <div key={rating}>
          <progress value={percentace} max={100} />
        </div>
        <div className="flex">
          {starIcons} {emptyStarIcons} {percentace}%
        </div>
      </div>
    );
  });

  return (
    <div className="flex items-center max-w-3xl mx-auto">
      <div className="">
        <div className="text-center">
          <p className="text-9xl">
            <strong>{calculateAverageRating(reviews)?.toFixed(1)}</strong>
          </p>
          <Rating
            initialValue={calculateAverageRating(reviews)}
            SVGclassName="inline-block"
            readonly
          />
          <p>Ulasan Produk</p>
        </div>
      </div>
      <div className="flex-1 flex justify-center ">
        <div>{ratingIcons.reverse()}</div>
      </div>
    </div>
  );
};

export default RatingDistribution;
