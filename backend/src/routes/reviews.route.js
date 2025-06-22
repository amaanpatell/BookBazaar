import { Router } from "express";
import {
  addReview,
  deleteReview,
  getReviewsByBookId,
} from "../controllers/reviews.controllers.js";
import { verifyUser } from "../middlewares/auth.middlewares.js";
import { verifyApiKey } from "../middlewares/apiKey.middlewares.js";

const reviewRoutes = Router();

reviewRoutes.post("/:bookId", verifyUser, verifyApiKey, addReview);

reviewRoutes.get("/:bookId", verifyUser, verifyApiKey, getReviewsByBookId);

reviewRoutes.delete("/:reviewId", verifyUser, verifyApiKey, deleteReview);

export default reviewRoutes;
