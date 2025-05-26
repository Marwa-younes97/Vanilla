import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(''); // تحديد الفئة الحالية
  const navigate = useNavigate();

  useEffect(() => {
    // تحميل المنتجات
    const loadProducts = async () => {
      try {
        const response = await fetch('../../data/products_data.json');
        const data = await response.json();
        setRelatedProducts(data);
        if (data.length > 0) {
          // تعيين الفئة الحالية استنادًا إلى المنتج الأول أو الفئة التي تريدها
          setCurrentCategory(data[0].category); // هنا حددت أول منتج كمرجع
        }
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  // تصفية المنتجات حسب الفئة الحالية وعرض أول 4 منتجات فقط
  const filteredProducts = relatedProducts
    .filter(product => product.category === currentCategory)
    .slice(0, 4);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  return (
    <div className="cart-container pt-32
     py-8 px-4 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-pink-600 text-center mb-8">Your Cart</h2>
      
      {cart.length === 0 ? (
        <p className="text-center text-xl text-gray-500">Your cart is empty!</p>
      ) : (
        <div>
          {cart.map((product) => (
            <div key={product._id} className="cart-item bg-white p-4 mb-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-item-image w-24 h-24 object-cover rounded-lg"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">${product.price}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                      className="bg-gray-200 p-2 rounded-full text-gray-600 hover:bg-gray-300 transition-all"
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-2 text-lg">{product.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                      className="bg-gray-200 p-2 rounded-full text-gray-600 hover:bg-gray-300 transition-all"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-red-500 hover:text-red-700 transition-all"
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
                ${cart.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)}
              </p>
            </div>
            <div className="pt-4 flex justify-end ">
            <button
              onClick={clearCart}
              className="w-60 bg-pink-700 font-bold
               btn-card text-white py-2 rounded-lg hover:bg-pink-700 transition-all"
            >
              Clear Cart
            </button>
            </div>

          </div>
        </div>
      )}

      {/* Related Products */}
      {filteredProducts.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="product-card bg-white shadow-md rounded-xl p-4  transition duration-300 transform hover:-translate-y-2 hover:shadow-[0_4px_20px_rgba(255,0,179,0.5)] cursor-pointer"
                onClick={() => navigate(`/product/${relatedProduct._id}`)}
              >
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h4 className="text-lg font-semibold mb-2">{relatedProduct.name}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  {relatedProduct.description.length > 100
                    ? relatedProduct.description.substring(0, 100) + "..."
                    : relatedProduct.description}
                </p>
                <p className="text-lg text-pink-700 mb-3">${relatedProduct.price}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigating when clicking the button
                    alert("Added to cart!");
                  }}
                  className="btn-card hover:bg-pink-700 text-white py-2 px-6 rounded-xl transition"
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

