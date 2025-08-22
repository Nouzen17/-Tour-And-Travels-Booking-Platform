import express from "express";
import { searchTours } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", searchTours);

export default router;