import React, { useState } from "react";
import axios from "axios";
import { IoNotificationsOutline } from "react-icons/io5";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleNotifications = async () => {
    setOpen(!open);
    if (!open && notifications.length === 0) {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("❌ Token not found. Please log in.");
          return;
        }

        const response = await axios.get(
          "https://bakeryproject-1onw.onrender.com/api/notifications/admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setNotifications(response.data);
      } catch (err) {
        console.error("Error fetching notifications:", err.response || err);
        if (err.response) {
          if (err.response.status === 403) {
            setError("🚫 You do not have permission to access notifications.");
          } else if (err.response.status === 401) {
            setError("❌ Unauthorized. Please log in again.");
          } else {
            setError("❌ Error loading notifications.");
          }
        } else {
          setError("❌ Network error. Check your connection.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative inline-block z-50">
      <IoNotificationsOutline
        size={28}
        color="black"
        className="cursor-pointer hover:scale-110 transition duration-200"
        onClick={toggleNotifications}
      />

      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
          {notifications.length}
        </span>
      )}

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-md shadow-lg
          max-h-[70vh] overflow-y-auto text-sm"
        >
          <div className="p-4 font-semibold border-b text-purple-700">
            Notifications
          </div>

          {loading && (
            <div className="p-4 text-gray-500">⏳ Loading...</div>
          )}
          {error && (
            <div className="p-4 text-red-500">{error}</div>
          )}
          {!loading && !error && notifications.length === 0 && (
            <div className="p-4 text-gray-500">No notifications available.</div>
          )}

          {!loading &&
            !error &&
            notifications.map((notif) => (
              <div
                key={notif._id}
                className="p-4 border-b hover:bg-gray-50"
              >
                <div className="text-gray-800">{notif.message}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(notif.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
