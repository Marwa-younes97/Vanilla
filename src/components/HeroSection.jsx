import React from "react";
import Navbar from "./Navbar";


const HeroSection = () => {
  return (
    <div
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504400739660-22ebeb14f00a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        height: "100vh",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 flex flex-col md:flex-row items-center justify-between">
        {/* الكلام والزرار */}
        <div className=" mt-24
        md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Sweet Treats,
            <br /> Freshly baked delights and cakes that brighten your day
          </h1>
          <div className="space-x-4 mt-6">
            
            <button className="bg-pink-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-pink-700 transition">
              Shop Now
            </button>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
