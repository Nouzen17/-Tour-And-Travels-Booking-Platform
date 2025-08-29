import express from "express";
import { register, login } from "../controllers/authController.js";
//import { verifyUser, verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// Registration route
router.post("/register", register);

// Login route
router.post("/login", login);

// Protected route for any logged-in user
//router.get("/user-dashboard", verifyUser, (req, res) => {
//  res.status(200).json({ success: true, message: "User Dashboard", user: req.user });
//});

// Protected route for admin only
//router.get("/admin-dashboard", verifyAdmin, (req, res) => {
//  res.status(200).json({ success: true, message: "Admin Dashboard", user: req.user });
//});

export default router;
