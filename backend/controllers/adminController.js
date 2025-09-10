import express from "express";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Tour from "../models/Tour.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

/* ========= EXISTING: /admin/metrics (UNCHANGED) ========= */
router.get("/metrics", verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, revenue: { $sum: "$amount" } } }
    ]);

    const topTours = await Booking.aggregate([
      { $match: { status: { $in: ["paid", "confirmed"] } } },
      { $group: { _id: "$tour", bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      { $lookup: { from: "tours", localField: "_id", foreignField: "_id", as: "tour" } },
      { $unwind: "$tour" },
      { $project: { title: "$tour.title", bookings: 1 } }
    ]);

    res.json({
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue[0]?.revenue || 0,
      topTours
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ========= NEW: /admin/stats (for dashboard cards) =========
   Shape exactly what your AdminDashboard expects: { success, data: {...} }
*/
router.get("/stats", verifyAdmin, async (_req, res) => {
  try {
    const [totalUsers, totalTours, featuredTours, totalBookings] = await Promise.all([
      User.countDocuments(),
      Tour.countDocuments(),
      Tour.countDocuments({ featured: true }),
      Booking.countDocuments(),
    ]);

    return res.json({
      success: true,
      data: { totalUsers, totalTours, featuredTours, totalBookings },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return res.status(500).json({ success: false, message: "Failed to load stats" });
  }
});

/* ========= NEW: /admin/users/:id/role (role toggle for admin UI) ========= */
router.patch("/users/:id/role", verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password"); // don't leak hashed password

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update role error:", err);
    return res.status(500).json({ success: false, message: "Failed to update role" });
  }
});

export default router;
