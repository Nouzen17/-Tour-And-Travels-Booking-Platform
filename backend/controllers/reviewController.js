import Tour from "../models/Tour.js";
import Review from "../models/Review.js";

export const createReview = async (req, res) => {
const tourId = req.params.tourId;
const newReview = new Review({ ...req.body });

try {
const savedReview = await newReview.save();

// after creating a new review now update the reviews array of the tour
await Tour.findByIdAndUpdate(tourId, {
$push: { reviews: savedReview._id },
});

res
.status(200)
.json({ success: true, message: "Review submitted", data: savedReview });
} catch (err) {
res.status(500).json({ success: false, message: "failed to submit" });
}
};



export const editReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.id; // assuming user ID is set in req.user by auth middleware

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Check if the review belongs to the user
    if (review.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to edit this review" });
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {
      new: true,
    });

    res.status(200).json({ success: true, message: "Review updated", data: updatedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
};

export const deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);

    // Also remove it from the corresponding tour
    await Tour.findByIdAndUpdate(review.tour, {
      $pull: { reviews: review._id },
    });

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};
