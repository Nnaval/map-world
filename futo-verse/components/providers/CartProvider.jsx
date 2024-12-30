"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create a new context
const CartContext = createContext();

// Hook to use the cart context in other components
export const useCart = () => useContext(CartContext);

// Provide the cart context to your app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({}); // Default to an empty cart

  // Only access localStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = JSON.parse(localStorage.getItem("cart"));
      setCart(savedCart || {}); // Set cart from localStorage if available
    }
  }, []); // Runs once when the component is mounted

  // Update localStorage when cart changes
  useEffect(() => {
    if (typeof window !== "undefined") {
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
    console.log("Cleared entire cart");
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
