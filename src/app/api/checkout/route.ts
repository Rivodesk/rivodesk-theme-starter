export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { rivoPost, SHOP_ID } from '@/lib/rivodesk';

const SUPABASE_URL  = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
  const { customer, items, total, currency, session_id } = await req.json();
  const amount_cents = Math.round(Number(total) * 100);

  // 1. Sla checkout op als abandoned checkout (voor recovery)
  const lineItems = (items ?? []).map((i: { product_id?: string; variantId?: string; variant_id?: string; title: string; price: number; quantity: number; imageUrl?: string; image_url?: string; variantTitle?: string; variant_title?: string; sku?: string }) => ({
    product_id:  i.product_id ?? '',
    variant_id:  i.variantId ?? i.variant_id ?? '',
    title:       i.title,
    price:       i.price,
    quantity:    i.quantity,
    image_url:   i.imageUrl ?? i.image_url ?? null,
    sku:         i.sku ?? null,
  }));

  if (session_id) {
    await rivoPost('storefront-checkout', {
      action: 'create',
      shop_id: SHOP_ID,
      session_id,
      customer_email: customer?.email,
      customer_name: [customer?.firstName, customer?.lastName].filter(Boolean).join(' '),
      line_items: lineItems,
    });
  }

  // 2. Start Rivo Pay betaling
  const res = await fetch(`${SUPABASE_URL}/functions/v1/rivo-pay-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      shop_id:        SHOP_ID,
      amount_cents,
      currency:       (currency ?? 'EUR').toLowerCase(),
      customer_email: customer?.email,
      line_items:     lineItems.map((i: { title: string; quantity: number; price: number }) => ({ title: i.title, quantity: i.quantity, price: i.price })),
      order_meta:     { customer, line_items: lineItems },
    }),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });
  return NextResponse.json({ clientSecret: data.client_secret, ...data });
}
