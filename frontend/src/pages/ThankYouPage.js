import React from 'react';
import { Link } from 'react-router-dom';

const CheckIcon = () => (
    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);

const ThankYouPage = () => {
    return (
        <div className="flex-grow flex items-center justify-center bg-gray-50 py-12">
            <div className="container mx-auto px-6 text-center">
                <div className="bg-white p-10 rounded-lg shadow-xl max-w-md mx-auto">
                    <CheckIcon />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h1>
                    <p className="text-gray-600 mb-6">Your tour is booked.</p>
                    <Link
                        to="/"
                        className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-orange-600 transition duration-300"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ThankYouPage;