import React, { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { fetchTutorProfile, updateTutorProfile } from "../services/api";
import { toast } from "react-toastify";


const TutorProfile = () => {
  const { user } = useAuth(); // Access user context
  const [profile, setProfile] = useState(null); // Profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [formData, setFormData] = useState({}); // Form data for updates


  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await fetchTutorProfile();
        setProfile(profileData);
        setFormData(profileData);
      } catch (err) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (error) {
    toast.error(error);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    console.log("Handle submit fn, Form Data", formData);
    e.preventDefault();
    try{
      const updatedProfile = await updateTutorProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch(e){
      toast.error(e.message || "Failed to update profile");
    }
  };
  if (loading){
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }
  if (error) {
    toast.error(error);
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 p-6 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg font-poppins space-y-8">
 {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Details */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
              required
              disabled
            />
          </div>

          {/* About */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
              rows="4"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
              rows="4"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Hourly Rate</label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded dark:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded dark:bg-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <>
         <section className="flex items-center gap-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary dark:border-blue-500">
          <img
            src={profile?.profileImage || "https://via.placeholder.com/150"}
            alt={profile?.name || "Tutor"}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {profile?.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {profile?.email}
          </p>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {profile?.phone || "Phone not available"}
          </p>
        </div>
      </section>
         <section>
        <h2 className="text-xl font-bold text-gray-700 dark:text-white border-b-2 border-gray-200 dark:border-gray-600 pb-2">
          About
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-600 dark:text-gray-300">
              Bio:
            </h3>
            <p className="text-gray-700 dark:text-gray-200">
              {profile?.bio || "No bio available"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600 dark:text-gray-300">
              Description:
            </h3>
            <p className="text-gray-700 dark:text-gray-200">
              {profile?.description || "No description available"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600 dark:text-gray-300">
              Subjects:
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile?.subjects?.map((subject, index) => (
                <span
                  key={index}
                  className="bg-primary  text-white  px-3 py-1 text-sm font-medium rounded-full"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rating & Financial Details */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating */}
        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600 dark:text-white">
            Rating
          </h3>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className="text-yellow-600 text-xl dark:text-yellow-300"
              >
                {index < profile?.rating ? <FaStar /> : <FaRegStar />}
              </span>
            ))}
          </div>
        </div>

        {/* Hourly Rate */}
        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600 dark:text-white">
            Hourly Rate
          </h3>
          <p className="text-lg font-bold text-gray-800 dark:text-blue-300 mt-2">
            Rs. {profile?.hourlyRate}/hr
          </p>
        </div>

        {/* Wallet Balance */}
        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600 dark:text-white">
            Wallet Balance
          </h3>
          <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-2">
            Rs. {profile?.walletBalance || 0.0}
          </p>
        </div>
      </section>

      {/* Edit Profile Button */}
      <div className="flex justify-center">
        <button
          className="btn btn-primary dark:bg-blue-600 dark:text-gray-100 btn-wide"
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </button>
      </div>
        </>
      )}
    </div>
  );
};

export default TutorProfile;
