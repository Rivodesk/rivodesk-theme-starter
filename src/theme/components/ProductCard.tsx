'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product, formatPrice } from '@/lib/rivodesk';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.sort((a, b) => a.position - b.position)[0] ?? null;
  const primaryVariant = product.variants?.[0] ?? null;
  const isAvailable = product.variants?.some(v => (v.inventory_qty ?? 0) > 0) ?? false;
  const price = primaryVariant?.price ?? 0;
  const compareAtPrice = primaryVariant?.compare_at_price ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Link href={`/products/${product.handle}`} className="group block">
        {/* Image container */}
        <div
          className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-16 w-16 opacity-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Sold out overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span
                className="text-xs font-semibold bg-white px-3 py-1.5 rounded-full shadow-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Uitverkocht
              </span>
            </div>
          )}

          {/* Sale badge */}
          {compareAtPrice && compareAtPrice > price && isAvailable && (
            <div className="absolute top-2 left-2">
              <span
                className="text-xs font-bold text-white px-2 py-1 rounded-md"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                Sale
              </span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="px-0.5">
          <h3
            className="text-sm font-medium line-clamp-2 leading-snug mb-1 transition-opacity group-hover:opacity-70"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
          >
            {product.title}
          </h3>
          {product.vendor && (
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
              {product.vendor}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              {formatPrice(price)}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span
                className="text-xs line-through"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
