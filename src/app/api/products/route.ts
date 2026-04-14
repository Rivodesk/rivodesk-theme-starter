export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { rivoGet, mapProducts, SHOP_ID } from '@/lib/rivodesk';

export async function GET() {
  const { data, error } = await rivoGet<{ products: Record<string, unknown>[] }>(
    'storefront-products',
    { shop_id: SHOP_ID },
  );
  if (error || !data) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(mapProducts(data.products ?? []));
}
