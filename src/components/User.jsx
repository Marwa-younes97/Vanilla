import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserNotifications from "./UserNotifications";
import Favorites from "./Favorites";
import { Pencil, Bell, User, MessageCircle, Star, Menu } from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", image: "", _id: "", favorites: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [messages, setMessages] = useState([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [sidebarImage, setSidebarImage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }
    fetch("https://bakeryproject-1onw.onrender.com/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch user profile"))
      .then((data) => {
        const user = data.user;
        if (user) {
          setUserData({
            name: user.name,
            email: user.email,
            image: user.image ? `${user.image}` : "/admin_image.jpg",
            _id: user._id,
            favorites: user.favorites || [],
          });
        } else {
          setError("User not found");
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (userData.image) {
      const imagePath = userData.image.startsWith("blob:") ? userData.image :
        userData.image.startsWith("http") ? userData.image : `https://bakeryproject-1onw.onrender.com/${userData.image}`;
      setSidebarImage(imagePath);
    }
  }, [userData.image]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    fetch("https://bakeryproject-1onw.onrender.com/api/contact/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch user messages"))
      .then((data) => {
        const repliedMessages = data.data.filter((msg) => msg.reply);
        setMessages(repliedMessages);
        const newMsgs = repliedMessages.filter((msg) => {
          const latestTime = new Date(msg.repliedAt);
          const threshold = new Date(Date.now() - 60 * 60 * 1000);
          return latestTime > threshold;
        });
        setNewMessageCount(newMsgs.length);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    fetch("https://bakeryproject-1onw.onrender.com/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch notifications"))
      .then((data) => {
        setNotifications(data);
        const newNotifs = data.filter((notif) => {
          const latestTime = new Date(notif.createdAt);
          const threshold = new Date(Date.now() - 60 * 60 * 1000);
          return latestTime > threshold;
        });
        setNewNotificationCount(newNotifs.length);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (activeTab === "notifications") setNewNotificationCount(0);
    if (activeTab === "messages") setNewMessageCount(0);
  }, [activeTab]);

  const handleChange = (e) => setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) return setError("Invalid file type");
      setImageFile(file);
      setUserData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) return setError("Not logged in");
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    if (imageFile) formData.append("image", imageFile);
    fetch("https://bakeryproject-1onw.onrender.com/api/auth/profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to update profile"))
      .then((data) => {
        setSuccessMsg("Profile updated successfully");
        if (data.user?.image) {
          setUserData((prev) => ({
            ...prev,
            image: `https://bakeryproject-1onw.onrender.com/${data.user.image}`,
          }));
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  const navItems = [
    { label: "Profile", icon: <User className="w-5 h-5" />, id: "profile" },
    {
      label: "Messages",
      icon: (
        <div className="relative">
          <MessageCircle className="w-5 h-5" />
          {newMessageCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-700 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{newMessageCount}</span>}
        </div>
      ),
      id: "messages",
    },
    { label: "Favorites", icon: <Star className="w-5 h-5" />, id: "favorites" },
    {
      label: "Notifications",
      icon: (
        <div className="relative">
          <Bell className="w-5 h-5" />
          {newNotificationCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-700 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{newNotificationCount}</span>}
        </div>
      ),
      id: "notifications",
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      <div className="lg:hidden flex justify-between items-center p-4 border-b">
        <h1 className="text-lg font-bold text-gray-800">User Profile</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      <aside className={`w-full lg:w-64 bg-pink-50 p-6 flex-col justify-between overflow-auto transition-transform duration-300 ${sidebarOpen ? "flex" : "hidden"} lg:flex`}>
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img src={sidebarImage} onError={(e) => (e.target.src = "/user_img.jpg")} alt="User" className="w-10 h-10 rounded-full object-cover border" />
            <h1 className="text-gray-800 font-bold text-base">{userData.name?.split(" ")[0] || "User"}</h1>
          </div>
          <nav className="space-y-6">
            {navItems.map(({ label, icon, id }) => (
              <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false); }} className={`flex items-center gap-3 font-medium p-2 rounded ${activeTab === id ? "text-pink-700 bg-white" : "text-gray-800 hover:text-pink-600"}`}>{icon} {label}</button>
            ))}
          </nav>
        </div>
        <div className="mt-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-pink-700 font-medium hover:text-pink-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Edit Profile</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <img src={sidebarImage} onError={(e) => (e.target.src = "/user_img.jpg")} alt="User" className="w-24 h-24 rounded-full object-cover border" />
              <div className="flex gap-2 mt-2">
                <button type="button" className="bg-pink-700 text-white px-4 py-2 rounded text-sm" onClick={handleUploadClick}>Upload New Photo</button>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "email"].map((field) => (
                <div key={field} className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3">
                  <input type={field === "email" ? "email" : "text"} name={field} value={userData[field]} onChange={handleChange} className="bg-transparent text-sm text-gray-800 w-full outline-none" placeholder={field === "name" ? "Full Name" : "Email Address"} required />
                  <div className="ml-2 p-2 bg-pink-700 rounded-full border border-gray-300"><Pencil className="w-4 h-4 text-white" /></div>
                </div>
              ))}
              <div className="flex justify-center">
                <button type="submit" disabled={loading} className="w-64 bg-pink-700 text-white text-sm font-semibold py-3 rounded-xl mt-2 transition">Update Profile</button>
              </div>
            </form>
            {successMsg && !error && <p className="mt-4 text-green-600">{successMsg}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
          </div>
        )}
        {activeTab === "messages" && (
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-6 text-pink-700">Inbox</h2>
            {messages.length === 0 ? <p className="text-gray-500 text-center mt-10">You have no messages with replies yet.</p> : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg._id} className="flex items-start gap-4 bg-white shadow-sm border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex-shrink-0 bg-pink-100 text-pink-700 rounded-full w-10 h-10 flex items-center justify-center"><MessageCircle className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-gray-800">{msg.subject}</h3>
                        {msg.repliedAt && <span className="text-xs text-gray-400">{new Date(msg.repliedAt).toLocaleString()}</span>}
                      </div>
                      <p className="text-sm text-gray-600">{msg.reply}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "favorites" && <div className="mt-4"><Favorites /></div>}
        {activeTab === "notifications" && <div className="mt-4"><UserNotifications notifications={notifications} /></div>}
      </main>
    </div>
  );
}
