"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create a new context
const CartContext = createContext();

// Hook to use the cart context in other components
export const useCart = () => useContext(CartContext);

// Provide the cart context to your app
export const CartProvider = ({ children }) => {
  // Lazily load cart from localStorage on the client side
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : {};
    }
    return {}; // Return empty object if running on the server
  });

  // Save to localStorage whenever cart updates
  useEffect(() => {
    if (typeof window !== "undefined" && Object.keys(cart).length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Function to add items to the cart
  const addToCart = (shopId, item) => {
    setCart((prevCart) => {
      const shopCart = prevCart[shopId] || [];
      const existingItemIndex = shopCart.findIndex((i) => i.id === item.id);

      if (existingItemIndex > -1) {
        const updatedShopCart = shopCart.map((existingItem, index) => {
          if (index === existingItemIndex) {
            return { ...existingItem, quantity: existingItem.quantity + 1 };
          }
          return existingItem;
        });

        return { ...prevCart, [shopId]: updatedShopCart };
      } else {
        return {
          ...prevCart,
          [shopId]: [...shopCart, { ...item, quantity: 1 }],
        };
      }
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (shopId, itemId) => {
    setCart((prevCart) => {
      const updatedShopCart = prevCart[shopId]
        .map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity: Math.max(item.quantity - 1, 0) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      const updatedCart = { ...prevCart, [shopId]: updatedShopCart };
      return updatedCart;
    });
  };

  // Function to clear a specific shop's cart
  const clearShopCart = (shopId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[shopId];
      return updatedCart;
    });
  };

  // Function to clear the entire cart
  const clearCart = () => {
    setCart({});
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearShopCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
