import React, { useState, useContext, useEffect } from "react";
import axios from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    photo: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setUserInfo({
        username: user.username || "",
        email: user.email || "",
        photo: user.photo || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setUserInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.put(`/users/${user._id}`, userInfo);

      if (res.data.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        // Update the user in context
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { data: res.data.data },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUserInfo({
      username: user.username || "",
      email: user.email || "",
      photo: user.photo || "",
    });
    setError("");
    setSuccess("");
  };

  if (!user) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please Login
          </h2>
          <p className="text-gray-600">
            You need to be logged in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-orange-500 px-6 py-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
              {userInfo.photo ? (
                <img
                  src={userInfo.photo}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-orange-500">
                  {userInfo.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {userInfo.username}
            </h1>
            <p className="text-orange-100">{userInfo.email}</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Profile Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={userInfo.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-md border ${
                      isEditing
                        ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-md border ${
                      isEditing
                        ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    id="photo"
                    value={userInfo.photo}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-md border ${
                      isEditing
                        ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-4 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition duration-300 disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
