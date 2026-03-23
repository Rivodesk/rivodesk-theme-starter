import type { Metadata } from 'next';
import { CheckoutPage } from '@/theme/templates/CheckoutPage';

export const metadata: Metadata = {
  title: 'Afrekenen',
};

export default function CheckoutPageRoute() {
  return <CheckoutPage />;
}
