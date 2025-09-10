import express from "express";
import User from "../models/User.js";
import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// GET /admin/stats  -> { success, data: { totalUsers, totalTours, featuredTours, totalBookings } }
router.get("/stats", verifyAdmin, async (req, res) => {
  const totalBookings = await Booking.countDocuments({});
  const totalUsers    = await User.countDocuments();
  const totalTours    = await Tour.countDocuments();
  const featuredTours = await Tour.countDocuments({ featured: true });
  res.json({ success:true, data:{ totalUsers, totalTours, featuredTours, totalBookings }});
});



export default router;
