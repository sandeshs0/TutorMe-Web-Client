import React from "react";

const SortingOptions = () => {
    return (
        <div className="flex justify-center mt-4 mb-4">
            <button className="mr-4 px-4 py-2 bg-[#338fc4] text-white rounded-md hover:bg-blue-600 focus:outline-none" >
                Sort by Experience
            </button>
            <button className="px-4 py-2 mr-4 bg-[#424591] text-white rounded-md hover:bg-blue-600 focus:outline-none" >
                Sort by Fee
            </button>

            <select className="px-4 py-2 bg-[#e9e9fa] text-black rounded-md hover:bg-blue-50 focus:outline-none">
                <option value="">Filter by Subject</option>
                <option value="Programming">Programming</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Finance">Finance</option>
            </select>
        </div>
    );
};

export default SortingOptions;