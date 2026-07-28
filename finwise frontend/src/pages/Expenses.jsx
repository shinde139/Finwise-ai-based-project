import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import {
  FaUtensils,
  FaPlane,
  FaShoppingBag,
  FaPlus,
  FaSearch,
  FaFilter,
  FaTimes,
  FaEdit,
  FaTrash,
  FaHome,
  FaBriefcase,
  FaHeartbeat,
  FaGraduationCap,
  FaFilm,
  FaGift,
} from "react-icons/fa";
import aiAPI from "../api/aiApi";
import Footer from "../components/Footer";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state for Add/Edit
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    expenseDate: "",
    categoryId: "",
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

  // Create a category map for quick lookups
  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach(cat => {
      map.set(cat.categoryId, cat);
    });
    return map;
  }, [categories]);

  // Fetch expenses and categories on component mount
  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  // Fetch Expenses - UPDATED to handle new DTO format
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      console.log("=== FETCHING EXPENSES ===");
      console.log("User ID:", userId);
      
      const response = await aiAPI.get(`/api/expense/${userId}`);
      console.log("Raw response data:", response.data);
      
      // The response now has categoryName directly in each expense object
      if (response.data && response.data.length > 0) {
        response.data.forEach((exp, index) => {
          console.log(`Expense ${index + 1}:`, {
            id: exp.expenseId,
            description: exp.description,
            amount: exp.amount,
            categoryName: exp.categoryName,  // Now directly available
            categoryId: exp.categoryId
          });
        });
      } else {
        console.log("No expenses found");
      }
      
      setExpenses(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch expenses");
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      console.log("=== FETCHING CATEGORIES ===");
      const response = await aiAPI.get(`/api/categories/user/${userId}`);
      console.log("Categories fetched:", response.data);
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Add Expense
  const addExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        expenseDate: formData.expenseDate,
      };
      
      console.log("=== ADDING EXPENSE ===");
      console.log("Category ID:", formData.categoryId);
      console.log("Expense data:", expenseData);
      
      const response = await aiAPI.post(`/api/expense/${userId}/${formData.categoryId}`, expenseData);
      console.log("Add expense response:", response.data);
      
      await fetchExpenses();
      resetForm();
      setShowModal(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
      console.error("Error adding expense:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update Expense
  const updateExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        expenseDate: formData.expenseDate,
      };
      
      console.log("=== UPDATING EXPENSE ===");
      console.log("Expense ID:", currentExpenseId);
      console.log("Expense data:", expenseData);
      
      await aiAPI.put(`/api/expense/${currentExpenseId}`, expenseData);
      await fetchExpenses();
      resetForm();
      setShowModal(false);
      setIsEditing(false);
      setCurrentExpenseId(null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update expense");
      console.error("Error updating expense:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    
    setLoading(true);
    try {
      await aiAPI.delete(`/api/expense/${id}`);
      await fetchExpenses();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete expense");
      console.error("Error deleting expense:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for Add
  const handleAddExpense = () => {
    setIsEditing(false);
    setCurrentExpenseId(null);
    setFormData({
      amount: "",
      description: "",
      expenseDate: new Date().toISOString().split("T")[0],
      categoryId: "",
    });
    setShowModal(true);
  };

  // Open modal for Edit - UPDATED to use categoryId directly
  const handleEditExpense = (expense) => {
    setIsEditing(true);
    setCurrentExpenseId(expense.expenseId);
    
    // Now categoryId is directly available in the expense object
    const categoryId = expense.categoryId || "";
    
    setFormData({
      amount: expense.amount?.toString() || "",
      description: expense.description || "",
      expenseDate: expense.expenseDate || "",
      categoryId: categoryId.toString(),
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      amount: "",
      description: "",
      expenseDate: "",
      categoryId: "",
    });
  };

  // Filter expenses by search term - UPDATED to use categoryName directly
  const filteredExpenses = expenses.filter(expense => {
    const searchLower = searchTerm.toLowerCase();
    const categoryName = expense.categoryName || "";  // Now directly available
    const description = expense.description || "";
    const amount = expense.amount?.toString() || "";
    
    return (
      description.toLowerCase().includes(searchLower) ||
      categoryName.toLowerCase().includes(searchLower) ||
      amount.includes(searchLower)
    );
  });

  // Get icon for category
  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return <FaShoppingBag />;
    
    const name = categoryName.toLowerCase();
    if (name.includes("food") || name.includes("dining") || name.includes("restaurant") || name.includes("eat") || name.includes("grocer")) 
      return <FaUtensils />;
    if (name.includes("travel") || name.includes("transport") || name.includes("flight") || name.includes("trip") || name.includes("fuel")) 
      return <FaPlane />;
    if (name.includes("shop") || name.includes("clothing") || name.includes("retail") || name.includes("buy") || name.includes("shopping")) 
      return <FaShoppingBag />;
    if (name.includes("home") || name.includes("rent") || name.includes("utility")) 
      return <FaHome />;
    if (name.includes("work") || name.includes("business") || name.includes("office")) 
      return <FaBriefcase />;
    if (name.includes("health") || name.includes("medical") || name.includes("fitness")) 
      return <FaHeartbeat />;
    if (name.includes("education") || name.includes("study") || name.includes("course")) 
      return <FaGraduationCap />;
    if (name.includes("entertainment") || name.includes("movie") || name.includes("game")) 
      return <FaFilm />;
    if (name.includes("gift") || name.includes("donation")) 
      return <FaGift />;
    return <FaShoppingBag />;
  };

  // Get color for category
  const getCategoryColor = (categoryName) => {
    if (!categoryName) return "from-purple-500 to-indigo-500";
    
    const name = categoryName.toLowerCase();
    if (name.includes("food") || name.includes("dining") || name.includes("restaurant") || name.includes("eat") || name.includes("grocer")) 
      return "from-blue-500 to-cyan-500";
    if (name.includes("travel") || name.includes("transport") || name.includes("flight") || name.includes("trip") || name.includes("fuel")) 
      return "from-green-500 to-emerald-500";
    if (name.includes("shop") || name.includes("clothing") || name.includes("retail") || name.includes("buy") || name.includes("shopping")) 
      return "from-pink-500 to-purple-500";
    if (name.includes("home") || name.includes("rent") || name.includes("utility")) 
      return "from-yellow-500 to-orange-500";
    if (name.includes("work") || name.includes("business") || name.includes("office")) 
      return "from-indigo-500 to-blue-500";
    if (name.includes("health") || name.includes("medical") || name.includes("fitness")) 
      return "from-red-500 to-pink-500";
    if (name.includes("education") || name.includes("study") || name.includes("course")) 
      return "from-teal-500 to-cyan-500";
    if (name.includes("entertainment") || name.includes("movie") || name.includes("game")) 
      return "from-purple-500 to-pink-500";
    if (name.includes("gift") || name.includes("donation")) 
      return "from-rose-500 to-red-500";
    return "from-purple-500 to-indigo-500";
  };

  // Calculate total expenses by category for summary cards - UPDATED
  const getCategorySummary = () => {
    const summary = {};
    expenses.forEach(exp => {
      const catName = exp.categoryName || "Uncategorized";  // Now directly available
      if (!summary[catName]) {
        summary[catName] = {
          total: 0,
          count: 0,
          categoryId: exp.categoryId,
        };
      }
      summary[catName].total += exp.amount || 0;
      summary[catName].count += 1;
    });
    return summary;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const categorySummary = getCategorySummary();
  const summaryCards = Object.entries(categorySummary).map(([name, data]) => ({
    title: name,
    amount: `₹${data.total.toFixed(2)}`,
    icon: getCategoryIcon(name),
    color: getCategoryColor(name),
    count: data.count,
  }));

  return (
    <div className="flex bg-[#070B28] text-white min-h-screen overflow-hidden">
      {/* STABLE/FIXED SIDEBAR */}
      <div className="fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* MAIN CONTENT - with left margin for sidebar */}
      <div className="flex-1 ml-64 overflow-y-auto h-screen p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Expenses Dashboard
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base lg:text-lg">
              Track and manage your daily expenses
            </p>
          </div>
          <button
            onClick={handleAddExpense}
            className="w-full lg:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 lg:py-4 rounded-2xl text-base lg:text-lg font-bold hover:scale-105 transition duration-300 shadow-lg"
          >
            <FaPlus />
            Add Expense
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-3 bg-[#11183C] px-5 py-4 rounded-2xl flex-1">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses by category, description, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-white"
            />
          </div>
          <button className="bg-[#11183C] px-6 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#1B2559] transition">
            <FaFilter />
            Filter
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && expenses.length === 0 && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* SUMMARY CARDS */}
        {!loading && summaryCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {summaryCards.map((item, index) => (
              <div
                key={index}
                className="bg-[#11183C] p-5 sm:p-6 rounded-3xl border border-[#1B2559] hover:scale-[1.02] transition duration-300 shadow-2xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-2xl sm:text-3xl`}
                    >
                      {item.icon}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mt-5">
                      {item.title}
                    </h2>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">
                      {item.amount}
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">{item.count} expense{item.count > 1 ? 's' : ''}</p>
                  </div>
                  <span className="text-green-400 text-base lg:text-lg font-bold">
                    {item.count > 0 ? `${Math.round(item.total / item.count)} avg` : '0'}
                  </span>
                </div>
                <div className="mt-6">
                  <div className="w-full h-3 bg-[#1B2559] rounded-full">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${item.color} w-3/4`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TABLE - REMOVED DEBUG SECTION */}
        <div className="bg-[#11183C] mt-10 p-4 sm:p-6 lg:p-8 rounded-3xl border border-[#1B2559]">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Recent Expenses
            </h1>
            <span className="text-cyan-400 text-sm sm:text-base">
              Total: {filteredExpenses.length} expenses
            </span>
          </div>

          {/* MOBILE SCROLL */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="text-gray-400 border-b border-[#1B2559]">
                  <th className="text-left py-4 px-2">Category</th>
                  <th className="text-left py-4 px-2">Description</th>
                  <th className="text-left py-4 px-2">Date</th>
                  <th className="text-left py-4 px-2">Amount</th>
                  <th className="text-left py-4 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">
                      {searchTerm ? "No expenses match your search" : "No expenses found. Add your first expense!"}
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => {
                    // Get category name directly from expense object
                    const categoryName = expense.categoryName || "Uncategorized";
                    
                    return (
                      <tr key={expense.expenseId} className="border-b border-[#1B2559] hover:bg-[#0F1635] transition">
                        <td className="py-5 px-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getCategoryColor(categoryName)} flex items-center justify-center text-sm text-white flex-shrink-0`}>
                              {getCategoryIcon(categoryName)}
                            </div>
                            <span className="font-medium">{categoryName}</span>
                          </div>
                        </td>
                        <td className="py-5 px-2">{expense.description || "N/A"}</td>
                        <td className="py-5 px-2">{formatDate(expense.expenseDate)}</td>
                        <td className="py-5 px-2 text-red-400 font-bold">
                          - ₹{expense.amount?.toFixed(2) || "0.00"}
                        </td>
                        <td className="py-5 px-2">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEditExpense(expense)}
                              className="text-blue-400 hover:text-blue-300 transition p-1"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => deleteExpense(expense.expenseId)}
                              className="text-red-400 hover:text-red-300 transition p-1"
                              title="Delete"
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Expense */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#11183C] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#1B2559] relative">
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
                setIsEditing(false);
                setCurrentExpenseId(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {isEditing ? "Edit Expense" : "Add New Expense"}
            </h2>

            <form onSubmit={isEditing ? updateExpense : addExpense}>
              <div className="space-y-4">
                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#070B28] border border-[#1B2559] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#070B28] border border-[#1B2559] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter description"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Amount (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-[#070B28] border border-[#1B2559] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    className="w-full bg-[#070B28] border border-[#1B2559] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-2xl font-bold hover:scale-[1.02] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : isEditing ? "Update Expense" : "Add Expense"}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* FOOTER - CONSTANT */}
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
}

export default Expenses;