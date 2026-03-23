import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailPage } from '@/theme/templates/ProductDetailPage';
import { Product } from '@/lib/rivodesk';

interface PageProps {
  params: { handle: string };
}

async function getProduct(handle: string): Promise<Product | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/products/${handle}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product) return { title: 'Product niet gevonden' };
  return {
    title: product.title,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.handle);
  if (!product) notFound();
  return <ProductDetailPage product={product} />;
}
