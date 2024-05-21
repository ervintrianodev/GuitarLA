import { useEffect, useState } from "react";
import { db } from "../data/db";
import type { TGuitar, TCartItem, GuitarId } from "../types/types";

export const useCart = () => {
  const initialCartState = (): TCartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [guitars, setGuitar] = useState(db);
  const [cart, setCart] = useState(initialCartState);

  const MAX_ITEMS = 7;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item: TGuitar) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    } else {
      const newItem: TCartItem = { ...item, quantity: 1 };

      setCart([...cart, newItem]);
    }
  }
  function increaseQuantity(id: GuitarId) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }
  function decreaseQuantity(id: GuitarId) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  function removeFromCart(id: GuitarId) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  return {
    guitars,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };
};
