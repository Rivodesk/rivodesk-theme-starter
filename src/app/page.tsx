import { getProducts } from '@/lib/queries';
import { ProductCard } from '@/components/ProductCard';

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts(24);

  return (
    <div className="container-main py-10">
      {/* Hero */}
      <section className="mb-14 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
          Welkom in onze winkel
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Ontdek onze collectie. Gratis verzending vanaf €50.
        </p>
      </section>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Geen producten gevonden.</p>
          <p className="text-sm mt-2">Voeg producten toe in je Shopify admin.</p>
        </div>
      ) : (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Alle producten</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
