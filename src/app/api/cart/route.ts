export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { rivoPost, SHOP_ID } from '@/lib/rivodesk';

export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await rivoPost<{ cart: unknown }>('storefront-cart', { ...body, shop_id: SHOP_ID });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}
