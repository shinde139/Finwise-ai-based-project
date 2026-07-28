import React, { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import aiAPI from "../api/aiApi";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [displayNotifications, setDisplayNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await aiAPI.get(`/api/notifications/user/${userId}`);
      console.log("Notifications fetched:", response.data);
      
      let notificationsData = [];
      if (Array.isArray(response.data)) {
        notificationsData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        notificationsData = response.data.data;
      } else if (response.data && response.data.notifications && Array.isArray(response.data.notifications)) {
        notificationsData = response.data.notifications;
      } else {
        notificationsData = getSampleNotifications();
      }
      
      // Transform data
      const formattedNotifications = notificationsData.map((item) => ({
        id: item.id || item.notificationId || item._id || Math.random().toString(),
        title: item.title || item.message || item.heading || "Notification",
        message: item.message || item.description || item.body || "",
        time: item.time || item.createdAt || item.date || new Date().toISOString(),
        isRead: item.isRead || item.read || false,
        type: item.type || item.notificationType || "info"
      }));
      
      setNotifications(formattedNotifications);
      
      // Calculate counts
      const total = formattedNotifications.length;
      const unread = formattedNotifications.filter(n => !n.isRead).length;
      setTotalCount(total);
      setUnreadCount(unread);
      
      // Show only 2 notifications initially
      setDisplayNotifications(formattedNotifications.slice(0, 2));
      
      setError(null);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      const sampleData = getSampleNotifications();
      setNotifications(sampleData);
      const total = sampleData.length;
      const unread = sampleData.filter(n => !n.isRead).length;
      setTotalCount(total);
      setUnreadCount(unread);
      setDisplayNotifications(sampleData.slice(0, 2));
    } finally {
      setLoading(false);
    }
  };

  // Sample notifications
  const getSampleNotifications = () => {
    return [
      {
        id: "1",
        title: "Budget Alert",
        message: "You have exceeded 80% of your Food budget for this month.",
        time: new Date().toISOString(),
        isRead: false,
        type: "warning"
      },
      {
        id: "2",
        title: "Expense Added",
        message: "New expense of ₹500 added to Shopping category.",
        time: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        type: "expense"
      },
      {
        id: "3",
        title: "Income Received",
        message: "Salary of ₹50,000 has been credited to your account.",
        time: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
        type: "income"
      },
      {
        id: "4",
        title: "Savings Goal",
        message: "You're 75% close to your Vacation savings goal!",
        time: new Date(Date.now() - 172800000).toISOString(),
        isRead: true,
        type: "goal"
      }
    ];
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await aiAPI.put(`/api/notifications/${id}/read`);
      const updated = notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      setNotifications(updated);
      const unread = updated.filter(n => !n.isRead).length;
      setUnreadCount(unread);
      setDisplayNotifications(updated.slice(0, 2));
    } catch (error) {
      console.error("Error marking as read:", error);
      const updated = notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      setNotifications(updated);
      const unread = updated.filter(n => !n.isRead).length;
      setUnreadCount(unread);
      setDisplayNotifications(updated.slice(0, 2));
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await aiAPI.put(`/api/notifications/read-all/${userId}`);
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updated);
      setUnreadCount(0);
      setDisplayNotifications(updated.slice(0, 2));
    } catch (error) {
      console.error("Error marking all as read:", error);
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updated);
      setUnreadCount(0);
      setDisplayNotifications(updated.slice(0, 2));
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await aiAPI.delete(`/api/notifications/${id}`);
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
      const total = updated.length;
      const unread = updated.filter(n => !n.isRead).length;
      setTotalCount(total);
      setUnreadCount(unread);
      setDisplayNotifications(updated.slice(0, 2));
    } catch (error) {
      console.error("Error deleting notification:", error);
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
      const total = updated.length;
      const unread = updated.filter(n => !n.isRead).length;
      setTotalCount(total);
      setUnreadCount(unread);
      setDisplayNotifications(updated.slice(0, 2));
    }
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "Just now";
    try {
      const date = new Date(time);
      const now = new Date();
      const diff = now - date;
      
      if (diff < 60000) return "Just now";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      if (diff < 172800000) return "Yesterday";
      if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return "Just now";
    }
  };

  // Get icon based on type
  const getIcon = (type) => {
    const icons = {
      warning: "⚠️",
      info: "ℹ️",
      success: "✅",
      error: "❌",
      expense: "💳",
      income: "💰",
      budget: "📊",
      goal: "🎯"
    };
    return icons[type?.toLowerCase()] || "🔔";
  };

  // Get badge color
  const getBadgeColor = (type) => {
    const colors = {
      warning: "bg-yellow-500/20 text-yellow-400",
      info: "bg-blue-500/20 text-blue-400",
      success: "bg-green-500/20 text-green-400",
      error: "bg-red-500/20 text-red-400",
      expense: "bg-red-500/20 text-red-400",
      income: "bg-green-500/20 text-green-400",
      budget: "bg-cyan-500/20 text-cyan-400",
      goal: "bg-purple-500/20 text-purple-400"
    };
    return colors[type?.toLowerCase()] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="relative p-3 rounded-xl bg-[#0D1335] hover:bg-[#1B2559] transition"
      >
        <FaBell className="text-2xl text-gray-400" />
        {/* Show total count on bell icon when dropdown is closed */}
        {!isOpen && totalCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-bold">
            {totalCount > 99 ? '99+' : totalCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-[#11183C] rounded-3xl border border-[#26316A] shadow-2xl overflow-hidden z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#26316A] flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">Notifications</h2>
              <p className="text-xs text-gray-400">
                {totalCount} total · {unreadCount} unread
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition"
              >
                Mark All Read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-8">
                <p>{error}</p>
                <button 
                  onClick={fetchNotifications}
                  className="mt-2 text-sm text-cyan-400 hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : displayNotifications.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p className="text-4xl mb-2">🔔</p>
                <p>No notifications</p>
              </div>
            ) : (
              displayNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border-b border-[#26316A] hover:bg-[#0D1335] transition ${
                    !item.isRead ? "bg-[#0D1335]" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{getIcon(item.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm truncate">
                            {item.title}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(item.type)}`}>
                            {item.type || 'info'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(item.id);
                          }}
                          className="text-gray-500 hover:text-red-400 transition text-xs ml-2"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {item.message}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-500 text-xs">
                          {formatTime(item.time)}
                        </p>
                        {!item.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(item.id);
                            }}
                            className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - Show View All button if more than 2 notifications */}
          {totalCount > 2 && (
            <div className="p-3 border-t border-[#26316A] text-center">
              <button 
                className="text-sm text-cyan-400 hover:text-cyan-300 transition"
                onClick={() => {
                  setDisplayNotifications(notifications);
                }}
              >
                View All {totalCount} Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;