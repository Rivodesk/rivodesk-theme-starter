export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { rivoGet, SHOP_ID } from '@/lib/rivodesk';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get('order_number');
  const email       = searchParams.get('email');

  if (!orderNumber || !email) {
    return NextResponse.json({ error: 'order_number en email vereist' }, { status: 400 });
  }

  const { data, error } = await rivoGet<{ order: unknown }>(
    'storefront-orders',
    { shop_id: SHOP_ID, email, order_number: orderNumber },
  );
  if (error || !data?.order) return NextResponse.json({ error: 'Bestelling niet gevonden' }, { status: 404 });
  return NextResponse.json(data.order);
}
