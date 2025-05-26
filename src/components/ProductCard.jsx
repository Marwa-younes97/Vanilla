import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, favorites } = useFavorites();

  // ✅ تأكد إذا كان المنتج ضمن المفضلة
  useEffect(() => {
    const isFav = favorites.some((fav) => fav._id === product._id);
    setIsFavorited(isFav);
  }, [favorites, product._id]);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  // ✅ منطق الإضافة والحذف من المفضلة
  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorited) {
      removeFavorite(product._id);
    } else {
      addFavorite(product._id);
    }
    // لا حاجة لتحديث الحالة يدويًا لأن useEffect سيقوم بذلك
  };

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      className="bg-white border rounded-2xl shadow-sm p-4 w-[300px] h-[400px] max-w-xs overflow-hidden 
                 transition duration-300 transform hover:-translate-y-1 hover:shadow-[0px 4px 10px rgba(236, 72, 153, 0.6)] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[200px] object-cover rounded-2xl mb-3"
        />
        <button
          onClick={toggleFavorite}
          className={`absolute top-2 right-2 text-xl p-1 rounded-full 
            ${isFavorited ? "border-2 border-pink-500" : "border-2 border-gray-300"}`}
          style={{
            width: "40px",
            height: "40px",
            clipPath: "polygon(50% 0%, 0% 35%, 25% 100%, 50% 80%, 75% 100%, 100% 35%)",
            backgroundColor: isFavorited ? "rgba(255, 192, 203, 0.2)" : "rgba(211, 211, 211, 0.2)",
          }}
        >
          <FaHeart className={`${isFavorited ? "text-pink-500" : "text-gray-300"}`} />
        </button>
      </div>

      <div className="text-left">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, index) =>
            index < Math.round(averageRating) ? (
              <FaStar key={index} className="text-yellow-400 text-sm" />
            ) : (
              <FaRegStar key={index} className="text-gray-300 text-sm" />
            )
          )}
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviews?.length || 0})
          </span>
        </div>

        <div className="flex justify-between items-center mt-3">
          {product.availability ? (
            <button
              onClick={handleAddToCart}
              className="text-white py-2 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 transition"
            >
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-white py-2 px-4 rounded-xl cursor-not-allowed"
              title="Product not available"
            >
              Unavailable
            </button>
          )}
          <p className="text-base font-bold text-pink-600">{product.price} EGP</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

