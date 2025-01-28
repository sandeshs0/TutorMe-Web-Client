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

import React, { useEffect, useState } from "react";
import { fetchAllSubjects } from "../services/api";

const SubjectsInput = ({ formData, setFormData, errors }) => {
  const [currentTag, setCurrentTag] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const fetchSubjects = async () => {
    try {
      const subjects = await fetchAllSubjects(); // Assuming fetchAllSubjects is imported
      setFilteredSubjects(subjects.map((subject) => subject.name || ""));
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddTag = (tag) => {
    if (tag.trim() && !formData.subjects.includes(tag)) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, tag.trim()],
      });
      setCurrentTag(""); // Clear input field
      setHighlightedIndex(-1); // Reset highlighted index
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: updatedTags });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentTag(value);

    // Filter suggestions based on input
    const filtered = filteredSubjects.filter((subject) =>
      subject.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSubjects(filtered);
    setHighlightedIndex(-1); // Reset highlighted index
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredSubjects[highlightedIndex]) {
        handleAddTag(filteredSubjects[highlightedIndex]);
      } else {
        handleAddTag(currentTag);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSubjects.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSubjects.length - 1
      );
    }
  };

  const handleRemoveAll = () => {
    setFormData({ ...formData, subjects: [] });
  };

  const handleSuggestionClick = (subject) => {
    handleAddTag(subject);
  };

  return (
    <div>
      <label className="block text-md font-medium text-gray-900">
        Subjects
      </label>
      <div className="flex flex-wrap items-center p-4 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 transition-all duration-200 relative">
        {formData.subjects.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-100 text-blue-800 rounded-xl px-3 py-1 mr-2 mb-2 "
          >
            <span>{tag}</span>
            <button
              type="button"
              className="ml-2 text-blue-400 hover:text-red-700 transition-colors duration-150"
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
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter or comma to add"
          className="flex-grow bg-transparent outline-none text-sm"
        />
        {currentTag && filteredSubjects.length > 0 && (
          <ul className="absolute top-full right-10 w-1/2 bg-white border rounded-lg shadow-md z-10 max-h-40 overflow-y-auto">
            {filteredSubjects.map((subject, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(subject)}
                className={`px-4 py-2 cursor-pointer ${
                  index === highlightedIndex
                    ? "bg-blue-100 text-gray-800"
                    : "bg-white text-gray-800"
                }`}
              >
                {subject}
              </li>
            ))}
          </ul>
        )}
      </div>
      {errors.subjects && (
        <p className="text-red-500 text-sm animate-fade-in">
          {errors.subjects}
        </p>
      )}
      {formData.subjects.length > 0 && (
        <button
          type="button"
          className="mt-2 bg-red-700 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-transform duration-200 transform hover:scale-105"
          onClick={handleRemoveAll}
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default SubjectsInput;
