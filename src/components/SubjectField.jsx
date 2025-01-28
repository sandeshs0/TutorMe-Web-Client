// import React, { useState } from "react";
// import React, { useState, useEffect } from "react";
// import { fetchAllSubjects } from "../services/api";

// const SubjectsInput = ({ formData, setFormData, errors }) => {
//   const [currentTag, setCurrentTag] = useState("");

//   const handleAddTag = (e) => {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       const trimmedTag = currentTag.trim();
//       if (trimmedTag && !formData.subjects.includes(trimmedTag)) {
//         setFormData({
//           ...formData,
//           subjects: [...formData.subjects, trimmedTag],
//         });
//       }
//       setCurrentTag(""); // Reset current tag input
//     }
//   };

//   const handleRemoveTag = (index) => {
//     const updatedTags = formData.subjects.filter((_, i) => i !== index);
//     setFormData({ ...formData, subjects: updatedTags });
//   };

//   const handleInputChange = (e) => {
//     setCurrentTag(e.target.value);
//   };

//   const handleRemoveAll = () => {
//     setFormData({ ...formData, subjects: [] });
//   };

//   return (
//     <div>
//       <label className="block text-md font-medium text-gray-900">Subjects</label>
//       <div className="flex flex-wrap items-center p-4 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 transition-all duration-200">
//         {formData.subjects.map((tag, index) => (
//           <div
//             key={index}
//             className="flex items-center bg-blue-100 text-blue-800 rounded-xl px-3 py-1 mr-2 mb-2 animate-fade-in"
//           >
//             <span>{tag}</span>
//             <button
//               type="button"
//               className="ml-2 text-blue-400 hover:text-red-700 transition-colors duration-150"
//               onClick={() => handleRemoveTag(index)}
//             >
//               ✕
//             </button>
//           </div>
//         ))}
//         <input
//           type="text"
//           value={currentTag}
//           onChange={handleInputChange}
//           onKeyDown={handleAddTag}
//           placeholder="Type and press Enter or comma to add"
//           className="flex-grow bg-transparent outline-none text-sm animate-slide-in"
//         />
//       </div>
//       {errors.subjects && (
//         <p className="text-red-500 text-sm animate-fade-in">{errors.subjects}</p>
//       )}
//       {formData.subjects.length > 0 && (
//         <button
//           type="button"
//           className="mt-2 bg-red-700 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-transform duration-200 transform hover:scale-105"
//           onClick={handleRemoveAll}
//         >
//           Clear
//         </button>
//       )}
//     </div>
//   );
// };

// export default SubjectsInput;
import React, { useState, useEffect } from "react";
import { fetchAllSubjects } from "../services/api"; // Import the API call

const SubjectsInput = ({ formData, setFormData, errors }) => {
  const [currentTag, setCurrentTag] = useState(""); // Current input value
  const [allSubjects, setAllSubjects] = useState([]); // List of all available subjects
  const [filteredSuggestions, setFilteredSuggestions] = useState([]); // Filtered suggestions based on input

  // Fetch all subjects from the database on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjects = await fetchAllSubjects(); // Fetch the subjects from the API
        // Check if subjects exist and map safely
        console.log(subjects);
        if (subjects && Array.isArray(subjects)) {
          setAllSubjects(subjects.map((subject) => subject.name || ""));
        } else {
          console.error("Invalid subjects data format:", subjects);
          setAllSubjects([]); // Set an empty array if the format is incorrect
        }
      } catch (error) {
        console.error(
          "Error fetching subjects:",
          error.message || "Unknown error occurred"
        );
      }
    };
  
    fetchSubjects();
  }, []);
  

  // Handle adding a tag on Enter or comma press
  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmedTag = currentTag.trim();
      if (trimmedTag && !formData.subjects.includes(trimmedTag)) {
        setFormData({
          ...formData,
          subjects: [...formData.subjects, trimmedTag],
        });
      }
      setCurrentTag(""); // Reset input
      setFilteredSuggestions([]); // Clear suggestions
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (index) => {
    const updatedTags = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: updatedTags });
  };

  // Handle input changes and dynamically filter suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentTag(value);

    // Dynamically filter suggestions
    if (value) {
      const suggestions = allSubjects.filter((subject) =>
        subject.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions([]);
    }
  };

  // Handle clicking on a suggestion to add it as a tag
  const handleSuggestionClick = (suggestion) => {
    if (!formData.subjects.includes(suggestion)) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, suggestion],
      });
    }
    setCurrentTag(""); // Clear input
    setFilteredSuggestions([]); // Clear suggestions
  };

  // Handle clearing all tags
  const handleRemoveAll = () => {
    setFormData({ ...formData, subjects: [] });
  };

  return (
    <div>
      <label className="block text-md font-medium text-gray-900">Subjects</label>
      <div className="relative">
        {/* Tags Input */}
        <div className="flex flex-wrap items-center p-4 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 transition-all duration-200">
          {formData.subjects.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-100 text-blue-800 rounded-xl px-3 py-1 mr-2 mb-2"
            >
              <span>{tag}</span>
              <button
                type="button"
                className="ml-2 text-blue-400 hover:text-red-700"
                onClick={() => handleRemoveTag(index)}
              >
                ✕
              </button>
            </div>
          ))}
          <input
            type="text"
            value={currentTag}
            onChange={handleInputChange}
            onKeyDown={handleAddTag}
            placeholder="Type and press Enter or comma to add"
            className="flex-grow bg-transparent outline-none text-sm"
          />
        </div>

        {/* Suggestions Dropdown */}
        {filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto w-full">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Error Message */}
      {errors.subjects && (
        <p className="text-red-500 text-sm">{errors.subjects}</p>
      )}

      {/* Clear Button */}
      {formData.subjects.length > 0 && (
        <button
          type="button"
          className="mt-2 bg-red-700 text-white px-4 py-1 rounded-lg hover:bg-red-600"
          onClick={handleRemoveAll}
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default SubjectsInput;
