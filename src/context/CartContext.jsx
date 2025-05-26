// src/context/CartContext.js

import React, { createContext, useState, useContext } from "react";

// إنشاء Context جديد
export const CartContext = createContext();

// تعريف الـ Provider الذي سيحافظ على حالة السلة ويوفرها لجميع المكونات
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // إضافة منتج إلى السلة
  const addToCart = (product) => {
    const productExists = cart.find((item) => item._id === product._id);

    if (productExists) {
      // إذا كان المنتج موجودًا بالفعل، قم بتحديث الكمية
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // إذا كان المنتج غير موجود، أضفه إلى السلة
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // حذف منتج من السلة
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  // تحديث الكمية لمنتج معين
  const updateQuantity = (productId, quantity) => {
    setCart(
      cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // مسح السلة
  const clearCart = () => {
    setCart([]);
  };

  // حساب عدد العناصر في السلة
  const getCartCount = () => {
    return cart.reduce((total, product) => total + product.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,  // إضافة دالة لحساب عدد المنتجات
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// إنشاء hook لاستخدام الـ CartContext
export const useCart = () => useContext(CartContext);
