import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
} from "../controllers/userController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// create new user
router.post("/", createUser);

// update user
router.put("/:id", verifyUser, updateUser);

// delete user
router.delete("/:id", verifyUser, deleteUser);

// get all users (admin only)
router.get("/", verifyAdmin, getAllUser);

// get single user
router.get("/:id", verifyUser, getSingleUser);

export default router;
