import React from "react";
import { useNavigate } from "react-router-dom";

const OrderCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-32 px-6 py-16 bg-pink-50">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border-l-4 border-r-4 border-pink-700 flex flex-col md:flex-row items-center transform hover:scale-[1.01] transition duration-300">
        
        <div className="md:w-1/2 w-full h-64 md:h-[500px] relative overflow-hidden">
          <img
            src="https://img.freepik.com/free-photo/disappointed-woman-holding-empty-wallet-pink-background_23-2148092512.jpg"
            alt="Payment Cancelled"
            className="w-full h-full object-cover hover:scale-105 transition duration-700"
          />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-pink-700 to-pink-700"></div>
        </div>

        <div className="md:w-1/2 w-full p-8 md:p-12 text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 relative inline-block">
            <span className="relative z-10">Payment Cancelled</span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-pink-200 z-0 opacity-70"></span>
          </h2>

          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            You cancelled the payment process. No worries — your cart is still waiting!
          </p>

          <div className="flex justify-center md:justify-start">
            <button
              onClick={() => navigate("/cart")}
              className="bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-700 border-2 border-pink-700 transition duration-300 shadow-lg hover:shadow-pink-200"
            >
              Back to Cart
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center">
              <span className="text-pink-700 mr-2">✓</span>
              <span className="text-gray-600">Cart Saved</span>
            </div>
            <div className="flex items-center">
              <span className="text-pink-700 mr-2">✓</span>
              <span className="text-gray-600">No Charges Made</span>
            </div>
            <div className="flex items-center">
              <span className="text-pink-700 mr-2">✓</span>
              <span className="text-gray-600">Safe Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCancel;
