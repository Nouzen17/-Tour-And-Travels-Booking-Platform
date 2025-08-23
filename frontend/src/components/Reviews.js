import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:1530';

// Star rating component for submitting a review
const StarRating = ({ rating, setRating }) => {
    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            className="hidden"
                        />
                        <svg
                            className={`w-6 h-6 cursor-pointer ${ratingValue <= rating ? 'text-orange-500' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </label>
                );
            })}
        </div>
    );
};


const Reviews = ({ tourId, reviews, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || !reviewText) {
            return alert('Please provide a rating and a review.');
        }

        const reviewData = {
            // In a real app, username would come from logged-in user context
            username: 'Anonymous User', 
            reviewText,
            rating,
        };

        try {
            const { data } = await axios.post(`${API_URL}/reviews/${tourId}`, reviewData);
            if (data.success) {
                onReviewSubmit(data.data); // Pass the new review back to the parent page
                setRating(0);
                setReviewText('');
            }
        } catch (err) {
            alert('Failed to submit review.');
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Reviews ({reviews?.length || 0})</h3>

            {/* Review Submission Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h4 className="font-semibold text-lg mb-2">Leave a review</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows="4"
                        placeholder="Share your thoughts..."
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    ></textarea>
                    <button type="submit" className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-full mt-4 hover:bg-orange-600 transition-colors">
                        Submit
                    </button>
                </form>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-6">
                {reviews?.length > 0 ? (
                    reviews.map(review => (
                        <div key={review._id} className="flex space-x-4">
                            {/* User Avatar Placeholder */}
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                            <div>
                                <h5 className="font-bold">{review.username}</h5>
                                <p className="text-sm text-gray-500 mb-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                                <p className="text-gray-700">{review.reviewText}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to share your experience!</p>
                )}
            </div>
        </div>
    );
};

export default Reviews;