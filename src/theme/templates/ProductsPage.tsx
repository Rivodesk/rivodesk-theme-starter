'use client';

import { Product } from '@/lib/rivodesk';
import { ProductGrid } from '../components/ProductGrid';

interface ProductsPageProps {
  products: Product[];
}

export function ProductsPage({ products }: ProductsPageProps) {
  return (
    <div
      className="mx-auto px-4 sm:px-6 lg:px-8 py-12"
      style={{ maxWidth: 'var(--container-max)' }}
    >
      {/* Page header */}
      <div className="mb-10">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
        >
          Alle producten
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {products.length} product{products.length !== 1 ? 'en' : ''} gevonden
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
