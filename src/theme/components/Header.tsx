'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Producten' },
  { href: '/orders', label: 'Bestellingen' },
];

interface HeaderProps {
  shopName: string;
  cartCount?: number;
  brandColor?: string;
}

export function Header({ shopName, brandColor }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();

  return (
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div
        className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: 'var(--container-max)' }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
          style={{ color: brandColor ?? 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
        >
          {shopName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button
            onClick={openDrawer}
            className="relative p-2 rounded-full transition-colors hover:bg-gray-100"
            aria-label="Winkelwagen openen"
          >
            <ShoppingBag className="h-5 w-5" style={{ color: 'var(--color-text)' }} />
            {totalItems > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full text-white text-[10px] font-bold"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" style={{ color: 'var(--color-text)' }} />
            ) : (
              <Menu className="h-5 w-5" style={{ color: 'var(--color-text)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t overflow-hidden bg-white"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                  style={{ color: 'var(--color-text)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
