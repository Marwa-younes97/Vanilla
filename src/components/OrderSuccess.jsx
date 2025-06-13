import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // إذا رجع من PayPal بـ orderId أو token
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId') || queryParams.get('token');

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
        <p className="text-lg text-gray-700 mb-2">Your payment was successful ✅</p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-4">Order ID: {orderId}</p>
        )}
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
