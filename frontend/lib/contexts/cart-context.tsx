"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
// token is read from localStorage; avoid using Telegram WebApp typings here
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
  const [syncedWithServer, setSyncedWithServer] = useState(false);

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

    // If token present (from localStorage), try to sync with backend
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.items) {
            const serverItems: CartItem[] = data.items.map((it: any) => ({
              product: {
                ...it.Nomenclature,
                price: undefined,
              },
              quantity: it.QuantityInMeters || it.QuantityInTons || 0,
              unit: it.QuantityInMeters ? "M" : "T",
              serverId: it.ID,
            }));
            setItems(serverItems);
            setSyncedWithServer(true);
          }
        })
        .catch((e) => console.warn("Failed to sync cart from server", e));
    }
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("pipe-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number, unit: UnitType) => {
    // If synced with server or token present, POST to /api/cart/items
    const token = localStorage.getItem("token");

    if (token || syncedWithServer) {
      const body = {
        NomenclatureID: product.ID,
        StockID: product.price?.IDStock || "",
        QuantityInTons: unit === "T" ? quantity : 0,
        QuantityInMeters: unit === "M" ? quantity : 0,
      };
      fetch("/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
        .then((r) => r.json())
          .then((created) => {
            setItems((prev: CartItem[]) => {
              const existingIndex = prev.findIndex((item: CartItem) => item.product.ID === product.ID);
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  quantity: updated[existingIndex].quantity + quantity,
                  unit,
                  serverId: created.ID,
                };
                return updated;
              }
              return [...prev, { product, quantity, unit, serverId: created.ID }];
            });
          })
        .catch((e) => {
          console.warn("Failed to add item to server cart, falling back to local", e);
          // fallback to local
          setItems((prev: CartItem[]) => {
            const existingIndex = prev.findIndex((item: CartItem) => item.product.ID === product.ID);
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
        });
      return;
    }

    // local fallback
    setItems((prev: CartItem[]) => {
      const existingIndex = prev.findIndex((item: CartItem) => item.product.ID === product.ID);
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
    const token = localStorage.getItem("token");

  const item = items.find((i: CartItem) => i.product.ID === productId);
    if (token && item?.serverId) {
      fetch(`/api/cart/items/${item.serverId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => setItems((prev: CartItem[]) => prev.filter((it: CartItem) => it.product.ID !== productId)))
        .catch((e) => {
          console.warn("Failed to remove item on server, fallback to local", e);
          setItems((prev: CartItem[]) => prev.filter((it: CartItem) => it.product.ID !== productId));
        });
      return;
    }

    setItems((prev: CartItem[]) => prev.filter((item: CartItem) => item.product.ID !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const token = localStorage.getItem("token");

  const item = items.find((i: CartItem) => i.product.ID === productId);
    if (token && item?.serverId) {
      const body = {
        NomenclatureID: item.product.ID,
        StockID: item.product.price?.IDStock || "",
        QuantityInTons: item.unit === "T" ? quantity : 0,
        QuantityInMeters: item.unit === "M" ? quantity : 0,
      };
      fetch(`/api/cart/items/${item.serverId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
        .then(() => setItems((prev: CartItem[]) => prev.map((it: CartItem) => (it.product.ID === productId ? { ...it, quantity } : it))))
        .catch((e) => {
          console.warn("Failed to update quantity on server, fallback to local", e);
          setItems((prev: CartItem[]) => prev.map((it: CartItem) => (it.product.ID === productId ? { ...it, quantity } : it)));
        });
      return;
    }

    setItems((prev: CartItem[]) => prev.map((item: CartItem) => (item.product.ID === productId ? { ...item, quantity } : item)));
  };

  const updateUnit = (productId: string, unit: UnitType) => {
    setItems((prev: CartItem[]) => prev.map((item: CartItem) => (item.product.ID === productId ? { ...item, unit } : item)));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.length;
  const totalItems = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

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
