import React, { useState, useEffect } from "react";
import axios from "../utils/config";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // NEW: stats state (for total bookings)
  const [stats, setStats] = useState({ totalBookings: 0 });

  // Tour form state
  const [tourForm, setTourForm] = useState({
    title: "",
    city: "",
    address: "",
    distance: "",
    photo: "",
    desc: "",
    price: "",
    maxGroupSize: "",
    duration: "",
    featured: false,
  });
  const [editingTour, setEditingTour] = useState(null);
  const [showTourForm, setShowTourForm] = useState(false);

  // Function to fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/users");
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      setError(
        "Failed to fetch users. Please make sure the backend server is running."
      );
      console.error(err);
    }
  };

  // Function to fetch all tours from the backend
  const fetchTours = async () => {
    try {
      const { data } = await axios.get("/tours");
      if (data.success) {
        setTours(data.data);
      }
    } catch (err) {
      setError(
        "Failed to fetch tours. Please make sure the backend server is running."
      );
      console.error(err);
    }
  };

  // NEW: fetch total bookings from /admin/stats
  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/admin/stats");
      if (data.success) {
        setStats({ totalBookings: data.data?.totalBookings ?? 0 });
      }
    } catch (err) {
      console.warn(
        "Failed to fetch admin stats:",
        err?.response?.data || err.message
      );
    }
  };

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchUsers(), fetchTours(), fetchStats()]); // ← added fetchStats()
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handler to delete a user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/users/${userId}`);
        // Refresh the user list by filtering out the deleted user
        setUsers(users.filter((user) => user._id !== userId));
        setError(""); // Clear any previous errors
      } catch (err) {
        setError(
          `Failed to delete user: ${err.response?.data?.message || err.message}`
        );
        console.error(err);
      }
    }
  };

  // Tour form handlers
  const handleTourFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTourForm({
      ...tourForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTourSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTour) {
        // Update existing tour
        const { data } = await axios.put(`/tours/${editingTour._id}`, tourForm);
        if (data.success) {
          setTours(
            tours.map((tour) =>
              tour._id === editingTour._id ? data.data : tour
            )
          );
          setEditingTour(null);
        }
      } else {
        // Create new tour
        const { data } = await axios.post("/tours", tourForm);
        if (data.success) {
          setTours([...tours, data.data]);
        }
      }
      setShowTourForm(false);
      setTourForm({
        title: "",
        city: "",
        address: "",
        distance: "",
        photo: "",
        desc: "",
        price: "",
        maxGroupSize: "",
        duration: "",
        featured: false,
      });
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(
        `Failed to save tour: ${err.response?.data?.message || err.message}`
      );
      console.error(err);
    }
  };

  const handleEditTour = (tour) => {
    setTourForm(tour);
    setEditingTour(tour);
    setShowTourForm(true);
  };

  const handleDeleteTour = async (tourId) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      try {
        await axios.delete(`/tours/${tourId}`);
        setTours(tours.filter((tour) => tour._id !== tourId));
        setError(""); // Clear any previous errors
      } catch (err) {
        setError(
          `Failed to delete tour: ${err.response?.data?.message || err.message}`
        );
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex-grow bg-gray-100 py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Users Management
              </button>
              <button
                onClick={() => setActiveTab("tours")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "tours"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Tours Management
              </button>
            </nav>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
            <p className="text-4xl font-bold text-orange-500">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Total Tours</h3>
            <p className="text-4xl font-bold text-blue-500">{tours.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">
              Featured Tours
            </h3>
            <p className="text-4xl font-bold text-green-500">
              {tours.filter((tour) => tour.featured).length}
            </p>
          </div>

          {/* NEW: Total Bookings card (will wrap on next line if needed) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">
              Total Bookings
            </h3>
            <p className="text-4xl font-bold text-purple-600">
              {stats.totalBookings}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-700 p-6">
              Manage Users
            </h2>
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 font-medium text-gray-600">
                        Username
                      </th>
                      <th className="px-6 py-3 font-medium text-gray-600">
                        Email
                      </th>
                      <th className="px-6 py-3 font-medium text-gray-600">
                        Role
                      </th>
                      <th className="px-6 py-3 font-medium text-gray-600 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{user.username}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-center space-x-2">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-3 py-1 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tours Management Tab */}
        {activeTab === "tours" && (
          <div>
            {/* Add Tour Button */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setShowTourForm(true);
                  setEditingTour(null);
                  setTourForm({
                    title: "",
                    city: "",
                    address: "",
                    distance: "",
                    photo: "",
                    desc: "",
                    price: "",
                    maxGroupSize: "",
                    duration: "",
                    featured: false,
                  });
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                Add New Tour
              </button>
            </div>

            {/* Tour Form Modal */}
            {showTourForm && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {editingTour ? "Edit Tour" : "Add New Tour"}
                  </h3>
                  <form onSubmit={handleTourSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="title"
                      placeholder="Tour Title"
                      value={tourForm.title}
                      onChange={handleTourFormChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={tourForm.city}
                      onChange={handleTourFormChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={tourForm.address}
                      onChange={handleTourFormChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="number"
                      name="distance"
                      placeholder="Distance (km)"
                      value={tourForm.distance}
                      onChange={handleTourFormChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="url"
                      name="photo"
                      placeholder="Photo URL"
                      value={tourForm.photo}
                      onChange={handleTourFormChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <textarea
                      name="desc"
                      placeholder="Description"
                      value={tourForm.desc}
                      onChange={handleTourFormChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="3"
                      required
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={tourForm.price}
                      onChange={handleTourFormChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="number"
                      name="maxGroupSize"
                      placeholder="Max Group Size"
                      value={tourForm.maxGroupSize}
                      onChange={handleTourFormChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="text"
                      name="duration"
                      placeholder="Duration (e.g., 3 days)"
                      value={tourForm.duration}
                      onChange={handleTourFormChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={tourForm.featured}
                        onChange={handleTourFormChange}
                        className="mr-2"
                      />
                      Featured Tour
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                      >
                        {editingTour ? "Update" : "Create"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTourForm(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Tours Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h2 className="text-2xl font-bold text-gray-700 p-6">
                Manage Tours
              </h2>
              {loading ? (
                <p className="text-center py-4">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 font-medium text-gray-600">
                          Title
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-600">
                          City
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-600">
                          Price
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-600">
                          Duration
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-600">
                          Max Group
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-600">
                          Featured
                        </th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tours.map((tour) => (
                        <tr
                          key={tour._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium">
                            {tour.title}
                          </td>
                          <td className="px-6 py-4">{tour.city}</td>
                          <td className="px-6 py-4">${tour.price}</td>
                          <td className="px-6 py-4">
                            {tour.duration || "N/A"}
                          </td>
                          <td className="px-6 py-4">{tour.maxGroupSize}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                tour.featured
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {tour.featured ? "Featured" : "Regular"}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditTour(tour)}
                              className="px-3 py-1 rounded-md bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTour(tour._id)}
                              className="px-3 py-1 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
