export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase, SHOP_ID } from '@/lib/rivodesk';

export async function GET() {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id, title, handle, description, vendor, product_type, tags, status,
      product_images ( id, url, alt_text, position ),
      product_variants ( id, title, price, compare_at_price, inventory_qty, available, sku, options ),
      product_options ( id, name, values, position )
    `)
    .eq('shop_id', SHOP_ID)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const mapped = (products ?? []).map(({ product_images, product_variants, product_options, ...p }: any) => ({
    ...p, images: product_images ?? [], variants: product_variants ?? [], options: product_options ?? [],
  }));
  return NextResponse.json(mapped);
}
