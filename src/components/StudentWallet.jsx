import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Tablicious from "react-tablicious";
import { toast } from "sonner";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  fetchWalletTransactions,
  initiateWalletTransaction,
} from "../services/api";
const SortButton = ({ active, ascending, onClick }) => (
  <button
    onClick={onClick}
    className={`ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
      active ? "text-blue-600 dark:text-blue-400" : "text-gray-400"
    }`}
  >
    <ArrowUpDown size={16} />
  </button>
);

const TableHeader = ({ columns, sortConfig, onSort }) => (
  <thead className="bg-gray-100 dark:bg-gray-800">
    <tr>
      {columns.map((column) => (
        <th
          key={column.field}
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
          <div className="flex items-center">
            {column.headerName}
            {column.sortable && (
              <SortButton
                active={sortConfig.field === column.field}
                ascending={sortConfig.direction === "asc"}
                onClick={() => onSort(column.field)}
              />
            )}
          </div>
        </th>
      ))}
    </tr>
  </thead>
);

const TableRow = ({ row, columns }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
    {columns.map((column) => (
      <td
        key={column.field}
        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
      >
        <p
          className={`${
            column.field === "amount"
              ? "bg-green-200 text-center rounded-lg py-1 px- border-2 dark:border-green-800 border-green-400 font-bold dark:bg-green-900/30 text-green-800 dark:text-green-200"
              : "text-gray-900 dark:text-gray-100"
          } transition-colors duration-200`}
        >
          {row[column.field]}
        </p>
      </td>
    ))}
  </tr>
);

const CustomTable = ({ data, columns, pageSize = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: "asc",
  });

  // Sorting logic
  const handleSort = (field) => {
    setSortConfig((prevSort) => ({
      field,
      direction:
        prevSort.field === field && prevSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // Filter
    if (searchQuery) {
      processedData = processedData.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort
    if (sortConfig.field) {
      processedData.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        // Handle numeric values (including those with "Rs. " prefix)
        const aNum = parseFloat(aValue.toString().replace(/[^0-9.-]+/g, ""));
        const bNum = parseFloat(bValue.toString().replace(/[^0-9.-]+/g, ""));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        // Handle string values
        return sortConfig.direction === "asc"
          ? aValue.toString().localeCompare(bValue.toString())
          : bValue.toString().localeCompare(aValue.toString());
      });
    }

    return processedData;
  }, [data, searchQuery, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader
            columns={columns.map((col) => ({ ...col, sortable: true }))}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((row, index) => (
              <TableRow key={index} row={row} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredAndSortedData.length)} of{" "}
          {filteredAndSortedData.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700
                     transition-colors duration-150"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                Math.abs(currentPage - page) <= 1
            )
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="text-gray-500 dark:text-gray-400">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md transition-colors duration-150 ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700
                     transition-colors duration-150"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const WalletPage = ({ studentData }) => {
  const walletBalance = studentData.walletBalance || 0;
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const { darkMode } = useDarkMode(); // Add this line

  const deductionData = [
    {
      sn: 1,
      date: "2025-01-01",
      tutor: "John Doe",
      duration: "2 hrs",
      rate: "Rs. 1000",
      deductedAmount: "Rs. 2000",
    },
    {
      sn: 2,
      date: "2025-01-05",
      tutor: "Jane Smith",
      duration: "1 hr",
      rate: "Rs. 1500",
      deductedAmount: "Rs. 1500",
    },
    {
      sn: 3,
      date: "2025-01-10",
      tutor: "Mike Johnson",
      duration: "3 hrs",
      rate: "Rs. 800",
      deductedAmount: "Rs. 2400",
    },
  ];

  //   const transactionResponse = await fetchWalletTransactions(studentData.id);
  //   console.log("Balance Load Data:", transactionResponse);
  // const balanceLoadData = transactionResponse.transactions;
  // console.log
  // const balanceLoadData = [
  //   {
  //     sn: 1,
  //     date: "2024-12-30",
  //     method: "Credit Card",
  //     amount: "Rs. 3000",
  //   },
  //   {
  //     sn: 2,
  //     date: "2025-01-02",
  //     method: "PayPal",
  //     amount: "Rs. 2000",
  //   },
  //   {
  //     sn: 3,
  //     date: "2025-01-15",
  //     method: "Bank Transfer",
  //     amount: "Rs. 5000",
  //   },
  // ];

  const deductionColumns = [
    { headerName: "SN", field: "sn" },
    { headerName: "Date", field: "date" },
    { headerName: "Tutor", field: "tutor" },
    { headerName: "Duration", field: "duration" },
    { headerName: "Rate (Per Hour)", field: "rate" },
    { headerName: "Deducted Amount", field: "deductedAmount" },
  ];

  const balanceLoadColumns = [
    { headerName: "SN", field: "sn" },
    { headerName: "Date", field: "paymentDate" },
    { headerName: "Method", field: "paymentGateway" },
    { headerName: "Amount", field: "amount" },
  ];

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true); // Set loading to true
      setTimeout(async () => {
        try {
          // if (!studentData.id) return; // Prevent API call if student ID is not available
          const transactionResponse = await fetchWalletTransactions();
          console.log("Balance Load Data:", transactionResponse);
          const balanceLoadData = transactionResponse.transactions;
          console.log("Balance Load Data:", balanceLoadData);
          const formattedTransactions = transactionResponse.transactions.map(
            (txn, index) => ({
              sn: index + 1,
              paymentDate: new Date(txn.paymentDate).toLocaleDateString(),
              paymentGateway: txn.paymentGateway,
              amount: `Rs. ${txn.amount}`,
            })
          );
          setTransactions(formattedTransactions);
        } catch (err) {
          console.error("Error loading transactions:", err.message);
          toast.error("Failed to load transactions.");
        } finally {
          setLoading(false);
        }
      }, 2000);
    };
    loadTransactions();
  }, [studentData]);

  const handleLoadBalance = async () => {
    try {
      setLoading(true);
      if (!amount || isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount.", {
          position: "bottom-right",
        });
        return;
      }

      const paymentGateway = "Khalti";

      // Step 1: Initiate transaction on the backend
      const initiateResponse = await initiateWalletTransaction(
        studentData.id, // Replace with student ID from props
        amount,
        paymentGateway
      );

      const { transactionId, payment_url, pidx } = initiateResponse;
      localStorage.setItem("transactionID", transactionId);
      // Step 2: Configure Khalti Checkout with the payment details
      // const checkout = new KhaltiCheckout({
      //   ...khaltiConfig,
      //   eventHandler: {
      //     onSuccess: async (payload) => {
      //       try {
      //         console.log("Khalti Payment Success:", payload);

      //         // Step 3: Verify the transaction with the backend
      //         const verifyResponse = await confirmWalletTransaction(
      //           transactionId,
      //           pidx // Using pidx to verify the transaction
      //         );

      //         if (verifyResponse.success) {
      //           // Update wallet balance in UI
      //           setWalletBalance(walletBalance + amount);
      //           toast.success("Wallet loaded successfully!");
      //         } else {
      //           toast.error("Transaction verification failed.");
      //         }
      //       } catch (err) {
      //         console.error("Error verifying transaction:", err.message);
      //         toast.error("Failed to verify transaction.");
      //       }
      //     },
      //     onError: (error) => {
      //       console.error("Khalti Payment Error:", error);
      //       toast.error("Payment failed. Please try again.");
      //     },
      //     onClose: () => {
      //       console.log("Khalti Payment Widget Closed.");
      //     },
      //   },
      // });
      if (payment_url) {
        // Step 2: Redirect the user to the payment URL provided by Khalti
        window.location.href = payment_url;

        // Optionally, you can add a loading indicator while waiting for the user to complete the payment
      } else {
        toast.error("Failed to get payment URL. Please try again.");
      }

      // Step 4: Open Khalti checkout widget
      // checkout.show({ amount: amount * 100 }); // Amount in paisa
    } catch (err) {
      console.error("Error initiating wallet transaction:", err.message);
      toast.error("Failed to initiate wallet transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 font-poppins min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Payment Modal */}
      <dialog id="payment_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white dark:bg-gray-800 shadow-xl relative">
          {/* Modal Title */}
          <h3 className="font-bold text-2xl text-gray-900 dark:text-gray-100 mb-6">
            Enter Amount
          </h3>

          {/* Input Field */}
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 text-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />

          {/* Validation Error Message */}
          {amount <= 50 && (
            <p className="text-red-500 text-sm mt-2">
              Amount must be greater than 50.
            </p>
          )}

          {/* Modal Actions */}
          <div className="modal-action mt-8">
            {/* Close Button */}
            <form method="dialog">
              <button className="btn btn-ghost text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                Close
              </button>
            </form>

            {/* Pay with Khalti Button */}
            <button
              onClick={handleLoadBalance}
              disabled={amount <= 50} // Disable button if amount is invalid
              className="btn bg-purple-800 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-purple-500 disabled:text-white disabled:cursor-not-allowed"
            >
              Pay with Khalti
            </button>
          </div>

          {/* Khalti Logo at Bottom Left */}
          <div className="absolute bottom-2 left-4 flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Payment Partner:
            </span>
            <img
              src="https://encdn.ratopati.com/media/news/khalti_ELEhMcPi9q_8KQHgO7gag.png" // Replace with your Khalti logo URL
              alt="Khalti Logo"
              className="h-6"
            />
          </div>
        </div>
      </dialog>
      {/* Payment Modal End */}
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-indigo-800 via-blue-700 to-cyan-700 text-white p-8 rounded-xl flex justify-between items-center shadow-lg transition-transform duration-200 hover:shadow-xl">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-blue-100">
            Wallet Balance
          </h2>
          <p className="text-5xl font-bold">
            {loading ? (
              <Skeleton
                width={100}
                height={40}
                borderRadius={8}
                baseColor={darkMode ? "#374151" : "#e5e7eb"}
                // baseColor={"#374151"}
                // highlightColor={"#f3f4f6"}
                highlightColor={darkMode ? "#4b5563" : "#f3f4f6"}
              />
            ) : (
              `Rs. ${walletBalance.toFixed(2)}`
            )}
          </p>
        </div>
        <button
          // onClick={handleLoadBalance}
          onClick={() => document.getElementById("payment_modal").showModal()}
          className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg shadow-md hover:shadow-lg font-semibold"
        >
          <i className="fas fa-wallet mr-2"></i>
          Load Balance
        </button>
      </div>

      {/* Tables Section */}
      <div className=" grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Deductions Table */}
        {/* <div className="bg-slate-100 dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200">
          <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            Recent Deductions
          </h3>
          <CustomTable
            data={deductionData}
            columns={deductionColumns}
            pageSize={5}
          />
        </div> */}

        {/* Balance Load Transactions Table */}
        <div className="bg-slate-100 dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200">
          <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            Balance Load Transactions
          </h3>
          {loading ? (
            // <p className="text-gray-600 dark:text-gray-300">
            //   Loading transactions...
            // </p>
            <Skeleton
              count={6}
              height={30}
              borderRadius={8}
              className="mb-2"
              // baseColor={"#e5e7eb"}
              baseColor={darkMode ? "#374151" : "#e5e7eb"}
              highlightColor={darkMode ? "#4b5563" : "#f3f4f6"}
              // highlightColor={"#f3f4f6"}
            />
          ) : transactions.length > 0 ? (
            <CustomTable
              data={transactions}
              columns={balanceLoadColumns}
              pageSize={7}
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No transactions found.
            </p>
          )}
        </div>
        <div className="bg-slate-100 dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200">
          <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            Balance Load Transactions
          </h3>
          {loading ? (
            // <p className="text-gray-600 dark:text-gray-300">
            //   Loading transactions...
            // </p>
            <Skeleton
              count={6}
              height={30}
              borderRadius={8}
              className="mb-2"
              // baseColor={"#e5e7eb"}
              baseColor={darkMode ? "#374151" : "#e5e7eb"}
              highlightColor={darkMode ? "#4b5563" : "#f3f4f6"}
              // highlightColor={"#f3f4f6"}
            />
          ) : transactions.length > 0 ? (
            <Tablicious
              data={transactions}
              columns={balanceLoadColumns}
              pageSize={7}
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No transactions found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
