import type { Metadata } from 'next';
import { OrderLookupPage } from '@/theme/templates/OrderLookupPage';

export const metadata: Metadata = {
  title: 'Bestelling volgen',
};

export default function OrdersPage() {
  return <OrderLookupPage />;
}
