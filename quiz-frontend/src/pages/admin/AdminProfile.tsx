import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Save, X } from "lucide-react";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "Admin Name",
    email: "admin@example.com",
    phone: "123-456-7890",
    address: "123 Admin Street, Admin City",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempAdmin, setTempAdmin] = useState({ ...admin });

  useEffect(() => {
    // Fetch admin details from the API
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get("http://localhost:9090/admin/profile");
        setAdmin(response.data);
        setTempAdmin(response.data);
      } catch (err) {
        console.error("Error fetching admin details:", err);
      }
    };

    fetchAdminDetails();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTempAdmin(admin); // Reset to original data
  };

  const handleSaveClick = async () => {
    try {
      // Save updated admin details to the API
      const response = await axios.put("http://localhost:9090/admin/profile", tempAdmin);
      setAdmin(response.data);
      setIsEditing(false);
      console.log("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempAdmin((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={tempAdmin.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{admin.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={tempAdmin.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{admin.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={tempAdmin.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{admin.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={tempAdmin.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{admin.address}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveClick}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save className="w-5 h-5 mr-2" />
                Save
              </button>
              <button
                onClick={handleCancelClick}
                className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditClick}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;