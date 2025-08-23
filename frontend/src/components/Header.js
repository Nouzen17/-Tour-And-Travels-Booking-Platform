import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          <span className="text-orange-500">TRAVEL</span>WORLD
        </Link>
        <div className="flex items-center space-x-6">
          <NavLink to="/" className="text-gray-600 hover:text-orange-500">Home</NavLink>
          <NavLink to="/tours" className="text-gray-600 hover:text-orange-500">Tours</NavLink>
          <NavLink to="/login" className="text-gray-600 hover:text-orange-500">Login</NavLink>
          <Link to="/register" className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition duration-300">
            Register
          </Link>
          <Link to="/admin" className="text-gray-600 hover:text-orange-500">Admin</Link>
        </div>
      </nav>
    </header>
  );
};
export default Header;