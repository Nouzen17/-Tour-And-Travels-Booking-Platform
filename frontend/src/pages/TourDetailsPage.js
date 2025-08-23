import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Reviews from '../components/Reviews'; // 1. Import the Reviews component

// --- Helper Icons ---
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const PriceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.167-.335c-.475 0-.93.13-1.305.335-1.221.676-1.833 2.26-1.42 3.685.413 1.425 1.99 2.33 3.21 1.654.475-.267.865-.676 1.167-1.118v1.698a4.5 4.5 0 01-2.433 1.005c-2.475 0-4.5-2.025-4.5-4.5s2.025-4.5 4.5-4.5c.635 0 1.235.13 1.785.335z" /><path d="M12.567 7.151c.221.07.409.164.567.267v-1.698a4.5 4.5 0 00-2.433-1.005c-2.475 0-4.5 2.025-4.5 4.5s2.025 4.5 4.5 4.5c.635 0 1.235-.13 1.785-.335v-1.698c-.29.442-.692.851-1.167 1.118-1.22.676-2.797-.229-3.21-1.654-.413-1.425.2-3.009 1.42-3.685.375-.205.83-.335 1.305-.335.475 0 .93.13 1.305.335z" /></svg>;

const API_URL = 'http://localhost:1530';

const TourDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [booking, setBooking] = useState({
    fullName: '',
    phone: '',
    bookAt: '',
    guestSize: 1,
  });

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/tours/${id}`);
        if (data.success) {
          setTour(data.data);
        } else {
          setError('Tour not found.');
        }
      } catch (err) {
        setError('Failed to fetch tour details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTourDetails();
  }, [id]);

  const handleInputChange = (e) => {
    setBooking({ ...booking, [e.target.id]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
        const bookingData = { ...booking, tourName: tour.title };
      await axios.post(`${API_URL}/booking`, bookingData);
      navigate('/thank-you');
    } catch (err) {
      alert('Booking failed. Please try again.');
    }
  };

  // 3. Handler to update reviews in the state
  const handleReviewSubmit = (newReview) => {
    setTour({
        ...tour,
        reviews: [...tour.reviews, newReview],
    });
  };

  if (loading) return <p className="text-center p-10">Loading...</p>;
  if (error) return <p className="text-center p-10 text-red-500">{error}</p>;
  if (!tour) return <p className="text-center p-10">Tour not found.</p>;

  const { photo, title, desc, price, reviews, city, address, maxGroupSize } = tour;
  const totalRating = reviews?.reduce((acc, item) => acc + item.rating, 0);
  const avgRating = totalRating === 0 ? '' : (totalRating / reviews?.length).toFixed(1);

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Tour Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={photo} alt={title} className="w-full h-96 object-cover" />
            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <span className="flex items-center"><StarIcon /> {avgRating || 'Not rated'} ({reviews?.length || 0} reviews)</span>
                <span className="flex items-center"><LocationIcon /> {address}</span>
              </div>
              <div className="flex items-center space-x-8 text-gray-700 mb-6">
                  <span><LocationIcon /> {city}</span>
                  <span><PriceIcon /> ${price} /per person</span>
                  <span>Max People: {maxGroupSize}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          </div>
          {/* 2. Render the Reviews component here */}
          <Reviews tourId={id} reviews={reviews} onReviewSubmit={handleReviewSubmit} />
        </div>

        {/* Right Side: Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <p className="text-2xl font-bold text-orange-500">${price} <span className="text-lg text-gray-600 font-normal">/person</span></p>
              <span className="flex items-center"><StarIcon /> {avgRating || 'Not rated'}</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Information</h3>
            <form onSubmit={handleBookingSubmit}>
              <div className="space-y-4">
                <input type="text" id="fullName" placeholder="Full Name" required onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <input type="tel" id="phone" placeholder="Phone" required onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <div className="flex space-x-4">
                  <input type="date" id="bookAt" required onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <input type="number" id="guestSize" placeholder="Guest" min="1" required onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg mt-6 hover:bg-orange-600 transition-colors">
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDetailsPage;