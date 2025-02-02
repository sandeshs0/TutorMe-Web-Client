import { useState } from "react";
import { FaSort } from "react-icons/fa";

const SortDropdown = ({ setSortOption }) => {
  const [selectedOption, setSelectedOption] = useState("default");

  const handleSortChange = (option) => {
    setSelectedOption(option);
    setSortOption(option); // Immediately apply sort filter
  };

  return (
    <div className="dropdown dropdown-start relative font-sans">
      <button 
        tabIndex={0} 
        role="button" 
        className="btn btn-outline btn-primary flex items-center gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      >
        <FaSort className="text-lg" />
        Sort By
      </button>
      
      <ul 
        tabIndex={0} 
        className="dropdown-content menu bg-gray-100 dark:bg-gray-800 dark:text-white rounded-box shadow-lg w-56 p-2 z-50"
      >
        <li>
          <button 
            onClick={() => handleSortChange("default")}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-4 py-2"
          >
            Default
          </button>
        </li>
        <li>
          <button 
            onClick={() => handleSortChange("price-asc")}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-4 py-2"
          >
            Price: Low to High
          </button>
        </li>
        <li>
          <button 
            onClick={() => handleSortChange("price-desc")}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-4 py-2"
          >
            Price: High to Low
          </button>
        </li>
        <li>
          <button 
            onClick={() => handleSortChange("rating")}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-4 py-2"
          >
            Highest Rated
          </button>
        </li>
        <li>
          <button 
            onClick={() => handleSortChange("name")}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-4 py-2"
          >
            Alphabetical
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SortDropdown;