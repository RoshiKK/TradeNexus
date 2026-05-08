import { useState } from "react";

export const useCart = () => {
  const [items, setItems] = useState([]);

  const add = (product) =>
    setItems((prev) => {
      const existing = prev.find((p) => p._id === product._id);
      if (existing)
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      return [...prev, { ...product, qty: 1 }];
    });

  const remove = (id) => setItems((prev) => prev.filter((p) => p._id !== id));
  const clear = () => setItems([]);

  return { items, add, remove, clear };
};
