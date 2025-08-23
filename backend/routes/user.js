import express from "express";
import { deleteUser, toggleBlockUser } from "../controllers/userController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// Delete user
router.delete("/:id", verifyAdmin, deleteUser);

// Block/unblock user
router.put("/block/:id", verifyAdmin, toggleBlockUser);

export default router;