'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/rivodesk';
import { ProductGrid } from '../components/ProductGrid';

interface HomePageProps {
  products: Product[];
  shopName: string;
}

export function HomePage({ products, shopName }: HomePageProps) {
  const newArrivals = products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative z-10"
          style={{ maxWidth: 'var(--container-max)' }}
        >
          <div className="max-w-2xl">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full border border-white/20 text-white/70"
            >
              Nieuw seizoen
            </span>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Welkom bij{' '}
              <span style={{ color: 'var(--color-accent)' }}>{shopName}</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
              Ontdek onze collectie. Gratis verzending vanaf €50 binnen Nederland en België.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                Bekijk collectie
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold transition-all hover:bg-white/10 border border-white/30 text-white"
              >
                Bestelling volgen
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at 70% 50%, var(--color-accent) 0%, transparent 60%)',
          }}
        />
      </section>

      {/* USP bar */}
      <div
        className="border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 py-4"
          style={{ maxWidth: 'var(--container-max)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { icon: '🚚', text: 'Gratis verzending vanaf €50' },
              { icon: '↩️', text: '30 dagen retourneren' },
              { icon: '🔒', text: 'Veilig betalen' },
            ].map(usp => (
              <p
                key={usp.text}
                className="text-xs font-medium flex items-center justify-center gap-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <span>{usp.icon}</span>
                {usp.text}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* New arrivals section */}
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-16"
        style={{ maxWidth: 'var(--container-max)' }}
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'var(--color-accent)' }}
            >
              Collectie
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            >
              Nieuw binnen
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Alles bekijken
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ProductGrid products={newArrivals} />

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-gray-50"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            Alle producten bekijken
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
