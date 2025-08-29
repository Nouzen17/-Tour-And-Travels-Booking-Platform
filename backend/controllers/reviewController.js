import Tour from '../models/Tour.js';
import Review from '../models/Review.js';

// @desc    Create a new review
// @route   POST /reviews/:tourId
// @access  Private (for logged-in users)
export const createReview = async (req, res) => {
    const tourId = req.params.tourId;
    const newReview = new Review({ ...req.body });

    try {
        // Save the new review to the database
        const savedReview = await newReview.save();

        // After creating the review, find the corresponding tour and update its reviews array
        await Tour.findByIdAndUpdate(tourId, {
            $push: { reviews: savedReview._id } // Push the new review's ID into the tour's 'reviews' array
        });

        res.status(200).json({
            success: true,
            message: 'Review submitted successfully!',
            data: savedReview
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit review. Please try again.'
        });
    }
};