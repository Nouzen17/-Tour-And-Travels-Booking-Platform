import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          <span className="text-orange-500">TRAVEL</span>WORLD
        </Link>
        <div className="flex items-center space-x-6">
          <NavLink to="/" className="text-gray-600 hover:text-orange-500">
            Home
          </NavLink>
          <NavLink to="/tours" className="text-gray-600 hover:text-orange-500">
            Tours
          </NavLink>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.username}</span>
              <Link
                to="/profile"
                className="text-gray-600 hover:text-orange-500"
              >
                Profile
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-orange-500"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/login"
                className="text-gray-600 hover:text-orange-500"
              >
                Login
              </NavLink>
              <Link
                to="/register"
                className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
