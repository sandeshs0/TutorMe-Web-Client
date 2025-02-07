import React, { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { TiCamera } from "react-icons/ti";
import "react-image-crop/dist/ReactCrop.css";
import TagsField from "react-tagaroo";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  fetchAllSubjects,
  fetchTutorProfile,
  updateTutorProfile,
} from "../services/api";
import Modal from "./Modal";
import SubjectsInput from "./SubjectField";

const TutorProfile = () => {
  const { user } = useAuth(); // Access user context
  const [profile, setProfile] = useState(null); // Profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [formData, setFormData] = useState({}); // Form data for updates
  const [selectedFile, setSelectedFile] = useState(null); // Profile image file
  const [allSubjects, setAllSubjects] = useState([]); // List of all available subjects
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [isSubmitting, setIsSubmitting] = useState(false); // New loading state
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const profileData = await fetchTutorProfile();
      setProfile(profileData);
      console.log("Profile Data:", profileData); // Log response to confirm structure

      setFormData({
        bio: profileData.bio,
        description: profileData.description,
        hourlyRate: profileData.hourlyRate,
        subjects: profileData.subjects.map((subject) => subject), // Store subject IDs
      });
      console.log(formData.hourlyRate);
      const subjects = await fetchAllSubjects();
      setAllSubjects(subjects);
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (error) {
    toast.error(error);
  }
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
          await updateTutorProfile(formData);
          fetchData(); // Refresh data after the update
          setShowModal(false); // Close modal
          resolve(); // Resolve the promise for success toast
        } catch (error) {
          reject(error); // Reject the promise for error toast
        } finally {
          setIsSubmitting(false); // Reset loading state
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
    // console.log("Handle submit fn, Form Data", formData);
    e.preventDefault();
    // const formDataToSend = new FormData();
    // formDataToSend.append("bio", formData.bio || "");
    // formDataToSend.append("description", formData.description || "");
    // formDataToSend.append("hourlyRate", formData.hourlyRate || 0);
    // formDataToSend.append("subjects", JSON.stringify(formData.subjects));
    // if (profileImage) {
    //   formDataToSend.append("profileImage", profileImage);
    // }

    const payload = {
      bio: formData.bio || "",
      description: formData.description || "",
      hourlyRate: formData.hourlyRate || 0,
      subjects: formData.subjects, // Send subjects as an array
    };
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await updateTutorProfile(payload);
          fetchData(); // Refresh data after the update
          setIsEditing(false); // Exit editing mode
          resolve(); // Resolve the promise for success toast
        } catch (error) {
          reject(error); // Reject the promise for error toast
        } finally {
          setIsSubmitting(false); // Reset loading state
        }
      }),
      {
        pending: "Updating profile details...",
        success: "Profile details updated successfully!",
        error: "Failed to update profile details.",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }
  if (error) {
    toast.error(error);
  }

  return (
    <div className="animate-slide-in max-w-5xl mx-auto mt-6 p-6 bg-gray-100 dark:bg-gray-800 dark:text-white shadow-md rounded-lg font-poppins space-y-8">
      {/* Modal for file upload */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="flex flex-col w-full max-w-md bg-white dark:bg-gray-800 rounded-lg">
            {/* Modal Title */}
            <div className="pb-2 mb-4 border-b border-gray-300 dark:border-gray-600">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white text-center">
                Update Profile Picture
              </h2>
            </div>

            {/* Modal Content */}
            <div className=" flex flex-col items-center space-y-6 mb-6 ">
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

            {/* Modal Buttons */}
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
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Details */}
          {/* <div className="space-y-2">
            <label className="block text-sm font-semibold">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            />
          </div> */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={profile?.name || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
              required
              disabled
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={profile?.email || ""}
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

          {/* Subjects */}
          <SubjectsInput
            formData={formData}
            setFormData={setFormData}
            errors={{}}
          />
          <TagsField
            tags={tags}
            setTags={setTags}
            label="Skills"
            placeholder="Add a skill and press Enter"
          />
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      ) : (
        <>
          <section className="relative flex items-center gap-6">
            <div className=" w-40 h-40 rounded-full overflow-hidden border-4 border-primary dark:border-blue-500">
              <img
                src={profile?.profileImage}
                alt={profile?.name || "Tutor"}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setShowModal(true)}
                className="absolute hover:bg-gray-400 dark:hover:bg-gray-900 bottom-0 left-24 text-3xl dark:bg-gray-700 bg-gray-300 text-gray-900 dark:text-gray-200 p-1 rounded-full shadow-lg"
                aria-label="Edit Profile Picture"
              >
                <TiCamera />
              </button>
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
                  {profile?.subjects?.map((subject, index) => {
                    const subjectName =
                      typeof subject === "string"
                        ? subject
                        : subject?.name || "Unknown Subject";
                    return (
                      <span
                        key={index}
                        className="bg-primary  text-white  px-3 py-1 text-sm font-medium rounded-full"
                      >
                        {subjectName}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Rating & Financial Details */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rating */}
            <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
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
            <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-600 dark:text-white">
                Hourly Rate
              </h3>
              <p className="text-lg font-bold text-gray-800 dark:text-blue-300 mt-2">
                Rs. {profile?.hourlyRate}/hr
              </p>
            </div>

            {/* Wallet Balance */}
            <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
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
