export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase, SHOP_ID } from '@/lib/rivodesk';

export async function GET() {
  const { data, error } = await supabase
    .from('shops')
    .select('id, name, brand_color, widget_title, description')
    .eq('id', SHOP_ID)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
  }
  return NextResponse.json(data);
}
