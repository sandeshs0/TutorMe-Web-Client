// import React from "react";

// const SearchSection = () => {
//   return (
//     <div className="bg-[#07203a] p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-8 mb-8">
//     {/* <div className="bg-transparent p-6 rounded-lg max-w-4xl mx-auto mt-8 mb-8"> */}
//       <div className="flex flex-wrap items-center justify-between gap-5">
//         {/* Search Input */}
//         <div className="flex-grow w-full sm:w-auto bg-white shadow-md rounded-xl px-5 py-3 ">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-full p-0.5 px-1 outline-none text-gray-700 text-lg"
//           />
//         </div>

//         {/* Dropdown for Category */}
//         <div className="w-full sm:w-auto bg-white shadow-md rounded-xl px-5 py-3">
//           <select
//             className="w-full p-0.5 px-1 outline-none text-gray-700 text-lg"
//           >
//             <option value="">Category</option>
//             <option value="math">Math</option>
//             <option value="science">Science</option>
//             <option value="programming">Programming</option>
//           </select>
//           {/* Dropdown Arrow */}
//         </div>

//         {/* Apply Search Button */}
//         <div className="w-full sm:w-auto">
//           <button className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
//             Apply Search
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchSection;

import React from "react";

const SearchSection = () => {
  return (
    <div className="bg-white p-1 px-3 rounded-lg shadow-lg max-w-5xl mx-auto mt-8 mb-8">
      {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4">Explore Projects:</h2> */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        {/* Search Input */}
        <div className="flex-grow relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search for tutors..."
            className="w-full p-4 pl-10 outline-none text-gray-600 font-poppins text-lg"
          />
          <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-7 h-7 text-blue-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                  />
                </svg>
          </span>
        </div>

        {/* Dropdown for Category */}
        <div className="relative px-5 border-r-2 border-l-2 ml-4 w-full md:w-auto" >
        <div className="flex justify-center items-center">
        <i className="fa-solid fa-layer-group text-gray-600 text-xl"></i>
          <select
            className="w-full p-4 bg-white text-lg text-center font-poppins text-gray-800 appearance-none outline-none"
          >
            <option value="">Select Category</option>
            <option value="tech">Technology</option>
            <option value="design">Design</option>
            <option value="science">Science</option>
          </select>
          {/* <i class="fa-regular fa-square-caret-down text-lg text-gray-800"></i> */}
          {/* <box-icon type='logo' name='meta'></box-icon>     */}
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg> */}
          {/* <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-gray-500">
            ▼
          </div> */}
        </div>
        </div>

        {/* Find Button */}
        <button className="w-full md:w-auto btn font-semibold font-poppins text-xl bg-primary text-white px-4 py-2 rounded-lg">
          Apply Search
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
