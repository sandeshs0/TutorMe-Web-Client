import React, { useEffect, useState } from "react";
import { toast } from "sonner";
// import { useAuth } from "../context/AuthContext";
import Modal from "../../../../components/Modal";
import { fetchStudentProfile } from "../../../../services/api";

const StudentProfile = () => {
  //   const { user } = useAuth(); // Access user context
  const [profile, setProfile] = useState(null); // Student profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [formData, setFormData] = useState({}); // Form data for updates
  const [selectedFile, setSelectedFile] = useState(null); // Profile image file
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [isSubmitting, setIsSubmitting] = useState(false); // New loading state

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const profileData = await fetchStudentProfile();
      setProfile(profileData);
      console.log("api's student data:", profileData);
      setFormData({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleProfilePictureSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedFile);
    setIsSubmitting(true);

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await updateStudentProfile(formData);
          fetchData(); // Refresh data after the update
          setShowModal(false); // Close modal
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          setIsSubmitting(false);
        }
      }),
      {
        pending: "Updating profile picture...",
        success: "Profile picture updated successfully!",
        error: "Failed to update profile picture.",
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
    };

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await updateStudentProfile(payload);
          fetchData();
          setIsEditing(false);
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          setIsSubmitting(false);
        }
      }),
      {
        pending: "Updating profile details...",
        success: "Profile details updated successfully!",
        error: "Failed to update profile details.",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="animate-fade-in max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl font-poppins">
        {/* Modal for file upload */}
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <div className="flex flex-col w-full max-w-md bg-white dark:bg-gray-800 rounded-lg">
              <div className="pb-2 mb-4 border-b border-gray-300 dark:border-gray-600">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white text-center">
                  Update Profile Picture
                </h2>
              </div>

              <div className="flex flex-col items-center space-y-6 mb-6">
                {selectedFile ? (
                  <div className="w-40 h-40 rounded-full overflow-hidden border">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Preview
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border rounded w-full p-2 dark:text-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-300 dark:border-gray-600 flex justify-end space-x-8">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded text-white ${
                    isSubmitting
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } transition flex items-center`}
                  onClick={handleProfilePictureSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        <div className="flex flex-col items-center text-center mb-8">
          {/* Profile Image with Edit Icon */}
          <div className="relative mb-4 group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-500">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : "S"}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {!isEditing && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {profile?.name || "Student Name"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                {profile?.email}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                {profile?.phone || "No phone number"}
              </p>
              <div className="mt-4 inline-block bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  Wallet Balance: ₹{profile?.walletBalance || 0}
                </p>
              </div>
              <button
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-md"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>

        {isEditing && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner"
          >
            <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-4">
              Edit Your Profile
            </h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2 rounded-full text-white ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-colors duration-200 shadow-md`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
