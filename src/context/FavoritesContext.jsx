// FavoritesContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// إنشاء Context جديد للمفضلات
const FavoritesContext = createContext();

// مزود FavoritesContext
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await axios.get(
          "https://bakeryproject-1onw.onrender.com/api/favorites/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavorites(response.data.data);
      } catch (err) {
        setError("Failed to load favorites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const addFavorite = async (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You need to be logged in to favorite products.");
      return;
    }

    try {
      await axios.post(
        "https://bakeryproject-1onw.onrender.com/api/favorites/add",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFavorites((prevFavorites) => [...prevFavorites, { _id: productId }]);
    } catch (err) {
      alert("Error adding to favorites.");
    }
  };

  const removeFavorite = async (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You need to be logged in to remove products from favorites.");
      return;
    }

    try {
      await axios.post(
        "https://bakeryproject-1onw.onrender.com/api/favorites/remove",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFavorites((prevFavorites) =>
        prevFavorites.filter((product) => product._id !== productId)
      );
    } catch (err) {
      alert("Error removing from favorites.");
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, error, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook لاستخدام context بسهولة
export const useFavorites = () => useContext(FavoritesContext);
