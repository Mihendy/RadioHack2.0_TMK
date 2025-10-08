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
  const [syncedWithServer, setSyncedWithServer] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("pipe-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart:", e);
      }
    }

    const token = localStorage.getItem("token");
    if (!token) return; // безопасно не вызывать сервер без токена

    fetch("/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) {
          console.warn("Failed to sync cart: status", r.status);
          return null; // безопасно вернуть null
        }
        try {
          return await r.json();
        } catch {
          console.warn("Failed to parse cart JSON");
          return null;
        }
      })
      .then((data) => {
        if (data?.items) {
          const serverItems: CartItem[] = data.items.map((it: any) => ({
            product: { ...it.Nomenclature, price: undefined },
            quantity: it.QuantityInMeters || it.QuantityInTons || 0,
            unit: it.QuantityInMeters ? "M" : "T",
            serverId: it.ID,
          }));
          setItems(serverItems);
          setSyncedWithServer(true);
        }
      })
      .catch((e) => console.warn("Failed to sync cart from server", e));
  }, []);

  useEffect(() => {
    localStorage.setItem("pipe-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number, unit: UnitType) => {
    const token = localStorage.getItem("token");

    const addToLocal = (serverId?: string) => {
      setItems((prev) => {
        const index = prev.findIndex((item) => item.product.ID === product.ID);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            quantity: updated[index].quantity + quantity,
            unit,
            serverId: serverId || updated[index].serverId,
          };
          return updated;
        }
        return [...prev, { product, quantity, unit, serverId }];
      });
    };

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
        .then(async (r) => {
          if (!r.ok) throw new Error("Failed to add item");
          const created = await r.json();
          addToLocal(created?.ID);
        })
        .catch((e) => {
          console.warn("Failed to add item to server, fallback to local", e);
          addToLocal();
        });
      return;
    }

    addToLocal();
  };

  const removeItem = (productId: string) => {
    const token = localStorage.getItem("token");
    const item = items.find((i) => i.product.ID === productId);

    const removeFromLocal = () => setItems((prev) => prev.filter((i) => i.product.ID !== productId));

    if (token && item?.serverId) {
      fetch(`/api/cart/items/${item.serverId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => removeFromLocal())
        .catch((e) => {
          console.warn("Failed to remove item on server, fallback to local", e);
          removeFromLocal();
        });
      return;
    }

    removeFromLocal();
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const token = localStorage.getItem("token");
    const item = items.find((i) => i.product.ID === productId);

    const updateLocal = () => {
      setItems((prev) => prev.map((i) => (i.product.ID === productId ? { ...i, quantity } : i)));
    };

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
        .then(() => updateLocal())
        .catch((e) => {
          console.warn("Failed to update quantity on server, fallback to local", e);
          updateLocal();
        });
      return;
    }

    updateLocal();
  };

  const updateUnit = (productId: string, unit: UnitType) => {
    setItems((prev) => prev.map((item) => (item.product.ID === productId ? { ...item, unit } : item)));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.length;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, updateUnit, clearCart, itemCount, totalItems }}
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
