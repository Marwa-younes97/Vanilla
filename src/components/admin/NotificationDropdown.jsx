// import React, { useState } from "react";
// import axios from "axios";


// const NotificationDropdown = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const toggleDropdown = async () => {
//     setOpen(!open);

//     if (!open && notifications.length === 0) {
//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("❌ Token not found. Please log in.");
//           return;
//         }

//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/notifications",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         setNotifications(response.data);
//       } catch (err) {
//         console.error("Error fetching notifications:", err.response || err);
//         if (err.response) {
//           if (err.response.status === 403) {
//             setError("🚫 You do not have permission to access notifications (403 Forbidden).");
//           } else if (err.response.status === 401) {
//             setError("❌ Unauthorized access. Please log in again.");
//           } else {
//             setError("❌ An error occurred while loading notifications.");
//           }
//         } else {
//           setError("❌ Network error. Please check your internet connection.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="relative inline-block text-left z-50">
//       {/* Notification Bell Icon */}
//       <button onClick={toggleDropdown} className="text-gray-700 text-2xl relative">
//         🔔
//         {notifications.length > 0 && (
//           <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
//             {notifications.length}
//           </span>
//         )}
//       </button>

//       {/* Dropdown List */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
//           <div className="p-4 font-semibold border-b text-purple-700">Notifications</div>

//           {loading && (
//             <div className="p-4 text-sm text-gray-500">⏳ Loading...</div>
//           )}

//           {error && (
//             <div className="p-4 text-sm text-red-500">{error}</div>
//           )}

//           {!loading && !error && notifications.length === 0 && (
//             <div className="p-4 text-sm text-gray-500">No notifications at the moment.</div>
//           )}

//           {!loading && !error && notifications.length > 0 && (
//             notifications.map((notif) => (
//               <div key={notif._id} className="p-4 border-b hover:bg-gray-50">
//                 <div className="text-sm text-gray-800">{notif.message}</div>
//                 <div className="text-xs text-gray-400 mt-1">
//                   {new Date(notif.createdAt).toLocaleString()}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;
// -------- شغال------------
// import React, { useState } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";


// const NotificationDropdown = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const toggleNotifications = async () => {
//     setOpen(!open);
//     if (!open && notifications.length === 0) {
//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("❌ Token not found. Please log in.");
//           return;
//         }

//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/notifications",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         setNotifications(response.data);
//       } catch (err) {
//         console.error("Error fetching notifications:", err.response || err);
//         if (err.response) {
//           if (err.response.status === 403) {
//             setError("🚫 You do not have permission to access notifications (403 Forbidden).");
//           } else if (err.response.status === 401) {
//             setError("❌ Unauthorized access. Please log in again.");
//           } else {
//             setError("❌ An error occurred while loading notifications.");
//           }
//         } else {
//           setError("❌ Network error. Please check your internet connection.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="relative inline-block text-left z-50">
//       {/* Bell button with style */}
//       <button
//         className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition relative"
//         onClick={toggleNotifications}
//       >
//         <FaBell size={22} />
//         {notifications.length > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//             {notifications.length}
//           </span>
//         )}
//       </button>

//       {/* Dropdown list */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
//           <div className="p-4 font-semibold border-b text-purple-700">Notifications</div>

//           {loading && <div className="p-4 text-sm text-gray-500">⏳ Loading...</div>}
//           {error && <div className="p-4 text-sm text-red-500">{error}</div>}
//           {!loading && !error && notifications.length === 0 && (
//             <div className="p-4 text-sm text-gray-500">No notifications at the moment.</div>
//           )}
//           {!loading && !error && notifications.length > 0 && (
//             notifications.map((notif) => (
//               <div key={notif._id} className="p-4 border-b hover:bg-gray-50">
//                 <div className="text-sm text-gray-800">{notif.message}</div>
//                 <div className="text-xs text-gray-400 mt-1">
//                   {new Date(notif.createdAt).toLocaleString()}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;


import React, { useState } from "react";
import axios from "axios";
import { IoNotificationsOutline } from "react-icons/io5"; // أيقونة مفرغة بالحدود السوداء فقط

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
          "https://bakeryproject-1onw.onrender.com/api/notifications",
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
            setError(
              "🚫 You do not have permission to access notifications (403 Forbidden)."
            );
          } else if (err.response.status === 401) {
            setError("❌ Unauthorized access. Please log in again.");
          } else {
            setError("❌ An error occurred while loading notifications.");
          }
        } else {
          setError("❌ Network error. Please check your internet connection.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative inline-block z-50">
      {/* الجرس بالحدود السوداء فقط بدون خلفية */}
      <IoNotificationsOutline
        size={28}
        color="black"
        className="cursor-pointer hover:scale-110 transition duration-200"
        onClick={toggleNotifications}
      />

      {/* شارة الإشعارات */}
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
          {notifications.length}
        </span>
      )}

      {/* القائمة المنسدلة */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
          <div className="p-4 font-semibold border-b text-purple-700">
            Notifications
          </div>

          {loading && (
            <div className="p-4 text-sm text-gray-500">⏳ Loading...</div>
          )}
          {error && <div className="p-4 text-sm text-red-500">{error}</div>}
          {!loading && !error && notifications.length === 0 && (
            <div className="p-4 text-sm text-gray-500">
              No notifications at the moment.
            </div>
          )}
          {!loading &&
            !error &&
            notifications.map((notif) => (
              <div key={notif._id} className="p-4 border-b hover:bg-gray-50">
                <div className="text-sm text-gray-800">{notif.message}</div>
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
