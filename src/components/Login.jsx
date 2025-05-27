import React, { useState } from 'react';
import axios from 'axios';
import ForgotPassword from './ForgotPassword';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setError('Both fields are required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://bakeryproject-1onw.onrender.com/api/auth/login', {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.token) {
        console.log("Token stored:", response.data.token);
        localStorage.setItem('authToken', response.data.token);

        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowLogin(false);
  };

  const closeLoginModal = () => {
    setShowLogin(false);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setShowLogin(true);
  };

  return (
    <div className="relative">
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full h-auto flex flex-col relative overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <div className="w-full p-8 relative bg-white bg-opacity-90 rounded-lg">
              <div className="absolute top-2 right-2">
                <button onClick={closeLoginModal} className="text-gray-700 text-2xl font-bold hover:text-gray-900">&times;</button>
              </div>

              <h2 className="text-4xl font-semibold text-center mb-6 text-pink-700">Login</h2>

              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              <form onSubmit={handleLogin}>
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password*</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="text-black  w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="mb-6 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className="text-sm text-pink-600 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${loading ? 'bg-gray-400' : 'bg-pink-600'} text-white p-4 rounded-md hover:bg-pink-700 transition-colors duration-300`}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-lg text-gray-700">
                  Don't have an account? 
                  <a href="/register" className="ml-2 text-pink-600 hover:underline font-bold">
                    Create an account
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForgotPassword && (
        <ForgotPassword onClose={closeForgotPasswordModal} />
      )}
    </div>
  );
};

export default Login;
