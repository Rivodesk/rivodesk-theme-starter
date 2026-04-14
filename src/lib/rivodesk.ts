/**
 * Rivodesk Storefront SDK
 * Data ophalen via de Rivodesk API (api.rivodesk.com).
 * Geen Supabase credentials nodig in het thema.
 */

const API_URL  = process.env.RIVODESK_API_URL ?? 'https://rivodesk-rivo-dashboard.vercel.app';
export const SHOP_ID = process.env.SHOP_ID ?? '';

export async function rivoGet<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<{ data: T | null; error: string | null }> {
  try {
    const url = new URL(`${API_URL}/v1/${path}`);
    url.searchParams.set('shop_id', SHOP_ID);
    for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);

    const res  = await fetch(url.toString(), { next: { revalidate: 0 } });
    const body = await res.json();
    if (!res.ok) return { data: null, error: body.error ?? `HTTP ${res.status}` };
    return { data: body as T, error: null };
  } catch (e) {
    return { data: null, error: (e as Error).message };
  }
}

export async function rivoPost<T>(
  path: string,
  body: unknown,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res  = await fetch(`${API_URL}/v1/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shop_id: SHOP_ID, ...(body as object) }),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error ?? `HTTP ${res.status}` };
    return { data: json as T, error: null };
  } catch (e) {
    return { data: null, error: (e as Error).message };
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  vendor: string | null;
  product_type: string;
  tags: string[];
  status: string;
  seo_title: string | null;
  seo_description: string | null;
  compare_at_price: number | null;
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

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  image_url: string | null;
  image_alt: string | null;
}

export interface ShopConfig {
  id: string;
  name: string;
  store_domain: string;
  brand_color: string;
  widget_title: string | null;
  website_url: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  email: string;
  financial_status: string;
  fulfillment_status: string | null;
  total_price: number;
  currency: string;
  line_items: OrderLineItem[];
  shipping_address: ShippingAddress | null;
  tracking_number: string | null;
  tracking_url: string | null;
  created_at: string;
}

export interface OrderLineItem {
  title: string;
  quantity: number;
  price: number;
  variant_title?: string;
  sku?: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  country: string;
  phone?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function mapProducts(raw: Record<string, unknown>[]): Product[] {
  return raw.map((p) => ({
    ...p,
    images:   (p.product_images   as ProductImage[]  ) ?? [],
    variants: (p.product_variants as ProductVariant[]) ?? [],
    options:  (p.product_options  as ProductOption[] ) ?? [],
  } as Product));
}

export function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(amount);
}
