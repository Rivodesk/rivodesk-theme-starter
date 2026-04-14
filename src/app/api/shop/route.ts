export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { rivoGet, SHOP_ID } from '@/lib/rivodesk';

export async function GET() {
  const { data, error } = await rivoGet('storefront-shop', { shop_id: SHOP_ID });
  if (error || !data) return NextResponse.json({ error: 'Shop niet gevonden' }, { status: 404 });
  return NextResponse.json(data);
}
