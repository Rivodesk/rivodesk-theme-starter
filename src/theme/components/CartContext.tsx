'use client';
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export interface CartItem {
  variantId:    string;
  productId:    string;
  title:        string;
  variantTitle: string;
  price:        number;
  imageUrl:     string | null;
  quantity:     number;
  sku?:         string;
}

interface CartContextType {
  items:       CartItem[];
  sessionId:   string;
  addItem:     (item: Omit<CartItem, 'quantity'>) => void;
  removeItem:  (variantId: string) => void;
  updateQty:   (variantId: string, qty: number) => void;
  clearCart:   () => void;
  totalItems:  number;
  totalPrice:  number;
  drawerOpen:  boolean;
  openDrawer:  () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('rivo_session_id');
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('rivo_session_id', id); }
  return id;
}

async function syncCart(action: string, sessionId: string, item?: Partial<CartItem>) {
  if (!sessionId) return;
  await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      session_id: sessionId,
      item: item ? { product_id: item.productId, variant_id: item.variantId, title: item.title, price: item.price, quantity: item.quantity ?? 1, image_url: item.imageUrl ?? null, sku: item.sku ?? null } : undefined,
    }),
  }).catch(() => {});
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items,      setItems]      = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sessionId,  setSessionId]  = useState('');
  const syncing = useRef(false);

  useEffect(() => {
    const sid = getOrCreateSessionId();
    setSessionId(sid);
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get', session_id: sid }),
    })
      .then((r) => r.json())
      .then((data) => {
        const serverItems: CartItem[] = (data?.cart?.line_items ?? []).map((i: { variant_id: string; product_id: string; title: string; quantity: number; price: number; image_url?: string; sku?: string }) => ({
          variantId: i.variant_id, productId: i.product_id, title: i.title,
          variantTitle: '', price: i.price, imageUrl: i.image_url ?? null, quantity: i.quantity, sku: i.sku,
        }));
        if (serverItems.length) setItems(serverItems);
      })
      .catch(() => {});
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      const updated = existing
        ? prev.map((i) => i.variantId === item.variantId ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
      if (!syncing.current) {
        syncing.current = true;
        syncCart('add', getOrCreateSessionId(), { ...item, quantity: 1 }).finally(() => { syncing.current = false; });
      }
      return updated;
    });
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
    syncCart('update', getOrCreateSessionId(), { variantId, quantity: 0 });
  }, []);

  const updateQty = useCallback((variantId: string, qty: number) => {
    if (qty <= 0) { removeItem(variantId); return; }
    setItems((prev) => prev.map((i) => i.variantId === variantId ? { ...i, quantity: qty } : i));
    syncCart('update', getOrCreateSessionId(), { variantId, quantity: qty });
  }, [removeItem]);

  const clearCart   = useCallback(() => { setItems([]); syncCart('clear', getOrCreateSessionId()); }, []);
  const openDrawer  = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, sessionId, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, drawerOpen, openDrawer, closeDrawer }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
