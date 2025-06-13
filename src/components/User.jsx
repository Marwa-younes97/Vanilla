import React, { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import UserNotifications from "./UserNotifications"; // غيّري المسار حسب مكان الملف

import {
  Pencil,
  Bell,
  User,
  Settings,
  HelpCircle,
  Clock,
  MessageCircle,
  Star,
} from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    _id: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.id || decoded._id;
    } catch (err) {
      setError("Invalid token");
      setLoading(false);
      return;
    }

    fetch("https://bakeryproject-1onw.onrender.com/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        const user = data.find((u) => u._id === userId);
        if (!user) {
          setError("User not found");
        } else {
          setUserData({
            name: user.name,
            email: user.email,
            image: user.image || "../../public/admin_image.jpg",
            _id: user._id,
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

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
      .then(() => {
        setSuccessMsg("Profile updated successfully");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  const imageSrc = userData.image
    ? userData.image.startsWith("http")
      ? userData.image
      : `https://bakeryproject-1onw.onrender.com/${userData.image}`
    : "/images/profile.png";

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white py-16">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-pink-50 p-6 flex flex-col justify-between min-h-screen">
        <div>
          <h1 className="text-gray-800 font-bold text-base mb-6">
            {userData.name?.split(" ")[0] || "User"}
          </h1>
          <nav className="space-y-6">
            {[
              {
                label: "Profile",
                icon: <User className="w-5 h-5" />,
                id: "profile",
              },
              {
                label: "Messages",
                icon: <MessageCircle className="w-5 h-5" />,
                id: "messages",
              },
              {
                label: "Favorites",
                icon: <Star className="w-5 h-5" />,
                id: "favorites",
                action: () => navigate("/favorites"),
              },
              {
                label: "Notifications",
                icon: <Bell className="w-5 h-5" />,
                id: "notifications",
              },
              {
                label: "Activity",
                icon: <Clock className="w-5 h-5" />,
                id: "activity",
              },
              {
                label: "Settings",
                icon: <Settings className="w-5 h-5" />,
                id: "settings",
              },
              {
                label: "Help",
                icon: <HelpCircle className="w-5 h-5" />,
                id: "help",
              },
            ].map(({ label, icon, id, action }) => (
              <button
                key={id}
                onClick={() => {
                  if (action) {
                    action();
                  } else {
                    setActiveTab(id);
                  }
                }}
                className={`flex items-center gap-3 font-medium cursor-pointer bg-transparent border-none p-0 ${
                  activeTab === id ? "text-pink-600" : "text-black"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </nav>
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
            <h2 className="text-2xl font-bold mb-4 text-black">Messages</h2>
            <p className="text-gray-600">No messages available.</p>
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black">Favorites</h2>
            <p className="text-gray-600">No favorites added yet.</p>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black">
              Notifications
            </h2>
            <UserNotifications />
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black">Activity</h2>
            <p className="text-gray-600">No activity data available.</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black">Settings</h2>
            <p className="text-gray-600">Settings page is under development.</p>
          </div>
        )}

        {activeTab === "help" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black">Help</h2>
            <p className="text-gray-600">
              Help content will be available soon.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
