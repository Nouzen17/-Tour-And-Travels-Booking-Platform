import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-50 mt-16 py-10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-600">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2"><span className="text-orange-500">TRAVEL</span>WORLD</h3>
                    <p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, enim.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-3">Discover</h4>
                    <ul>
                        <li className="mb-2"><Link to="/" className="hover:text-orange-500">Home</Link></li>
                        <li><Link to="/tours" className="hover:text-orange-500">Tours</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-3">Quick Links</h4>
                    <ul>
                        <li className="mb-2"><Link to="/login" className="hover:text-orange-500">Login</Link></li>
                        <li><Link to="/register" className="hover:text-orange-500">Register</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-3">Contact</h4>
                    <p className="text-sm mb-2">Address: Sylhet, Bangladesh</p>
                </div>
            </div>
        </footer>
    );
};
export default Footer;