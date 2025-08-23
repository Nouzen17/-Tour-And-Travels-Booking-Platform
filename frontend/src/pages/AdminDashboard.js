import React, { useState, useEffect } from 'react';
import axios from 'axios';

// NOTE: In a real app, the API base URL would be in an environment variable.
const API_URL = 'http://localhost:1530'; 

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to fetch all users from the backend
    const fetchUsers = async () => {
        try {
            // Note: In a real app, you would send an auth token in the headers
            // const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${API_URL}/users`);
            if (data.success) {
                setUsers(data.data);
            }
        } catch (err) {
            setError('Failed to fetch users. Please make sure the backend server is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // useEffect hook to fetch users when the component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    // Handler to delete a user
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                // await axios.delete(`${API_URL}/users/${userId}`, config);
                await axios.delete(`${API_URL}/users/${userId}`);
                // Refresh the user list by filtering out the deleted user
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                setError('Failed to delete user.');
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
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

                {/* Statistics Section (using mock data as this isn't from the /users endpoint) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
                        <p className="text-4xl font-bold text-orange-500">{users.length}</p>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-600">Total Bookings</h3>
                        <p className="text-4xl font-bold text-blue-500">124</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-600">Avg. Tour Rating</h3>
                        <p className="text-4xl font-bold text-green-500">4.7 ⭐</p>
                    </div>
                </div>

                {/* User Management Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <h2 className="text-2xl font-bold text-gray-700 p-6">Manage Users</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-gray-600">Username</th>
                                    <th className="px-6 py-3 font-medium text-gray-600">Email</th>
                                    <th className="px-6 py-3 font-medium text-gray-600">Role</th>
                                    <th className="px-6 py-3 font-medium text-gray-600 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{user.username}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
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
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;