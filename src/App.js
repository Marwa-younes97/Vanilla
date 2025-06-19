import React, { Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WeddingPage from "./components/WeddingPage";
import BirthdayPage from "./components/BirthdayPage";
import AdminDashboard from "./components/AdminDashboard";
import Favorites from "./components/Favorites";
import Contact from "./components/Contact";
import User from "./components/User";

import Login from "./components/Login";
import SignUp from "./components/Register";
import OrderSuccess from "./components/OrderSuccess";
import OrderCancel from "./components/OrderCancel";

import "./App.css";

const Home = React.lazy(() => import("./pages/Home"));
const ForgotPassword = React.lazy(() => import("./components/ForgotPassword"));
const Blog = React.lazy(() => import("./components/Blog"));
const RecipeDetails = React.lazy(() => import("./components/RecipeDetails"));
const About = React.lazy(() => import("./components/About"));
const ProductDetails = React.lazy(() => import("./components/ProductDetails"));
const Cart = React.lazy(() => import("./components/Cart"));
const ProductsList = React.lazy(() => import("./components/ProductsList"));

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // States for modals and auth
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const closeModal = () => {
    setShowLogin(false);
    setShowSignUp(false);
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  };

  return (
    <CartProvider>
      <ScrollToTop />
      {!isAdminRoute && !showLogin && !showSignUp && (
  <Navbar
    onLoginClick={handleLoginClick}
    onSignUpClick={handleSignUpClick}
    isLoggedIn={isLoggedIn}
    setIsLoggedIn={setIsLoggedIn}
  />
)}


      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/bread" element={<ProductsList category="Bread" />} />
          <Route path="/tarts" element={<ProductsList category="Tart" />} />
          <Route path="/cakes" element={<ProductsList category="Cakes" />} />
          <Route path="/cookies" element={<ProductsList category="Cookies" />} />
          <Route path="/pastry" element={<ProductsList category="Pastry" />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/birthday" element={<BirthdayPage />} />
          <Route path="/wedding" element={<WeddingPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user" element={<User />} />
          <Route path="/order-success" element={<OrderSuccess />} />
<Route path="/order-cancel" element={<OrderCancel />} />
        </Routes>
      </Suspense>

      {/* Modals for Login and SignUp */}
      {showLogin && (
        <Login onClose={closeModal} onSignUpClick={handleSignUpClick} setIsLoggedIn={setIsLoggedIn} />
      )}
      {showSignUp && (
        <SignUp onClose={closeModal} onLoginClick={handleLoginClick} setIsLoggedIn={setIsLoggedIn} />
      )}

      {!isAdminRoute && <Footer />}
      <ToastContainer />
    </CartProvider>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <AppContent />
      </Router>
    </FavoritesProvider>
  );
}

export default App;
