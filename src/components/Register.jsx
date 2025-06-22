// import React, { useState } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const Register = ({ onClose, onLoginClick, setIsLoggedIn }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (!name || !email || !password || !confirmPassword) {
//       setError("All fields are required");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         "https://bakeryproject-1onw.onrender.com/api/auth/register",
//         { name, email, password }
//       );

//       if (response.data.token) {
//         localStorage.setItem("authToken", response.data.token);
//         jwtDecode(response.data.token);
//         setIsLoggedIn(true);
//         onClose();
//         window.location.href = "/";
//       } else {
//         setError(response.data.message || "Registration failed.");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "An error occurred. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
//       <div className="bg-white rounded-xl shadow-lg max-w-lg w-full h-auto flex flex-col relative overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
//         <div className="w-full p-8 relative bg-white bg-opacity-90 rounded-lg">
//           <button
//             onClick={onClose}
//             className="absolute top-2 right-2 text-gray-700 text-2xl font-bold hover:text-gray-900"
//           >
//             &times;
//           </button>

//           <h2 className="text-4xl font-semibold text-center mb-6 text-pink-700">
//             Create Account
//           </h2>

//           {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//           <form onSubmit={handleRegister}>
//             <div className="mb-6">
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Name*
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
//               />
//             </div>

//             <div className="mb-6">
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email*
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
//               />
//             </div>

//             <div className="mb-6">
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password*
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
//               />
//             </div>

//             <div className="mb-6">
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                 Confirm Password*
//               </label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full ${
//                 loading ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600"
//               } text-white p-4 rounded-md hover:bg-pink-700 transition-colors duration-300`}
//             >
//               {loading ? "Creating account..." : "Create Account"}
//             </button>
//           </form>

//           <div className="text-center mt-6">
//             <p className="text-lg text-gray-700">
//               Already have an account?
//               <button
//                 onClick={onLoginClick}
//                 className="ml-2 text-pink-600 hover:underline font-bold"
//               >
//                 Login
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ onClose, onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleRegister = async (e) => {
  e.preventDefault();

  // ✅ فلديشن الإيميل بصيغة صحيحة
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  // ✅ فلديشن الباسورد: 8 حروف على الأقل، ويحتوي على حرف ورقم
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    setError("Password must be at least 8 characters and include both letters and numbers.");
    return;
  }

  // ✅ فلديشن تأكيد الباسورد
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  // ✅ لو كل حاجة تمام نكمل التسجيل
  setError("");
  setLoading(true);

  try {
    const response = await fetch("https://bakeryproject-1onw.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("authToken", data.token);
      setIsLoggedIn(true);
      setError("");
      setLoading(false);

      setTimeout(() => {
        onClose();
        navigate("/");
      }, 1000);
    } else {
      setError(data.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  } catch (err) {
    console.error("Registration error:", err);
    setError("An error occurred. Please try again later.");
    setLoading(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden flex flex-col relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="w-full p-8 relative bg-white bg-opacity-90 rounded-lg">
          <div className="absolute top-2 right-2">
            <button onClick={onClose} className="text-gray-700 text-2xl font-bold hover:text-gray-900">
              &times;
            </button>
          </div>

          {!isLoggedIn ? (
            <>
              <h2 className="text-4xl font-semibold text-center mb-6 text-pink-700">Create an Account</h2>

              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              <form onSubmit={handleRegister}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="text-black w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="text-black w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password*
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="text-black w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password*
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm Password"
                    className="text-black w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full ${loading ? 'bg-gray-400' : 'bg-pink-600'} text-white p-4 rounded-md hover:bg-pink-700 transition-colors duration-300`}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-lg text-gray-700">
                  Already have an account?
                  <button onClick={onLoginClick} className="ml-2 text-pink-600 hover:underline font-bold">
                    Login
                  </button>
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-10">
              <img
                src="/user-avatar.png"
                alt="User"
                className="w-20 h-20 rounded-full border-2 border-pink-600"
              />
              <button
                onClick={handleLogout}
                className="bg-pink-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-pink-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;

