import React, { useState } from "react";

const SubjectsInput = ({ formData, setFormData, errors }) => {
  const [currentTag, setCurrentTag] = useState("");

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
      setCurrentTag(""); // Reset current tag input
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: updatedTags });
  };

  const handleInputChange = (e) => {
    setCurrentTag(e.target.value);
  };

  const handleRemoveAll = () => {
    setFormData({ ...formData, subjects: [] });
  };

  return (
    <div>
      <label className="block text-md font-medium text-gray-900">Subjects</label>
      <div className="flex flex-wrap items-center p-4 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 transition-all duration-200">
        {formData.subjects.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2 animate-fade-in"
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
          onKeyDown={handleAddTag}
          placeholder="Type and press Enter or comma to add"
          className="flex-grow bg-transparent outline-none text-sm animate-slide-in"
        />
      </div>
      {errors.subjects && (
        <p className="text-red-500 text-sm animate-fade-in">{errors.subjects}</p>
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
