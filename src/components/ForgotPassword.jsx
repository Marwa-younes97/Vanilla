import React, { useState } from 'react';

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [error, setError] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      setError('Email addresses do not match');
    } else {
      setError('');
      console.log('Reset link sent to:', email);
      onClose();  // إغلاق النافذة المنبثقة بعد الإرسال
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full h-auto flex flex-col relative overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="w-full p-8 relative bg-white bg-opacity-90 rounded-lg">
          {/* زر إغلاق النافذة المنبثقة */}
          <div className="absolute top-2 right-2">
            <button onClick={onClose} className="text-gray-700 text-2xl font-bold hover:text-gray-900">&times;</button>
          </div>

          <h2 className="text-4xl font-semibold text-center mb-6 text-pink-700">Forgot Password?</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleReset}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email*</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700">Confirm Email*</label>
              <input
                type="email"
                id="confirmEmail"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
                placeholder="Confirm your email"
                className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white p-4 rounded-md hover:bg-pink-700 transition-colors duration-300"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
