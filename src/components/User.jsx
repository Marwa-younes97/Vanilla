import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserNotifications from "./UserNotifications";
import Favorites from "./Favorites";

import { Pencil, Bell, User, MessageCircle, Star } from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    _id: "",
    favorites: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [messages, setMessages] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    fetch("https://bakeryproject-1onw.onrender.com/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
      })
      .then((data) => {
        const user = data.user;
        if (!user) {
          setError("User not found");
        } else {
          setUserData({
            name: user.name,
            email: user.email,
            image: user.image ? `${user.image}` : "/admin_image.jpg",
            _id: user._id,
            favorites: user.favorites || [],
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setError("Invalid file type. Please upload an image.");
        return;
      }
      setError(null);
      setImageFile(file);
      setUserData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("https://bakeryproject-1onw.onrender.com/api/contact/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user messages");
        return res.json();
      })
      .then((data) => {
        const repliedMessages = data.data.filter((msg) => msg.reply);
        setMessages(repliedMessages);

        if (repliedMessages.length > 0) {
          const latest = repliedMessages[0];
          const latestTime = new Date(latest.repliedAt);
          const threshold = new Date(Date.now() - 60 * 60 * 1000); // خلال آخر ساعة
          if (latestTime > threshold) {
            setHasNewMessages(true);
          }
        }
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
useEffect(() => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  fetch("https://bakeryproject-1onw.onrender.com/api/notifications", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    })
    .then((data) => setNotifications(data))
    .catch((err) => console.error("Error fetching notifications:", err));
}, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("https://bakeryproject-1onw.onrender.com/api/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notifications");
        return res.json();
      })
      .then((data) => {
        if (data?.length > 0) {
          const latest = data[0];
          const latestTime = new Date(latest.createdAt);
          const threshold = new Date(Date.now() - 60 * 60 * 1000); // آخر ساعة
          if (latestTime > threshold) {
            setHasNewNotifications(true);
          }
        }
      })
      .catch((err) => {
        console.error("Error checking notifications:", err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    if (imageFile) formData.append("image", imageFile);

    fetch("https://bakeryproject-1onw.onrender.com/api/auth/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update profile");
        return res.json();
      })
      .then((data) => {
        setSuccessMsg("Profile updated successfully");
        if (data.user?.image) {
          setUserData((prev) => ({
            ...prev,
            image: `https://bakeryproject-1onw.onrender.com/${data.user.image}`,
          }));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };
  const [sidebarImage, setSidebarImage] = useState(""); // صورة Sidebar
  useEffect(() => {
    if (userData.image) {
      const imagePath = userData.image.startsWith("blob:")
        ? userData.image
        : userData.image.startsWith("http")
        ? userData.image
        : `https://bakeryproject-1onw.onrender.com/${userData.image}`;
      setSidebarImage(imagePath);
    }
  }, [userData.image]);

  useEffect(() => {
  if (activeTab === "notifications" && hasNewNotifications) {
    setHasNewNotifications(false);
  }

  if (activeTab === "messages" && hasNewMessages) {
    setHasNewMessages(false);
  }
}, [activeTab]);

  function ProfileSkeleton() {
    return (
      <div className="p-6 animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
          <div className="flex flex-col gap-2">
            <div className="w-40 h-4 bg-gray-300 rounded"></div>
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="w-full h-10 bg-gray-200 rounded"></div>
          <div className="w-full h-10 bg-gray-200 rounded"></div>
          <div className="w-full h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const imageSrc = userData.image
    ? userData.image.startsWith("blob:")
      ? userData.image
      : userData.image.startsWith("http")
      ? userData.image
      : `https://bakeryproject-1onw.onrender.com/${userData.image}`
    : "/images/profile.png";

  if (loading) return <ProfileSkeleton />;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white ">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-pink-50 p-6 flex flex-col justify-between sticky top-0 h-screen overflow-auto">

        <div>
          <div className="flex items-center gap-3 mb-6">
            <img
              src={sidebarImage}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border"
            />

            <h1 className="text-gray-800 font-bold text-base">
              {userData.name?.split(" ")[0] || "User"}
            </h1>
          </div>

          <nav className="space-y-6">
            {[
              {
                label: "Profile",
                icon: <User className="w-5 h-5" />,
                id: "profile",
              },
              {
                label: "Messages",
                icon: (
                  <div className="relative">
                    <MessageCircle className="w-5 h-5" />
                    {hasNewMessages && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </div>
                ),
                id: "messages",
              },
              // { label: "Favorites", icon: <Star className="w-5 h-5" />, id: "favorites" },
              {
                label: "Favorites",
                icon: <Star className="w-5 h-5" />,
                id: "favorites",
              },
              {
                label: "Notifications",
                icon: (
                  <div className="relative">
                    <Bell className="w-5 h-5" />
                    {hasNewNotifications && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </div>
                ),
                id: "notifications",
              },
            ].map(({ label, icon, id }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 font-medium cursor-pointer bg-transparent border-none p-0 ${
                  activeTab === id ? "text-pink-600" : "text-black"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-pink-600 font-medium hover:text-pink-800 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Edit Profile</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <img
                src={imageSrc}
                alt="User profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    className="bg-pink-500 text-white px-4 py-2 rounded text-sm"
                    onClick={handleUploadClick}
                  >
                    Upload New Photo
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "email"].map((field) => (
                <div
                  key={field}
                  className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3"
                >
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={userData[field]}
                    onChange={handleChange}
                    className="bg-transparent text-sm text-gray-800 w-full outline-none"
                    placeholder={
                      field === "name" ? "Full Name" : "Email Address"
                    }
                    required
                  />
                  <div className="ml-2 p-2 bg-white rounded-full border border-gray-300">
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-400 hover:bg-pink-500 text-white text-sm font-semibold py-3 rounded-xl mt-2 transition"
              >
                Update Profile
              </button>
            </form>

            {successMsg && !error && (
              <p className="mt-4 text-green-600">{successMsg}</p>
            )}
            {error && <p className="mt-4 text-red-600">{error}</p>}
          </div>
        )}
        {activeTab === "messages" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-pink-600">Inbox</h2>

            {messages.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">
                You have no messages with replies yet.
              </p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className="flex items-start gap-4 bg-white shadow-sm border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex-shrink-0 bg-pink-100 text-pink-600 rounded-full w-10 h-10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-gray-800">
                          {msg.subject}
                        </h3>
                        {msg.repliedAt && (
                          <span className="text-xs text-gray-400">
                            {new Date(msg.repliedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{msg.reply}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "favorites" && (
          <div className="mt-4">
            <Favorites />
          </div>
        )}
{activeTab === "notifications" && (
  <div className="mt-4">
    <UserNotifications notifications={notifications} />
  </div>
)}

      </main>
    </div>
  );
}
