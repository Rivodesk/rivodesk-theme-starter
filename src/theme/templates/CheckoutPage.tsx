'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, Lock } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { CheckoutForm } from '../components/CheckoutForm';
import { formatPrice } from '@/lib/rivodesk';

export function CheckoutPage() {
  const { items, totalItems, totalPrice } = useCart();
  const router = useRouter();
  const [done, setDone] = useState(false);

  const handleDone = () => {
    setDone(true);
    setTimeout(() => router.push('/'), 3000);
  };

  if (totalItems === 0 && !done) {
    return (
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
        style={{ maxWidth: 'var(--container-max)' }}
      >
        <ShoppingBag
          className="h-16 w-16 mx-auto mb-4 opacity-20"
          style={{ color: 'var(--color-text-muted)' }}
        />
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
        >
          Je winkelwagen is leeg
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Voeg producten toe om verder te gaan met afrekenen.
        </p>
        <a
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Ga winkelen
        </a>
      </div>
    );
  }

  return (
    <div
      className="mx-auto px-4 sm:px-6 lg:px-8 py-12"
      style={{ maxWidth: 'var(--container-max)' }}
    >
      {/* Page header */}
      <div className="mb-8 flex items-center gap-2">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
        >
          Afrekenen
        </h1>
        <span
          className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200"
        >
          <Lock className="h-3 w-3" />
          Beveiligd
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: checkout form */}
        <div>
          <CheckoutForm onDone={handleDone} />
        </div>

        {/* Right: order summary */}
        <div className="lg:order-first xl:order-last">
          <div
            className="rounded-2xl border p-6 sticky top-24"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
          >
            <h2
              className="text-base font-semibold mb-5"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            >
              Besteloverzicht
            </h2>

            <ul className="space-y-4 mb-5">
              {items.map(item => (
                <li key={item.variantId} className="flex gap-3 items-start">
                  {/* Thumbnail */}
                  <div
                    className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-border)' }}
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag
                          className="h-6 w-6 opacity-30"
                          style={{ color: 'var(--color-text-muted)' }}
                        />
                      </div>
                    )}
                    {/* Qty badge */}
                    <span
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      {item.quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium line-clamp-1"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {item.title}
                    </p>
                    {item.variantTitle !== 'Default Title' && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                        {item.variantTitle}
                      </p>
                    )}
                  </div>

                  <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--color-text)' }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div
              className="border-t pt-4 space-y-2"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--color-text-muted)' }}>Subtotaal</span>
                <span style={{ color: 'var(--color-text)' }}>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--color-text-muted)' }}>Verzending</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div
                className="flex justify-between font-bold text-base pt-3 border-t"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <span>Totaal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <p
              className="text-xs text-center mt-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Inclusief BTW. Veilig betalen via Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
