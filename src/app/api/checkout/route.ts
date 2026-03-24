export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const SHOP_ID = process.env.SHOP_ID!;

export async function POST(req: Request) {
  const { customer, items, total, currency } = await req.json();

  const amount_cents = Math.round(Number(total) * 100);

  const res = await fetch(`${SUPABASE_URL}/functions/v1/rivo-pay-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      shop_id: SHOP_ID,
      amount_cents,
      currency: (currency ?? 'EUR').toLowerCase(),
      customer_email: customer?.email,
      line_items: items?.map((i: any) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price,
      })),
      order_meta: {
        customer,
        line_items: items?.map((i: any) => ({
          title: i.title,
          variant_title: i.variant_title,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  return NextResponse.json({ clientSecret: data.client_secret, ...data });
}
