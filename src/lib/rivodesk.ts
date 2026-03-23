import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

// Backwards-compat alias — only use inside request handlers
export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    return (getSupabase() as any)[prop];
  },
});

export const SHOP_ID = process.env.SHOP_ID ?? '';

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  vendor: string | null;
  product_type: string;
  tags: string[];
  status: string;
  images: ProductImage[];
  variants: ProductVariant[];
  options: ProductOption[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  position: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price: number | null;
  inventory_qty: number;
  available: boolean;
  sku: string | null;
  options: Record<string, string>;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
  position: number;
}

export interface ShopConfig {
  id: string;
  name: string;
  brand_color: string;
  widget_title: string | null;
  description: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  email: string;
  financial_status: string;
  fulfillment_status: string | null;
  total_price: number;
  currency: string;
  line_items: any[];
  shipping_address: any | null;
  created_at: string;
}

export function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
  }).format(amount);
}
