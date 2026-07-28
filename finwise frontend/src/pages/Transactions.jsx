import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import transactionAPI from "../api/aiApi";
import Footer from "../components/Footer";
import {
  FaFilter,
  FaMagnifyingGlass,
} from "react-icons/fa6";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    transactionType: "DEBIT",
    amount: "",
    description: "",
    transactionDate: "",
    categoryId: ""
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    incoming: "₹0",
    outgoing: "₹0",
    cards: 8
  });

  // Get user ID from localStorage
  const getUserId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.userId || user.id;
      } catch (e) {
        return 1;
      }
    }
    return 1;
  };

  const userId = getUserId();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  // ================= GET CATEGORIES =================
  const fetchCategories = async () => {
    try {
      const response = await transactionAPI.get(`/api/categories/user/${userId}`);
      console.log("Categories fetched:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ================= GET TRANSACTIONS =================
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.get(`/api/transaction/${userId}`);
      console.log("Transactions : ", response.data);
      
      if (response.data && response.data.length > 0) {
        response.data.forEach((transaction, index) => {
          console.log(`Transaction ${index + 1}:`, {
            id: transaction.transactionId,
            description: transaction.description,
            amount: transaction.amount,
            categoryName: transaction.categoryName,
            categoryId: transaction.categoryId
          });
        });
      }
      
      setTransactions(response.data);
      calculateStats(response.data);
      setError(null);
    } catch (error) {
      console.error("Transaction Fetch Error:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // ================= STATISTICS =================
  const calculateStats = (data) => {
    let incoming = 0;
    let outgoing = 0;

    data.forEach((transaction) => {
      if (
        transaction.transactionType === "CREDIT" ||
        transaction.transactionType === "Income"
      ) {
        incoming += transaction.amount || 0;
      } else {
        outgoing += transaction.amount || 0;
      }
    });

    setStats({
      total: data.length,
      incoming: `₹${incoming.toLocaleString()}`,
      outgoing: `₹${outgoing.toLocaleString()}`,
      cards: 8
    });
  };

  // ================= ADD TRANSACTION =================
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const transactionData = {
        transactionType: formData.transactionType,
        amount: Number(formData.amount),
        description: formData.description,
        transactionDate: formData.transactionDate
      };

      await transactionAPI.post(
        `/api/transaction/${userId}/${formData.categoryId}`,
        transactionData
      );

      await fetchTransactions();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Add Transaction Error:", error);
      setError("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const transactionId = selectedTransaction.transactionId;
      const updateData = {
        transactionType: formData.transactionType,
        amount: Number(formData.amount),
        description: formData.description,
        transactionDate: formData.transactionDate,
        category: { categoryId: parseInt(formData.categoryId) }
      };

      await transactionAPI.put(
        `/api/transaction/${transactionId}`,
        updateData
      );

      await fetchTransactions();
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error("Update Error:", error);
      setError("Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDeleteTransaction = async (transaction) => {
    const id = transaction.transactionId;
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await transactionAPI.delete(`/api/transaction/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error("Delete Error:", error);
      setError("Failed to delete transaction");
    }
  };

  // ================= EDIT MODAL =================
  const openEditModal = (transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      transactionType: transaction.transactionType || "DEBIT",
      amount: transaction.amount || "",
      description: transaction.description || "",
      transactionDate: transaction.transactionDate || "",
      categoryId: transaction.categoryId?.toString() || ""
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      transactionType: "DEBIT",
      amount: "",
      description: "",
      transactionDate: "",
      categoryId: ""
    });
    setSelectedTransaction(null);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // ================= SEARCH =================
  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
    <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
      {/* STABLE/FIXED SIDEBAR */}
      <div className="fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* MAIN CONTENT - with left margin for sidebar */}
      <div className="flex-1 ml-64 overflow-y-auto h-screen p-4 sm:p-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Transaction Center
        </h1>
        <p className="text-gray-400 mb-8">
          Monitor and manage all financial activities
        </p>

        <button
          onClick={() => setShowAddModal(true)}
          className="
            bg-gradient-to-r 
            from-cyan-500 
            to-blue-600
            px-6 py-3
            rounded-xl
            font-bold
            mb-6
            hover:scale-105
            transition
            duration-300
          "
        >
          + New Transaction
        </button>

        {error && (
          <div className="
            bg-red-500/20
            border
            border-red-500
            p-3
            rounded-xl
            mb-5
          ">
            {error}
          </div>
        )}

        {/* CARDS */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2
          lg:grid-cols-4 
          gap-5
          mb-8
        ">
          <div className="bg-[#11183C] p-6 rounded-3xl">
            <p>Total Transactions</p>
            <h1 className="text-4xl font-bold">
              {stats.total}
            </h1>
          </div>

          <div className="bg-[#11183C] p-6 rounded-3xl">
            <p className="text-gray-400">Incoming</p>
            <h1 className="text-green-400 text-3xl">
              {stats.incoming}
            </h1>
          </div>

          <div className="bg-[#11183C] p-6 rounded-3xl">
            <p className="text-gray-400">Outgoing</p>
            <h1 className="text-red-400 text-3xl">
              {stats.outgoing}
            </h1>
          </div>

          <div className="bg-[#11183C] p-6 rounded-3xl">
            <p>Payment Cards</p>
            <h1 className="text-4xl">
              08
            </h1>
          </div>
        </div>

        {/* SEARCH */}
        <div className="
          flex 
          gap-4 
          mb-6
        ">
          <div className="
            bg-[#11183C]
            p-3
            rounded-xl
            flex-1
            flex
            items-center
            gap-3
          ">
            <FaMagnifyingGlass />
            <input
              className="
                bg-transparent
                outline-none
                w-full
              "
              placeholder="Search transaction by description or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={fetchTransactions}
            className="
              bg-[#11183C]
              px-5
              rounded-xl
              hover:bg-[#1B2559]
              transition
            "
          >
            <FaFilter />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <p>No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((item) => {
            const categoryName = item.categoryName || "Uncategorized";
            
            return (
              <div
                key={item.transactionId}
                className="
                  bg-[#11183C]
                  p-5
                  rounded-3xl
                  mb-4
                  hover:bg-[#1B2559]
                  transition
                  duration-200
                "
              >
                <div className="
                  flex
                  flex-col
                  sm:flex-row
                  justify-between
                  items-start
                  sm:items-center
                  gap-4
                ">
                  <div className="flex gap-4 items-start sm:items-center">
                    {/* Category Badge - Replaces icon circle */}
                    <div className="
                      w-14
                      h-14
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    ">
                      <span className={`px-3 py-2 rounded-xl text-sm font-medium ${getCategoryColor(categoryName)}`}>
                        {categoryName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h2 className="font-bold text-xl">
                        {item.description}
                      </h2>
                      <p className="text-gray-400">
                        {categoryName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDate(item.transactionDate)}
                      </p>
                    </div>
                  </div>

                  <h2
                    className={`${getTransactionColor(item.transactionType)} text-xl font-bold`}
                  >
                    {item.transactionType === "CREDIT" ? "+" : "-"}
                    ₹{item.amount?.toFixed(2)}
                  </h2>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(item)}
                      className="
                        bg-blue-500/20
                        px-4
                        py-2
                        rounded-xl
                        hover:bg-blue-500/30
                        transition
                      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteTransaction(item)}
                      className="
                        bg-red-500/20
                        px-4
                        py-2
                        rounded-xl
                        hover:bg-red-500/30
                        transition
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* FOOTER - CONSTANT */}
        <div className="mt-10">
          <Footer />
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="
          fixed
          inset-0
          bg-black/70
          flex
          items-center
          justify-center
          z-50
          p-4
        ">
          <form
            onSubmit={handleAddTransaction}
            className="
              bg-[#11183C]
              p-8
              rounded-3xl
              space-y-4
              w-full
              max-w-md
              max-h-[90vh]
              overflow-y-auto
            "
          >
            <h2 className="text-2xl font-bold">
              Add Transaction
            </h2>

            {/* Transaction Type */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Transaction Type *
              </label>
              <select
                className="
                  w-full
                  bg-[#0D1335]
                  border
                  border-[#26316A]
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-cyan-500
                "
                value={formData.transactionType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transactionType: e.target.value
                  })
                }
                required
              >
                <option value="DEBIT">Debit (Expense)</option>
                <option value="CREDIT">Credit (Income)</option>
              </select>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Category *
              </label>
              <select
                className="
                  w-full
                  bg-[#0D1335]
                  border
                  border-[#26316A]
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-cyan-500
                "
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: e.target.value
                  })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Amount (₹) *
              </label>
              <input
                className="
                  w-full
                  bg-[#0D1335]
                  border
                  border-[#26316A]
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-cyan-500
                "
                placeholder="Enter amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value
                  })
                }
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description *
              </label>
              <input
                className="
                  w-full
                  bg-[#0D1335]
                  border
                  border-[#26316A]
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-cyan-500
                "
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value
                  })
                }
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Transaction Date *
              </label>
              <input
                className="
                  w-full
                  bg-[#0D1335]
                  border
                  border-[#26316A]
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-cyan-500
                "
                type="date"
                value={formData.transactionDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transactionDate: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  flex-1
                  p-3
                  rounded-xl
                  font-bold
                  hover:scale-105
                  transition
                "
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="
                  bg-red-500/20
                  flex-1
                  p-3
                  rounded-xl
                  font-bold
                  hover:bg-red-500/30
                  transition
                "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="
          fixed
          inset-0
          bg-black/70
          flex
          items-center
          justify-center
          z-50
          p-4
        ">
          <form
            onSubmit={handleUpdateTransaction}
            className="
              bg-[#11183C]
              p-8
              rounded-3xl
              space-y-4
              w-full
              max-w-md
              max-h-[90vh]
              overflow-y-auto
            "
          >
            <h2 className="text-2xl font-bold">
              Edit Transaction
            </h2>

            {/* Transaction Type */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Transaction Type *
              </label>
              <select
                className="
                  w-full
                  bg-[#0D1335]
                  border
                  border-[#26316A]
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-cyan-500
                "
                value={formData.transactionType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transactionType: e.target.value
                  })
                }
                required
              >
                <option value="DEBIT">Debit (Expense)</option>
                <option value="CREDIT">Credit (Income)</option>
              </select>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Category *
              </label>
              <select
                className="
                  w-full
                  bg-[#0D1335]
                  border
                  border-[#26316A]
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-cyan-500
                "
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: e.target.value
                  })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Amount (₹) *
              </label>
              <input
                className="
                  w-full
                  bg-[#0D1335]
                  border
                  border-[#26316A]
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-cyan-500
                "
                placeholder="Enter amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value
                  })
                }
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description *
              </label>
              <input
                className="
                  w-full
                  bg-[#0D1335]
                  border
                  border-[#26316A]
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-cyan-500
                "
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value
                  })
                }
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Transaction Date *
              </label>
              <input
                className="
                  w-full
                  bg-[#0D1335]
                  border
                  border-[#26316A]
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-cyan-500
                "
                type="date"
                value={formData.transactionDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transactionDate: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  flex-1
                  p-3
                  rounded-xl
                  font-bold
                  hover:scale-105
                  transition
                "
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="
                  bg-red-500/20
                  flex-1
                  p-3
                  rounded-xl
                  font-bold
                  hover:bg-red-500/30
                  transition
                "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Transactions;