import express from 'express';
import { createReview } from '../controllers/reviewController.js';

const router = express.Router();

// The frontend will send a POST request to '/reviews/:tourId' to create a new review
router.post('/:tourId', createReview);

export default router;