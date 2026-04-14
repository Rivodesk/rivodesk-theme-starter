export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { rivoGet, mapProducts, SHOP_ID } from '@/lib/rivodesk';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q      = searchParams.get('q') ?? '';
  const limit  = searchParams.get('limit') ?? '24';
  const offset = searchParams.get('offset') ?? '0';

  if (!q.trim()) return NextResponse.json({ products: [], total: 0 });

  const { data, error } = await rivoGet<{ products: Record<string, unknown>[]; total: number }>(
    'storefront-search',
    { shop_id: SHOP_ID, q, limit, offset },
  );
  if (error || !data) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ products: mapProducts(data.products ?? []), total: data.total });
}
