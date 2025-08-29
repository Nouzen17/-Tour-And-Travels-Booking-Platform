import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// The frontend will send a POST request to '/bookings' to create a new booking
// Protected route - requires authentication
router.post("/", verifyToken, createBooking);

export default router;
