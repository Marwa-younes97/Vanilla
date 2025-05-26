import React, { useState } from 'react';
import HeroSection from "../components/HeroSection";
import ProductCategories from "../components/ProductCategories";
import AboutPreview from "../components/AboutPreview";
import Login from "../components/Login";  // استيراد مكون Login
import SignUp from "../components/Register";  // استيراد مكون SignUp
import ForgotPassword from "../components/ForgotPassword"; // استيراد مكون ForgotPassword

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // إضافة الحالة الخاصة بـ ForgotPassword

  // فتح مكون Login وإغلاق باقي النوافذ
  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
    setShowForgotPassword(false);
  };

  // فتح مكون SignUp وإغلاق باقي النوافذ
  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false);
    setShowForgotPassword(false);
  };

  // فتح مكون ForgotPassword وإغلاق باقي النوافذ
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowLogin(false);
    setShowSignUp(false);
  };

  // إغلاق جميع النوافذ المنبثقة
  const closeModal = () => {
    setShowLogin(false);
    setShowSignUp(false);
    setShowForgotPassword(false);
  };

  return (
    <div>
      <HeroSection />
      <ProductCategories />
      <AboutPreview />

      {/* عرض Login أو SignUp أو ForgotPassword بناءً على الحالة */}
      {showLogin && (
        <Login 
          onClose={closeModal} 
          onRegisterClick={handleSignUpClick} 
          onForgotPasswordClick={handleForgotPasswordClick} 
        />
      )}
      {showSignUp && <SignUp onClose={closeModal} />}
      {showForgotPassword && (
        <ForgotPassword 
          onClose={closeModal} 
          onLoginClick={handleLoginClick} 
        />
      )}
    </div>
  );
};

export default Home;
