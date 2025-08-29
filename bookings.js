import express from "express";
import {
  createBooking,
  getAllBooking,
  getBooking,
} from "../controllers/bookingController.js";   // ✅ fixed path

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// only logged-in users can create a booking
router.post("/", verifyUser, createBooking);

// only logged-in users can get their own booking
router.get("/:id", verifyUser, getBooking);

// only admins can view all bookings
router.get("/", verifyAdmin, getAllBooking);

export default router;
