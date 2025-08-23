import express from "express";
import { createReview, editReview, deleteReview } from "../controllers/reviewController.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/:tourId", verifyUser, createReview);
router.put("/:reviewId", verifyUser, editReview);
router.delete("/:reviewId", verifyUser, deleteReview);


export default router;