export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { rivoPost, SHOP_ID } from '@/lib/rivodesk';

export async function POST(req: Request) {
  const body = await req.json();
  const { customer, items, total, currency, session_id } = body;

  const lineItems = (items ?? []).map((i: {
    product_id?: string; variantId?: string; variant_id?: string;
    title: string; price: number; quantity: number;
    imageUrl?: string; image_url?: string; variantTitle?: string; sku?: string;
  }) => ({
    product_id: i.product_id ?? '',
    variant_id: i.variantId ?? i.variant_id ?? '',
    title:      i.title,
    price:      i.price,
    quantity:   i.quantity,
    image_url:  i.imageUrl ?? i.image_url ?? null,
    sku:        i.sku ?? null,
  }));

  // Sla op als abandoned checkout + start betaling via rivo-api
  const { data, error } = await rivoPost('checkout', {
    action:         'create',
    shop_id:        SHOP_ID,
    session_id,
    customer_email: customer?.email,
    customer_name:  [customer?.firstName, customer?.lastName].filter(Boolean).join(' '),
    line_items:     lineItems,
    total:          Number(total),
    currency:       currency ?? 'EUR',
    customer,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}
