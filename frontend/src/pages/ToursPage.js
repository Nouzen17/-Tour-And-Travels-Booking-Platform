import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TourCard from '../components/TourCard'; // Make sure the path is correct

// NOTE: In a real app, the API base URL would be in an environment variable.
const API_URL = 'http://localhost:1530'; 

const ToursPage = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/tours`);
                if (data.success) {
                    setTours(data.data);
                }
            } catch (err) {
                setError('Failed to fetch tours. Please make sure the backend server is running and has tour data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []); // Empty dependency array means this runs once when the component mounts

    return (
        <div>
            {/* Common Banner Section */}
            <section className="relative h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1200x200/333/FFF?text=All+Tours')" }}>
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="relative z-10 flex items-center justify-center h-full">
                    <h1 className="text-4xl font-bold text-white">All Tours</h1>
                </div>
            </section>

            {/* Tours Section */}
            <section className="container mx-auto px-6 py-12">
                {loading && <p className="text-center">Loading tours...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {tours.map(tour => (
                            <TourCard key={tour._id} tour={tour} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default ToursPage;