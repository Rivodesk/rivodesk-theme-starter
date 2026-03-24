export const dynamic = 'force-dynamic';
import { HomePage } from '@/theme/templates/HomePage';

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

export default async function Page() {
  const products = await getProducts();
  return <HomePage products={products} shopName="Mijn Winkel" />;
}
