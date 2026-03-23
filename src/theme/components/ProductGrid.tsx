import { Product } from '@/lib/rivodesk';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div
        className="aspect-[3/4] rounded-xl mb-3"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      />
      <div
        className="h-4 rounded mb-2 w-3/4"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      />
      <div
        className="h-4 rounded w-1/3"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      />
    </div>
  );
}

export function ProductGrid({ products, title, loading = false }: ProductGridProps) {
  return (
    <section>
      {title && (
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
            Geen producten gevonden.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
