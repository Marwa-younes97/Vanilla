import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-lg text-gray-700 mb-4">You cancelled the payment process ❌</p>
        <button
          onClick={() => navigate('/cart')}
          className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
};

export default OrderCancel;
