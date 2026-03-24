export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { ProductsPage } from '@/theme/templates/ProductsPage';

export const metadata: Metadata = {
  title: 'Alle producten',
};

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/products`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProductsListPage() {
  const products = await getProducts();
  return <ProductsPage products={products} />;
}
