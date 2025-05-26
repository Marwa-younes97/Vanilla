import React from "react";

const Footer = () => {
  return (
    <footer
      className="text-white py-16 px-6 bg-cover bg-center"
      style={{
        backgroundImage: `url('9a402892-7ba7-4d33-8dcd-f62eabdf6641.jpeg')`,
      }}
    >
      <div className="bg-black bg-opacity-60 rounded-2xl p-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo & Description */}
          <div className="md:w-1/3">
          <img src="Dark_Green_Cute_and_Playful_Kitchen_Restaurant_Logo-removebg-preview.png" alt="SweetBite Logo" className="w-32 h-auto" />
          <p className="text-gray-200">
              Your daily dose of delightful treats — baked with love and served with joy.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:w-1/3">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-200">
              <li><a href="#" className="hover:text-yellow-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">About Us</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="md:w-1/3">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="hover:text-yellow-400 transition"><i className="bi bi-facebook"></i></a>
              <a href="#" className="hover:text-yellow-400 transition"><i className="bi bi-instagram"></i></a>
              <a href="#" className="hover:text-yellow-400 transition"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="hover:text-yellow-400 transition"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-500 mt-10 pt-6 text-center text-gray-300 text-sm">
          © 2025 SweetBite. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
