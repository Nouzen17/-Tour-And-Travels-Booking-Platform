import React from 'react';
import { Link } from 'react-router-dom';

// A simple star icon component
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const TourCard = ({ tour }) => {
  // Destructure tour properties for easier access
  const { _id, title, city, photo, price, featured, reviews } = tour;

  // Calculate average rating
  const totalRating = reviews?.reduce((acc, item) => acc + item.rating, 0);
  const avgRating = totalRating === 0 ? '' : (totalRating / reviews?.length).toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <img src={photo} alt={title} className="w-full h-48 object-cover" />
        {featured && (
          <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            Featured
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 flex items-center">
            {/* Location Icon can be added here */}
            {city}
          </span>
          <span className="flex items-center text-sm">
            <StarIcon /> {avgRating || 'Not rated'}
            {reviews && <span className="text-gray-500 ml-1">({reviews.length})</span>}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 truncate mb-3 group-hover:text-orange-500">
          <Link to={`/tours/${_id}`}>{title}</Link>
        </h3>

        <div className="flex justify-between items-center">
          <p className="text-orange-500 font-bold text-lg">
            ${price} <span className="text-sm text-gray-500 font-normal">/per person</span>
          </p>
          <Link
            to={`/tours/${_id}`}
            className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;