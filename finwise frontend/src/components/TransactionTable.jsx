import React, { useEffect, useState } from "react";
import aiAPI from "../api/aiApi";

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user ID from localStorage
  const getUserId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.userId || user.id;
      } catch (e) {
        return localStorage.getItem("userId") || 1;
      }
    }
    return localStorage.getItem("userId") || 1;
  };

  const userId = getUserId();

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = async () => {
    setLoading(true);
    try {
      // Using Transaction API
      const response = await aiAPI.get(`/api/transaction/${userId}`);
      console.log("Transactions fetched:", response.data);
      
      // Sort by date (newest first) and get top 5
      const sortedTransactions = response.data
        .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
        .slice(0, 5);
      
      setTransactions(sortedTransactions);
      setError(null);
    } catch (error) {
      console.log("Error fetching transactions:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return date;
    }
  };

  // Get color based on transaction type
  const getTransactionColor = (type) => {
    return type === "CREDIT" ? "text-green-400" : "text-red-400";
  };

  // Get category badge color
  const getCategoryColor = (categoryName) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes("food") || name.includes("dining") || name.includes("restaurant") || name.includes("eat") || name.includes("grocer")) {
      return "bg-blue-500/20 text-blue-400";
    } else if (name.includes("travel") || name.includes("transport") || name.includes("flight") || name.includes("trip") || name.includes("fuel")) {
      return "bg-cyan-500/20 text-cyan-400";
    } else if (name.includes("shopping") || name.includes("retail") || name.includes("clothing") || name.includes("buy")) {
      return "bg-pink-500/20 text-pink-400";
    } else if (name.includes("salary") || name.includes("income") || name.includes("payment") || name.includes("credit")) {
      return "bg-green-500/20 text-green-400";
    } else if (name.includes("bills") || name.includes("utility") || name.includes("electricity") || name.includes("water")) {
      return "bg-yellow-500/20 text-yellow-400";
    } else {
      return "bg-purple-500/20 text-purple-400";
    }
  };

  return (
    <div className="bg-[#11183C] p-5 rounded-3xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
          Recent Transactions
        </h1>
        <button
          onClick={getTransactions}
          className="text-cyan-400 text-sm md:text-base hover:text-cyan-300 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-xl mb-4 text-center">
          {error}
          <button 
            onClick={getTransactions}
            className="ml-3 underline hover:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && transactions.length === 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}

      {/* DESKTOP */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-gray-400 border-b border-[#1B2559]">
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Category</th>
              <th className="text-left py-3">Description</th>
              <th className="text-left py-3">Type</th>
              <th className="text-left py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((item) => {
                // ✅ IMPORTANT: Get category name directly from DTO
                const categoryName = item.categoryName || "Uncategorized";
                
                return (
                  <tr key={item.transactionId} className="border-b border-[#1B2559] hover:bg-[#0D1335] transition">
                    <td className="py-4 text-sm">
                      {formatDate(item.transactionDate)}
                    </td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(categoryName)}`}>
                        {categoryName}
                      </span>
                    </td>
                    <td>{item.description || "N/A"}</td>
                    <td>
                      <span className={`text-xs font-bold ${item.transactionType === "CREDIT" ? "text-green-400" : "text-orange-400"}`}>
                        {item.transactionType === "CREDIT" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className={`font-bold ${getTransactionColor(item.transactionType)}`}>
                      {item.transactionType === "CREDIT" ? "+" : "-"}₹{item.amount?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No Transactions Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="md:hidden space-y-4">
        {transactions.length > 0 ? (
          transactions.map((item) => {
            const categoryName = item.categoryName || "Uncategorized";
            
            return (
              <div
                key={item.transactionId}
                className="bg-[#0D1335] p-4 rounded-2xl border border-[#1B2559]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(categoryName)}`}>
                      {categoryName}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${item.transactionType === "CREDIT" ? "text-green-400" : "text-orange-400"}`}>
                    {item.transactionType === "CREDIT" ? "Income" : "Expense"}
                  </span>
                </div>

                <div className="mt-3">
                  <p className="text-gray-400 text-xs">Description</p>
                  <p className="mt-1 font-medium">{item.description || "N/A"}</p>
                </div>

                <div className="flex justify-between mt-3">
                  <div>
                    <p className="text-gray-400 text-xs">Date</p>
                    <p className="mt-1 text-sm">{formatDate(item.transactionDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Amount</p>
                    <p className={`font-bold text-lg ${getTransactionColor(item.transactionType)}`}>
                      {item.transactionType === "CREDIT" ? "+" : "-"}₹{item.amount?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400 py-6">
            No Transactions Found
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionTable;