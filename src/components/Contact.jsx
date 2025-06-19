import React, { useState } from "react";
import { Phone, Mail } from "lucide-react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Contact Form",
    message: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        "https://bakeryproject-1onw.onrender.com/api/contact",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setSuccessMsg("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "Contact Form",
          message: "",
        });
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-28 py-16 bg-gradient-to-br from-pink-50 via-white to-pink-50">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-12 text-left font-medium tracking-wide">
        Home / <span className="text-pink-700 font-semibold">Contact</span>
      </div>

      {/* Contact Info */}
      <div className="max-w-4xl mx-auto mb-14 bg-white shadow-xl rounded-2xl p-10 border border-pink-200 space-y-14">
        {/* Call Us */}
        <div>
          <div className="flex items-center gap-5 mb-6">
            <div className="bg-pink-600 rounded-full p-4 shadow-lg">
              <Phone className="text-white w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-pink-700 tracking-wide">
              Call To Us
            </h3>
          </div>
          <p className="text-pink-400 text-base mb-3">
            We are available , 7 days a week.
          </p>
          <p className="text-pink-800 font-semibold text-lg tracking-wide">
            Phone: +88061112222
          </p>
        </div>

        <hr className="border-pink-200" />

        {/* Write To Us */}
        <div>
          <div className="flex items-center gap-5 mb-6">
            <div className="bg-pink-600 rounded-full p-4 shadow-lg">
              <Mail className="text-white w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-pink-700 tracking-wide">
              Write To Us
            </h3>
          </div>
          <p className="text-pink-500 text-base mb-3">
            Fill out our form and we will contact you within 24 hours.
          </p>
          <p className="text-pink-800 font-semibold text-lg tracking-wide">
            customer@exclusive.com
          </p>
          <p className="text-pink-800 font-semibold text-lg tracking-wide">
            support@exclusive.com
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 border border-pink-200">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {successMsg && (
            <p className="text-green-600 text-center text-sm font-semibold">
              {successMsg}
            </p>
          )}
          {errorMsg && (
            <p className="text-red-600 text-center text-sm font-semibold">
              {errorMsg}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              className="border border-pink-300 bg-pink-50 text-pink-900 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-pink-400 transition"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email *"
              className="border border-pink-300 bg-pink-50 text-pink-900 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-pink-400 transition"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Your Phone *"
              className="border border-pink-300 bg-pink-50 text-pink-900 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-pink-400 transition"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <textarea
            name="message"
            rows="6"
            placeholder="Your Message"
            className="border border-pink-300 bg-pink-50 text-pink-900 rounded-lg p-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-pink-400 transition"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 active:bg-pink-800 transition text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-lg"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
