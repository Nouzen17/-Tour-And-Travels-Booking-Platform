import express from "express";
import {
  createTour,
  deleteTour,
  getAllTour,
  getSingleTour,
  updateTour,
} from "../controllers/tourController.js";

export const router = express.Router();

// create new tour
router.post("/", createTour);

// update tour
router.put("/:id", updateTour);

// delete tour
router.delete("/:id", deleteTour);

// get all tours (must come before /:id route)
router.get("/", getAllTour);

// get single tour
router.get("/:id", getSingleTour);

export default router;
