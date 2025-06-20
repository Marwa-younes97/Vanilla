import React from "react";
import { Bell } from "lucide-react";

export default function UserNotifications({ notifications = [] }) {
  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000); // seconds
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return new Date(date).toLocaleDateString();
  };

  if (notifications.length === 0)
    return <p className="text-gray-600">No notifications yet.</p>;

  return (
    <div className="space-y-4 mt-4">
      <h2 className="text-2xl font-bold mb-6 text-pink-600">Notifications</h2>
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className="flex items-start gap-4 p-4 rounded-xl border border-pink-200 bg-white shadow-sm hover:shadow-md transition"
        >
          <div className="bg-pink-100 p-2 rounded-full">
            <Bell className="w-5 h-5 text-pink-500" />
          </div>
          <div className="flex-1">
            <p className="text-gray-800 font-medium">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {timeAgo(notification.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
