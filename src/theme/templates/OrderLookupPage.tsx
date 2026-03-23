'use client';

import { useState, FormEvent } from 'react';
import { Search, Package, Loader2, CheckCircle, Truck, Clock } from 'lucide-react';
import { Order, formatPrice } from '@/lib/rivodesk';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  paid: { label: 'Betaald', color: '#16a34a' },
  pending: { label: 'In afwachting', color: '#d97706' },
  refunded: { label: 'Terugbetaald', color: '#dc2626' },
  voided: { label: 'Geannuleerd', color: '#6b7280' },
  fulfilled: { label: 'Verzonden', color: '#2563eb' },
  unfulfilled: { label: 'Nog niet verzonden', color: '#d97706' },
  partial: { label: 'Gedeeltelijk verzonden', color: '#7c3aed' },
};

function statusBadge(status: string | null) {
  if (!status) return null;
  const s = STATUS_LABELS[status.toLowerCase()] ?? { label: status, color: '#6b7280' };
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
      style={{ backgroundColor: s.color }}
    >
      {s.label}
    </span>
  );
}

export function OrderLookupPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const params = new URLSearchParams({ order_number: orderNumber, email });
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Bestelling niet gevonden.');
      }
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    'w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 transition-all';

  return (
    <div
      className="mx-auto px-4 sm:px-6 lg:px-8 py-16"
      style={{ maxWidth: 'var(--container-max)' }}
    >
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ backgroundColor: 'var(--color-bg-secondary)' }}
          >
            <Package className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
          >
            Bestelling volgen
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Voer je bestelnummer en e-mailadres in om de status te bekijken.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border p-6 space-y-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Bestelnummer *
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              className={fieldClass}
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              placeholder="bijv. 1001"
            />
          </div>
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              E-mailadres *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={fieldClass}
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              placeholder="je@email.nl"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Zoeken…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Zoek bestelling
              </>
            )}
          </button>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
        </form>

        {/* Results */}
        {order && (
          <div
            className="mt-6 rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {/* Order header */}
            <div
              className="px-6 py-4 border-b"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg-secondary)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Bestelling
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
                  >
                    #{order.order_number}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(order.created_at).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {statusBadge(order.financial_status)}
                  {statusBadge(order.fulfillment_status)}
                </div>
              </div>
            </div>

            {/* Line items */}
            {Array.isArray(order.line_items) && order.line_items.length > 0 && (
              <div className="px-6 py-4">
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-3"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Producten
                </p>
                <ul className="space-y-3">
                  {order.line_items.map((item: any, i: number) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <div>
                        <span style={{ color: 'var(--color-text)' }}>{item.title}</span>
                        {item.variant_title && item.variant_title !== 'Default Title' && (
                          <span
                            className="text-xs ml-1"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            ({item.variant_title})
                          </span>
                        )}
                        <span
                          className="text-xs ml-2"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          × {item.quantity}
                        </span>
                      </div>
                      <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                        {formatPrice(item.price * item.quantity, order.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Total */}
            <div
              className="px-6 py-4 border-t"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                  Totaalbedrag
                </span>
                <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                  {formatPrice(order.total_price, order.currency)}
                </span>
              </div>
            </div>

            {/* Shipping address */}
            {order.shipping_address && (
              <div
                className="px-6 py-4 border-t"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Bezorgadres
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {order.shipping_address.name ?? order.shipping_address.first_name}
                  <br />
                  {order.shipping_address.address1}
                  <br />
                  {order.shipping_address.zip} {order.shipping_address.city}
                  <br />
                  {order.shipping_address.country}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
