// components/UserNotifications.jsx
import React, { useEffect, useState } from "react";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("You must be logged in to view notifications.");
      setLoading(false);
      return;
    }

    fetch("https://bakeryproject-1onw.onrender.com/api/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notifications.");
        return res.json();
      })
      .then((data) => {
        setNotifications(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-600">Loading notifications...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (notifications.length === 0)
    return <p className="text-gray-600">No notifications yet.</p>;

  return (
    <ul className="space-y-4">
      {notifications.map((notification) => (
        <li
          key={notification._id}
          className="p-4 rounded-lg shadow bg-pink-50 border border-pink-200"
        >
          <p className="text-gray-800 font-medium">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
