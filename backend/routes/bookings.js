import express from "express";
import {
  createBooking,
  getMyBooking,
  updateMyBooking,
  deleteMyBooking,
  cancelMyBooking,
} from "../controllers/bookingController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/me", verifyToken, getMyBooking);
router.patch("/:id", verifyToken, updateMyBooking);   // <-- add
router.delete("/:id", verifyToken, deleteMyBooking);  // <-- add
router.patch("/:id/cancel", verifyToken, cancelMyBooking);


export default router;
