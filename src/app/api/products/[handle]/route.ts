export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase, SHOP_ID } from '@/lib/rivodesk';

export async function GET(_req: Request, { params }: { params: { handle: string } }) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, title, handle, description, vendor, product_type, tags, status,
      product_images ( id, url, alt_text, position ),
      product_variants ( id, title, price, compare_at_price, inventory_qty, available, sku, options ),
      product_options ( id, name, values, position )
    `)
    .eq('shop_id', SHOP_ID)
    .eq('handle', params.handle)
    .eq('status', 'ACTIVE')
    .maybeSingle();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { product_images, product_variants, product_options, ...p } = data as any;
  return NextResponse.json({ ...p, images: product_images ?? [], variants: product_variants ?? [], options: product_options ?? [] });
}
