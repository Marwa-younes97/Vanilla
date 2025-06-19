import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
        const data = await response.json();
        setRelatedProducts(data);
        if (data.length > 0) {
          setCurrentCategory(data[0].category);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = relatedProducts
    .filter((product) => product.category === currentCategory)
    .slice(0, 4);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = async () => {
    const fakeOrderId = "680bed9f9e93813cd0bd6297";
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `https://bakeryproject-1onw.onrender.com/api/payments/create-payment/${fakeOrderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`HTTP Error: ${response.status}`);
        const errorText = await response.text();
        console.error("Response body:", errorText);
        alert("Something went wrong with the payment API.");
        return;
      }
      const data = await response.json();

      if (data?.approvalUrl) {
        window.open(data.approvalUrl, "_blank");
      } else {
        alert("Error getting payment link.");
        console.error("Invalid response:", data);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during the payment process.");
    }
  };

  return (
    <div className="cart-container pt-32 py-8 px-4 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-pink-600 text-center mb-8">
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-center text-xl text-gray-500">Your cart is empty!</p>
      ) : (
        <div>
          {cart.map((product) => (
            <div
              key={product._id}
              className="cart-item bg-white p-4 mb-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">${product.price}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(product._id, product.quantity - 1)
                      }
                      className="bg-gray-200 p-2 rounded-full text-gray-600 hover:bg-gray-300"
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-2 text-lg">{product.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(product._id, product.quantity + 1)
                      }
                      className="bg-gray-200 p-2 rounded-full text-gray-600 hover:bg-gray-300"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary bg-white p-4 rounded-lg shadow-md mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Total</h3>
              <p className="text-2xl text-pink-600 font-bold">
                $
                {cart
                  .reduce(
                    (total, product) =>
                      total + product.price * product.quantity,
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
              <button
                onClick={clearCart}
                className="w-full sm:w-60 bg-gray-300 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-400"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="w-full sm:w-60 bg-pink-600 text-white font-bold py-2 rounded-lg hover:bg-pink-700"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="product-card bg-white shadow-md rounded-xl p-4 transition duration-300 transform hover:-translate-y-2 hover:shadow-[0_4px_20px_rgba(255,0,179,0.5)] cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  {product.description.length > 100
                    ? product.description.substring(0, 100) + "..."
                    : product.description}
                </p>
                <p className="text-lg text-pink-700 mb-3">${product.price}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Added to cart!");
                  }}
                  className="hover:bg-pink-700 text-white py-2 px-6 rounded-xl transition bg-pink-600"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
