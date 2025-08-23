import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TourCard from '../components/TourCard';

const API_URL = 'http://localhost:1530';

// Reusable SearchBar component
const SearchBar = () => {
    return (
        <div className="bg-white rounded-full shadow-lg p-3">
            <form className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <div className="flex items-center border-r pr-4">
                    <span className="text-orange-500 mr-2">📍</span>
                    <input type="text" placeholder="Where are you going?" className="w-full focus:outline-none" />
                </div>
                <div className="flex items-center border-r pr-4">
                     <span className="text-orange-500 mr-2">↔️</span>
                    <input type="number" placeholder="Distance k/m" className="w-full focus:outline-none" />
                </div>
                <div className="flex items-center border-r pr-4">
                    <span className="text-orange-500 mr-2">👥</span>
                    <input type="number" placeholder="Max People" className="w-full focus:outline-none" />
                </div>
                <button type="submit" className="bg-orange-500 text-white p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </button>
            </form>
        </div>
    );
};


const HomePage = () => {
    const [featuredTours, setFeaturedTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeaturedTours = async () => {
            try {
                // Assuming your backend has a way to get featured tours.
                // For now, we'll just get all tours and filter on the frontend.
                const { data } = await axios.get(`${API_URL}/tours`);
                if (data.success) {
                    // Filter for tours marked as 'featured'
                    const featured = data.data.filter(tour => tour.featured).slice(0, 8); // Show max 8
                    setFeaturedTours(featured);
                }
            } catch (err) {
                setError('Could not load featured tours.');
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
                            Traveling opens the door to creating <span className="text-orange-500">memories</span>
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam ipsum nobis asperiores soluta voluptas quas, veniam molestiae.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                         <img src="https://placehold.co/200x300/666/FFF?text=Tour+1" alt="Tour 1" className="rounded-lg shadow-lg transform translate-y-4" />
                         <img src="https://placehold.co/200x300/777/FFF?text=Tour+2" alt="Tour 2" className="rounded-lg shadow-lg" />
                         <img src="https://placehold.co/200x300/888/FFF?text=Tour+3" alt="Tour 3" className="rounded-lg shadow-lg transform -translate-y-4" />
                    </div>
                </div>
                <div className="mt-12">
                   <SearchBar />
                </div>
            </section>

            {/* Featured Tours Section */}
            <section className="container mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Our Featured Tours</h2>
                <p className="text-center text-gray-600 mb-8">Discover our most popular tours</p>
                
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {featuredTours.length > 0 ? (
                            featuredTours.map(tour => <TourCard key={tour._id} tour={tour} />)
                        ) : (
                            <p className="col-span-4 text-center">No featured tours available at the moment.</p>
                        )}
                    </div>
                )}
            </section>
        </>
    );
};

export default HomePage;
