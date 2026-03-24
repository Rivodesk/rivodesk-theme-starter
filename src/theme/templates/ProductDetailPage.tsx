'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, ChevronLeft, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { Product, ProductVariant, formatPrice } from '@/lib/rivodesk';
import { useCart } from '../components/CartContext';

interface ProductDetailPageProps {
  product: Product;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const { addItem, openDrawer } = useCart();

  const sortedImages = [...(product.images ?? [])].sort((a, b) => a.position - b.position);
  const sortedOptions = [...(product.options ?? [])].sort((a, b) => a.position - b.position);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    sortedOptions.forEach(opt => {
      defaults[opt.name] = opt.values[0] ?? '';
    });
    return defaults;
  });
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Find matching variant
  const selectedVariant: ProductVariant | null =
    product.variants?.find(v => {
      if (!v.options || Object.keys(v.options).length === 0) return true;
      return Object.entries(selectedOptions).every(
        ([key, val]) => v.options[key] === val
      );
    }) ?? product.variants?.[0] ?? null;

  const price = selectedVariant?.price ?? 0;
  const compareAtPrice = selectedVariant?.compare_at_price ?? null;
  const isAvailable = (selectedVariant?.inventory_qty ?? 0) > 0;
  const primaryImage = sortedImages[activeImageIndex] ?? null;

  const handleAddToCart = () => {
    if (!selectedVariant || !isAvailable) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        variantId: selectedVariant.id,
        productId: product.id,
        title: product.title,
        variantTitle: selectedVariant.title,
        price: selectedVariant.price,
        imageUrl: sortedImages[0]?.url ?? null,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openDrawer();
  };

  return (
    <div
      className="mx-auto px-4 sm:px-6 lg:px-8 py-10"
      style={{ maxWidth: 'var(--container-max)' }}
    >
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ChevronLeft className="h-4 w-4" />
          Terug naar producten
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image gallery */}
        <div className="space-y-3">
          {/* Main image */}
          <div
            className="relative aspect-square rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--color-bg-secondary)' }}
          >
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt_text ?? product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag
                  className="h-20 w-20 opacity-20"
                  style={{ color: 'var(--color-text-muted)' }}
                />
              </div>
            )}
            {!isAvailable && (
              <div className="absolute top-3 left-3">
                <span
                  className="text-xs font-semibold text-white px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-text-muted)' }}
                >
                  Uitverkocht
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {sortedImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {sortedImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(i)}
                  className="relative aspect-square rounded-lg overflow-hidden transition-all"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    outline: activeImageIndex === i ? `2px solid var(--color-primary)` : 'none',
                    outlineOffset: '2px',
                    opacity: activeImageIndex === i ? 1 : 0.7,
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text ?? `${product.title} ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          {product.vendor && (
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
              {product.vendor}
            </p>
          )}

          <h1
            className="text-3xl font-bold mb-4 leading-tight"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
          >
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span
              className="text-2xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              {formatPrice(price)}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span
                className="text-base line-through"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {formatPrice(compareAtPrice)}
              </span>
            )}
            {compareAtPrice && compareAtPrice > price && (
              <span
                className="text-xs font-bold text-white px-2 py-1 rounded-md"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                -{Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Options */}
          {sortedOptions.map(option => (
            <div key={option.id} className="mb-5">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                {option.name}:{' '}
                <span className="normal-case font-normal" style={{ color: 'var(--color-text-muted)' }}>
                  {selectedOptions[option.name]}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {option.values.map(val => {
                  const isSelected = selectedOptions[option.name] === val;
                  return (
                    <button
                      key={val}
                      onClick={() =>
                        setSelectedOptions(prev => ({ ...prev, [option.name]: val }))
                      }
                      className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
                      style={{
                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-bg)',
                        color: isSelected ? '#fff' : 'var(--color-text)',
                      }}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Qty selector */}
          <div className="mb-5">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              Aantal
            </p>
            <div
              className="inline-flex items-center border rounded-lg overflow-hidden"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
                aria-label="Minder"
              >
                <Minus className="h-4 w-4" style={{ color: 'var(--color-text)' }} />
              </button>
              <span
                className="px-5 text-sm font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="p-3 hover:bg-gray-100 transition-colors"
                aria-label="Meer"
              >
                <Plus className="h-4 w-4" style={{ color: 'var(--color-text)' }} />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            style={{ backgroundColor: isAvailable ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
          >
            <ShoppingBag className="h-4 w-4" />
            {!isAvailable
              ? 'Uitverkocht'
              : added
              ? 'Toegevoegd!'
              : 'In winkelwagen'}
          </button>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full border"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'var(--color-bg-secondary)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div
              className="mt-8 pt-8 border-t"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'var(--color-text)' }}
              >
                Beschrijving
              </h3>
              <div
                className="text-sm leading-relaxed prose prose-sm max-w-none"
                style={{ color: 'var(--color-text-muted)' }}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
