import React, { useState, useEffect } from "react";
import Login from "../components/Login";
import SignUp from "../components/Register";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaHeart } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";  // تصحيح الاستيراد من jwt-decode
import axios from "axios";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { getCartCount } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userImage, setUserImage] = useState("/user_img.jpg"); // صورة افتراضية

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        // يمكن استخدام decoded إذا أردت بيانات إضافية مثل userId أو role
      } catch (error) {
        console.error("فشل في تحليل التوكن:", error);
      }

      axios
        .get("https://bakeryproject-1onw.onrender.com/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const user = response.data.user;
          if (user && user.image) {
            setUserImage(`${user.image}`);
          } else {
            setUserImage("/user_img.jpg");
          }
        })
        .catch((error) => {
          console.error("فشل في تحميل بيانات المستخدم:", error);
        });
    }
  }, []);
// console.log(userImage)
  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
    setMenuOpen(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    window.location.reload();
    setMenuOpen(false);
  };

  const closeModal = () => {
    setShowLogin(false);
    setShowSignUp(false);
  };
const location = useLocation();
const hideNavbar = location.pathname === "/user" || location.pathname === "/favorites";

if (hideNavbar) {
  return null; // لا تعرض الـ Navbar
}

  return (
    <nav className="Nav-height fixed top-0 left-0 w-full z-50 bg-black bg-opacity-90 text-white px-6 py-4 flex items-center justify-between">
      {/* الشعار */}
      <div className="flex items-center space-x-4">
        <h3 className="text-lg font-semibold">
          <Link to="/">
            <img
              src="Dark_Green_Cute_and_Playful_Kitchen_Restaurant_Logo-removebg-preview.png"
              alt="SweetBite Logo"
              className="w-32 h-auto"
            />
          </Link>
        </h3>
      </div>

      {/* زر الموبايل */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* القائمة العلوية */}
      <ul className="hidden md:flex space-x-8 font-medium text-lg">
        <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
        <li><Link to="/blog" className="hover:text-yellow-400">Blog</Link></li>
        <li><Link to="/contact" className="hover:text-yellow-400">Contact Us</Link></li>
        <li><Link to="/about" className="hover:text-yellow-400">About Us</Link></li>
        <li>
          <Link to="/cart" className="hover:text-yellow-400 flex items-center">
            <i className="bi bi-cart-fill mr-1" style={{ fontSize: "19px" }}></i>
            <span className="text-lg text-pink-600">{getCartCount() > 0 ? getCartCount() : ""}</span>
          </Link>
        </li>
        {/* <li>
          <Link to="/favorites" className="flex items-center gap-2 hover:text-yellow-400 relative">
            <FaHeart />
          </Link>
        </li> */}
      </ul>

      {/* أزرار الحساب */}
      <div className="hidden md:flex items-center space-x-4">
        {!isLoggedIn ? (
          <>
            <button onClick={handleLoginClick} className="bg-pink-700 text-white px-6 py-3 rounded-md hover:bg-white hover:text-pink-700">Login</button>
            <button onClick={handleSignUpClick} className="bg-pink-700 text-white px-6 py-3 rounded-md hover:bg-white hover:text-pink-700">Sign up</button>
          </>
        ) : (
          <>
            <Link to="/user">
              <img
                src={userImage}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            </Link>
            <button onClick={handleLogout} className="bg-pink-700 text-white px-5 py-2 rounded-md hover:bg-white hover:text-pink-700">Logout</button>
          </>
        )}
      </div>

      {/* قائمة الجوال الجانبية */}
      {menuOpen && (
        <div className="fixed top-[64px] left-0 w-full bg-black bg-opacity-95 text-white flex flex-col space-y-4 py-6 px-6 md:hidden z-40">
          <ul className="flex flex-col space-y-4 font-medium text-lg">
            <li><Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">Home</Link></li>
            <li><Link to="/blog" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">Blog</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">Contact Us</Link></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">About Us</Link></li>
            <li>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 flex items-center">
                <i className="bi bi-cart-fill mr-1" style={{ fontSize: "19px" }}></i>
                <span className="text-lg text-pink-600">{getCartCount() > 0 ? getCartCount() : ""}</span>
              </Link>
            </li>
          </ul>

          <div className="mt-6 flex flex-col space-y-4">
            {!isLoggedIn ? (
              <>
                <button onClick={handleLoginClick} className="bg-pink-700 text-white px-6 py-3 rounded-md hover:bg-white hover:text-pink-700">Login</button>
                <button onClick={handleSignUpClick} className="bg-pink-700 text-white px-6 py-3 rounded-md hover:bg-white hover:text-pink-700">Sign up</button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/user">
                  <img
                    src={userImage}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                </Link>
                <button onClick={handleLogout} className="bg-pink-700 text-white px-5 py-2 rounded-md hover:bg-white hover:text-pink-700 flex-1">Logout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* مودال تسجيل الدخول والتسجيل */}
      {showLogin && (
        <Login onClose={closeModal} onSignUpClick={handleSignUpClick} setIsLoggedIn={setIsLoggedIn} />
      )}
      {showSignUp && (
        <SignUp onClose={closeModal} onLoginClick={handleLoginClick} setIsLoggedIn={setIsLoggedIn} />
      )}
    </nav>
  );
};

export default Navbar;


