// components/admin/Toast.jsx
import React from "react";

const Toast = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs w-full">
        <div className="border-4 border-green-600 bg-white text-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-black">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
