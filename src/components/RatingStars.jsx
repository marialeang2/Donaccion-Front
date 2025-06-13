import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStars = ({
  rating,
  onRatingChange,
  size = "md",
  showValue = true,
}) => {
  const sizeClasses = {
    sm: "small",
    md: "",
    lg: "fs-5",
  };

  const renderStar = (index) => {
    const starValue = index + 1;
    const className = `text-warning ${sizeClasses[size]}`;

    if (onRatingChange) {
      // Interactive stars
      return (
        <span
          key={index}
          onClick={() => onRatingChange(starValue)}
          style={{ cursor: "pointer" }}
          className={className}
          data-testid="star-clickable"
          data-state={rating >= starValue ? "filled" : "empty"}
        >
          {rating >= starValue ? <FaStar /> : <FaRegStar />}
        </span>
      );
    } else {
      // Display-only stars
      if (rating >= starValue) {
        return (
          <FaStar
            key={index}
            className={className}
            data-testid="star-icon"
            data-state="filled"
          />
        );
      } else if (rating >= starValue - 0.5) {
        return (
          <FaStarHalfAlt
            key={index}
            className={className}
            data-testid="star-icon"
            data-state="half"
          />
        );
      } else {
        return (
          <FaRegStar
            key={index}
            className={className}
            data-testid="star-icon"
            data-state="empty"
          />
        );
      }
    }
  };

  return (
    <div className="d-inline-flex align-items-center">
      {[0, 1, 2, 3, 4].map(renderStar)}
      {showValue && (
        <span className="ms-2 text-muted small">({rating.toFixed(1)}/5)</span>
      )}
    </div>
  );
};

export default RatingStars;
