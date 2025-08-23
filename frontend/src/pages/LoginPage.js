import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row max-w-4xl mx-auto overflow-hidden">
          <div className="md:w-1/2 p-8 flex-col justify-center items-center hidden md:flex">
            <img src="https://placehold.co/400x400/EBF4FF/737373?text=Welcome\nBack!" alt="Login Illustration" className="rounded-lg" />
          </div>
          <div className="md:w-1/2 p-8 bg-orange-50 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
            <form>
              <div className="mb-4">
                <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div className="mb-6">
                <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition duration-300">
                Login
              </button>
            </form>
            <p className="text-center text-gray-600 mt-4">
              Don't have an account? <Link to="/register" className="text-orange-500 font-semibold hover:underline">Create</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;