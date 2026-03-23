'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';
import { formatPrice } from '@/lib/rivodesk';

export function CartDrawer() {
  const { items, removeItem, updateQty, totalItems, totalPrice, drawerOpen, closeDrawer } =
    useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                <h2
                  className="font-semibold text-base"
                  style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
                >
                  Winkelwagen
                </h2>
                {totalItems > 0 && (
                  <span
                    className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Sluiten"
              >
                <X className="h-5 w-5" style={{ color: 'var(--color-text)' }} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag
                    className="h-16 w-16 opacity-20"
                    style={{ color: 'var(--color-text-muted)' }}
                  />
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    Je winkelwagen is leeg
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Voeg producten toe om verder te gaan.
                  </p>
                  <button
                    onClick={closeDrawer}
                    className="mt-2 text-sm font-medium underline transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Verder winkelen
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map(item => (
                    <li
                      key={item.variantId}
                      className="flex gap-4 py-3 border-b last:border-b-0"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      {/* Thumbnail */}
                      <div
                        className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag
                              className="h-8 w-8 opacity-20"
                              style={{ color: 'var(--color-text-muted)' }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium line-clamp-2 leading-snug"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {item.title}
                        </p>
                        {item.variantTitle !== 'Default Title' && (
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {item.variantTitle}
                          </p>
                        )}
                        <p
                          className="text-sm font-semibold mt-1"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {formatPrice(item.price * item.quantity)}
                        </p>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className="flex items-center border rounded-lg overflow-hidden"
                            style={{ borderColor: 'var(--color-border)' }}
                          >
                            <button
                              onClick={() => updateQty(item.variantId, item.quantity - 1)}
                              className="p-1.5 hover:bg-gray-100 transition-colors"
                              aria-label="Minder"
                            >
                              <Minus className="h-3.5 w-3.5" style={{ color: 'var(--color-text)' }} />
                            </button>
                            <span
                              className="px-3 text-sm font-medium"
                              style={{ color: 'var(--color-text)' }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.variantId, item.quantity + 1)}
                              className="p-1.5 hover:bg-gray-100 transition-colors"
                              aria-label="Meer"
                            >
                              <Plus className="h-3.5 w-3.5" style={{ color: 'var(--color-text)' }} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="p-1.5 rounded hover:bg-red-50 transition-colors"
                            aria-label="Verwijderen"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="px-5 py-5 border-t"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    Subtotaal
                  </span>
                  <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-xs mb-4 text-center" style={{ color: 'var(--color-text-muted)' }}>
                  Verzendkosten worden berekend bij het afrekenen.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="block w-full text-center py-3.5 px-6 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Afrekenen
                </Link>
                <button
                  onClick={closeDrawer}
                  className="block w-full text-center mt-2 py-2 text-sm transition-opacity hover:opacity-70"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Verder winkelen
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
