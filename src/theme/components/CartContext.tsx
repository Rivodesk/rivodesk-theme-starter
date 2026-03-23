'use client';
import { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  variantTitle: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === item.variantId);
      if (existing) {
        return prev.map(i =>
          i.variantId === item.variantId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems(prev => prev.filter(i => i.variantId !== variantId));
  }, []);

  const updateQty = useCallback(
    (variantId: string, qty: number) => {
      if (qty <= 0) {
        removeItem(variantId);
        return;
      }
      setItems(prev =>
        prev.map(i => (i.variantId === variantId ? { ...i, quantity: qty } : i))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
        drawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
