import React, { useState, useEffect } from "react";
import { getTutorEarnings } from "../../../../services/api"; 
import { Calendar, Download, Filter, ArrowUpDown } from "lucide-react";
import * as XLSX from "xlsx";

const Statement = ({ tutorData }) => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const earningsData = await getTutorEarnings();
        setEarnings(earningsData);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching earnings data");
        console.error("Error fetching earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const exportToExcel = () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    
    const exportData = earnings.map(item => ({
      Date: new Date(item.date).toLocaleDateString(),
      Amount: `Rs. ${item.amount.toFixed(2)}`,
      Type: item.type,
      "Student ID": item.studentId
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Earnings");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const fileName = `earnings_statement_${new Date().toISOString().split('T')[0]}${fileExtension}`;
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    const filteredData = filterType === 'all' 
      ? [...earnings] 
      : earnings.filter(item => item.type === filterType);
      
    return filteredData.sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });
  };

  const getUniqueTypes = () => {
    return ['all', ...new Set(earnings.map(item => item.type))];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-base">Loading your earnings data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <p className="text-center text-red-600 dark:text-red-400 font-medium text-base">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 mx-auto block px-4 py-2 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors text-base"
        >
          Try Again
        </button>
      </div>
    );
  }

  const sortedData = getSortedData();
  const total = earnings.reduce((sum, item) => sum + item.amount, 0).toFixed(2);

  const getTypeColor = (type) => {
    switch(type) {
      case 'BookingFee':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'SessionFee':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Earnings Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">
              Track your earnings and performance
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <div className="inline-flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg text-base">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="font-medium">
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 dark:text-gray-400 text-base font-medium">Total Earnings</h3>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <span className="font-bold text-green-600 dark:text-green-400">Rs.</span>
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">Rs. {total}</p>
            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{earnings.length} transactions</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 dark:text-gray-400 text-base font-medium">Last Month</h3>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
              Rs. {earnings
                .filter(e => {
                  const date = new Date(e.date);
                  const lastMonth = new Date();
                  lastMonth.setMonth(lastMonth.getMonth() - 1);
                  return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
                })
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </p>
            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">Previous month earnings</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 dark:text-gray-400 text-base font-medium">Actions</h3>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Download className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button 
                onClick={exportToExcel} 
                className="flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-base"
              >
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </button>
              
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 text-base"
              >
                {getUniqueTypes().map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-base font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => sortData('date')}
                  >
                    <div className="flex items-center">
                      Date
                      {sortConfig.key === 'date' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-base font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => sortData('amount')}
                  >
                    <div className="flex items-center">
                      Earnings (Rs.)
                      {sortConfig.key === 'amount' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedData.map((earning) => (
                  <tr key={earning._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800 dark:text-gray-200">
                      {new Date(earning.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-green-600 dark:text-green-400">
                      Rs. {earning.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${getTypeColor(earning.type)}`}>
                        {earning.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800 dark:text-gray-200">
                      {earning.studentId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sortedData.length === 0 && (
            <div className="p-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <span className="text-gray-400 dark:text-gray-500 text-2xl font-bold">Rs.</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No earnings recorded</p>
              <p className="text-gray-400 dark:text-gray-500 text-base mt-1">
                {filterType !== 'all' ? 'Try selecting a different filter' : 'Your earnings will appear here once available'}
              </p>
            </div>
          )}
        </div>

        {earnings.length > 10 && (
          <div className="mt-4 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-base">
                Previous
              </button>
              <button className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-base">
                1
              </button>
              <button className="px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-base">
                2
              </button>
              <button className="px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-base">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statement;