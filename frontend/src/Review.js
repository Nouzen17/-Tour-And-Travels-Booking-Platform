import React, { useState, useEffect } from "react";
import { fetchReviews, createReview } from "../api";

const Review = ({ tourId }) => {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchReviews(tourId).then((res) => setReviews(res.data));
  }, [tourId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createReview(tourId, { text });
    setReviews([...reviews, res.data]);
    setText("");
  };

  return (
    <div>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((r) => (
          <li key={r._id}>{r.text}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a review"
          required
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default Review;