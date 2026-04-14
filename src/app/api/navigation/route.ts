export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { rivoGet, SHOP_ID } from '@/lib/rivodesk';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get('handle') ?? undefined;

  const params: Record<string, string> = { shop_id: SHOP_ID };
  if (handle) params.handle = handle;

  const { data, error } = await rivoGet('storefront-navigation', params);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}
