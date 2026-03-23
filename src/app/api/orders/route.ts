export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase, SHOP_ID } from '@/lib/rivodesk';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get('order_number');
  const email = searchParams.get('email');

  if (!orderNumber || !email) {
    return NextResponse.json({ error: 'order_number and email required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, email, financial_status, fulfillment_status, total_price, currency, line_items, shipping_address, created_at')
    .eq('shop_id', SHOP_ID)
    .eq('order_number', orderNumber)
    .ilike('email', email)
    .maybeSingle();

  if (error || !data) return NextResponse.json({ error: 'Bestelling niet gevonden' }, { status: 404 });
  return NextResponse.json(data);
}
