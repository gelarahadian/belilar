"use client";
import { Rating as PrismaRating, User } from "@prisma/client";
import React, { FC } from "react";
import { Rating } from "react-simple-star-rating";
import RatingDistribution from "./RatingDistribution";

interface Rating extends PrismaRating {
  postedBy: User;
}

interface UserReviewsProps {
  reviews?: Rating[];
}

const UserReviews: FC<UserReviewsProps> = ({ reviews }) => {
  return (
    <>
      {reviews && reviews?.length > 0 ? (
        <>
          <RatingDistribution reviews={reviews} />

          <ul className="space-y-3">
            {reviews?.map((review) => (
              <li key={review.id} className="p-6 bg-primary shadow-md rounded">
                <div>
                  <p>
                    <strong>{review.postedBy.name}</strong>
                  </p>
                  <Rating
                    initialValue={review.rating}
                    SVGclassName="inline-block"
                    size={16}
                    readonly
                  />
                  {review?.comment && <p>{review?.comment}</p>}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Belum ada ulasan yang diterima</p>
      )}
    </>
  );
};

export default UserReviews;
