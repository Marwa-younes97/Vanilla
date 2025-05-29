import React, { useState, useEffect } from "react";
import Login from "../components/Login";
import SignUp from "../components/Register";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";


const Navbar = () => {
  const { getCartCount } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const closeModal = () => {
    setShowLogin(false);
    setShowSignUp(false);
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  };

  return (
    <nav className="Nav-height absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 bg-opacity-80 bg-black text-white">
      <h3 className="text-lg font-semibold">
        <img
          src="Dark_Green_Cute_and_Playful_Kitchen_Restaurant_Logo-removebg-preview.png"
          alt="SweetBite Logo"
          className="w-32 h-auto"
        />
      </h3>

      <div className="flex flex-1 justify-center space-x-8">
        <ul className="flex space-x-8 font-medium text-lg">
          <li>
            <Link to="/" className="hover:text-yellow-400 transition duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:text-yellow-400 transition duration-300">
              Blog
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-yellow-400 transition duration-300">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-yellow-400 transition duration-300">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/cart" className="hover:text-yellow-400 transition duration-300 flex items-center">
              <i className="bi bi-cart-fill mr-1" style={{ fontSize: "19px" }}></i>
              <span className="text-lg text-pink-600">{getCartCount() > 0 ? getCartCount() : ""}</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center space-x-4">
        {!isLoggedIn ? (
          <>
            <button
              onClick={handleLoginClick}
              className="bg-pink-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-pink-700 transition"
            >
              Login
            </button>
            <button
              onClick={handleSignUpClick}
              className="bg-pink-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-pink-700 transition"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            <img
              src="/user-avatar.png"
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <button
              onClick={handleLogout}
              className="bg-pink-700 text-white px-5 py-2 rounded-md font-semibold hover:bg-white hover:text-pink-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {showLogin && <Login onClose={closeModal} onSignUpClick={handleSignUpClick} />}
      {showSignUp && <SignUp onClose={closeModal} onLoginClick={handleLoginClick} />}
    </nav>
  );
};

export default Navbar;
