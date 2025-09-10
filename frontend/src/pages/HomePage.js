import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TourCard from "../components/TourCard";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:1530";

// Reusable SearchBar component
const SearchBar = () => {
  return (
    <div className="bg-white rounded-full shadow-lg p-3">
      <form className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
        <div className="flex items-center border-r pr-4">
          <span className="text-orange-500 mr-2">📍</span>
          <input
            type="text"
            placeholder="Where are you going?"
            className="w-full focus:outline-none"
          />
        </div>
        <div className="flex items-center border-r pr-4">
          <span className="text-orange-500 mr-2">↔️</span>
          <input
            type="number"
            placeholder="Distance k/m"
            className="w-full focus:outline-none"
          />
        </div>
        <div className="flex items-center border-r pr-4">
          <span className="text-orange-500 mr-2">👥</span>
          <input
            type="number"
            placeholder="Max People"
            className="w-full focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white p-3 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mx-auto"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

const HomePage = () => {
  const { user } = useContext(AuthContext); // ← logged-in user from context
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        
        const { data } = await axios.get(`${API_URL}/tours`);
        if (data.success) {
          const featured = data.data.filter((tour) => tour.featured).slice(0, 8);
          setFeaturedTours(featured);
        }
      } catch (err) {
        setError("Could not load featured tours.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedTours();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-orange-500 font-semibold">Know Before You Go</p>
            <h1 className="text-5xl font-bold text-gray-800 my-4 leading-tight">
              Traveling opens the door to creating{" "}
              <span className="text-orange-500">memories</span>
            </h1>
            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam
              ipsum nobis asperiores soluta voluptas quas, veniam molestiae.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <img
              src="https://cloudinary.fclmedia.com/fctg/image/fetch/w_1600,c_fill,q_auto,g_auto,fl_progressive/https://live-fcl-site-fcb.pantheonsite.io/sites/default/files/FC1596261815-BLOG-tour_travel_mar14-2.jpg?fbclid=IwY2xjawMe31JleHRuA2FlbQIxMABicmlkETF2R011ZXc4N1VxaURhblptAR5shAmymT21BTCuYJpv439l-1DPcMCY-ewP-ngVnsPOx0WiRZSmyNowc41kCw_aem_LsMSdf2L2PXghjV9dlPg9w"
              alt="Tour 1"
              className="rounded-lg shadow-lg transform translate-y-4"
            />
            <img
              src="https://img.freepik.com/free-photo/top-view-hands-holding-smartphone_23-2149617652.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Tour 2"
              className="rounded-lg shadow-lg"
            />
            <img
              src="https://img.freepik.com/free-photo/full-shot-woman-travel-concept_23-2149153259.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Tour 3"
              className="rounded-lg shadow-lg transform -translate-y-4"
            />
          </div>
        </div>

        <div className="mt-12">
          <SearchBar />
        </div>

        {/* CTA Row */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/tours"
            className="px-4 py-2 rounded-xl border shadow-sm hover:shadow transition"
          >
            View All Tours
          </Link>

          {/* Show “My Bookings” only when logged in */}
          {user && (
            <Link
              to="/my-bookings"
              className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              My Bookings
            </Link>
          )}
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Our Featured Tours
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Discover our most popular tours
        </p>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredTours.length > 0 ? (
              featuredTours.map((tour) => <TourCard key={tour._id} tour={tour} />)
            ) : (
              <p className="col-span-4 text-center">
                No featured tours available at the moment.
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default HomePage;
