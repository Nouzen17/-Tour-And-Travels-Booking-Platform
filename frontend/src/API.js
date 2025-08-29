import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Example: review APIs
export const fetchReviews = (tourId) => API.get(/reviews/${tourId}/reviews);
export const createReview = (tourId, reviewData) => API.post(/reviews/${tourId}/review, reviewData);

// Example: search API
export const searchTours = (params) => API.get(/search, { params });