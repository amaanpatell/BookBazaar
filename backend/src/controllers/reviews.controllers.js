import { Review } from "../models/review.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const addReview = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user._id;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    throw new ApiError(400, "Rating and comment are required");
  }
  const existingReview = await Review.findOne({
    bookId,
    userId,
  });

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this book");
  }

  const newReview = await Review.create({
    bookId,
    userId,
    rating,
    comment,
  });

  if (!newReview) {
    throw new ApiError(500, "Failed to add review");
  }
  res
    .status(201)
    .json(new ApiResponse(201, newReview, "Review added successfully"));
});

export const getReviewsByBookId = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  if (!bookId) {
    throw new ApiError(400, "Book ID is required");
  }

  const reviews = await Review.find({ bookId }).populate(
    "userId",
    "name email"
  );

  if (!reviews || reviews.length === 0) {
    throw new ApiError(404, "No reviews found for this book");
  }

  res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user?._id;

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required");
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to delete this review");
  }

  await Review.findByIdAndDelete(reviewId);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully"));
});
