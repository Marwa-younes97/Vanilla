import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WeddingPage from "./components/WeddingPage";
import BirthdayPage from "./components/BirthdayPage";
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import Favorites from './components/Favorites';
import { FavoritesProvider } from './context/FavoritesContext';

// Lazy-loaded components
const Home = React.lazy(() => import("./pages/Home"));
const Register = React.lazy(() => import("./components/Register"));
const Login = React.lazy(() => import("./components/Login"));
const ForgotPassword = React.lazy(() => import("./components/ForgotPassword"));
const Blog = React.lazy(() => import("./components/Blog"));
const RecipeDetails = React.lazy(() => import("./components/RecipeDetails"));
const About = React.lazy(() => import("./components/About"));
const ProductDetails = React.lazy(() => import("./components/ProductDetails"));
const Cart = React.lazy(() => import('./components/Cart'));
const ProductsList = React.lazy(() => import("./components/ProductsList"));

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <CartProvider>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<Register />} />
          <Route path="/Login" element={<Login />} />
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
        </Routes>
      </Suspense>
      {!isAdminRoute && <Footer />}
    </CartProvider>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </FavoritesProvider>
  );
}

export default App;

