"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { CartItem, Product, UnitType } from "../types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, unit: UnitType) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateUnit: (productId: string, unit: UnitType) => void;
  clearCart: () => void;
  itemCount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Загружаем корзину из localStorage при монтировании
  useEffect(() => {
    const savedCart = localStorage.getItem("pipe-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart:", e);
      }
    }
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("pipe-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number, unit: UnitType) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.ID === product.ID
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          unit,
        };
        return updated;
      }
      return [...prev, { product, quantity, unit }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.ID !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.ID === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateUnit = (productId: string, unit: UnitType) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.ID === productId ? { ...item, unit } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.length;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateUnit,
        clearCart,
        itemCount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
