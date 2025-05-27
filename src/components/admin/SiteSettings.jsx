import React, { useState, useEffect } from "react";
import Toast from "./Toast";

const SiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState({
    siteName: "",
    logo: "",
    address: "",
    description: "",
    email: "",
    phoneNumber: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // الدالة العامة للحصول على التوكن من localStorage
  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = getToken();
        const response = await fetch("https://bakeryproject-1onw.onrender.com/api/settings/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.success && result.data) {
          setSiteSettings(result.data);
          setLogoPreview(result.data.logo);
        } else {
          showToast("Failed to load settings", "error");
        }
      } catch (error) {
        showToast("Error loading settings", "error");
        console.error(error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSiteSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSiteSettings((prevSettings) => ({
        ...prevSettings,
        logo: file,
      }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      const formData = new FormData();

      for (const key in siteSettings) {
        formData.append(key, siteSettings[key]);
      }

      const response = await fetch("https://bakeryproject-1onw.onrender.com/api/settings/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast(result.message || "Settings updated successfully");
      } else {
        showToast(result.message || "Failed to update settings", "error");
      }
    } catch (error) {
      showToast("Error saving settings", "error");
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      <h2 className="text-3xl font-bold mb-6 text-pink-700">Site Settings</h2>

      <form onSubmit={handleSave}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Site Name</label>
          <input
            type="text"
            name="siteName"
            value={siteSettings.siteName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
          {logoPreview && (
            <img src={logoPreview} alt="Logo Preview" className="mt-2 h-20" />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={siteSettings.address}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Site Description</label>
          <textarea
            name="description"
            value={siteSettings.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={siteSettings.email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={siteSettings.phoneNumber}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;


