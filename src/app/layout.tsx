import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/theme/styles/theme.css';
import { CartProvider } from '@/theme/components/CartContext';
import { CartDrawer } from '@/theme/components/CartDrawer';
import { Header } from '@/theme/components/Header';
import { Footer } from '@/theme/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'Mijn Winkel',
    template: '%s | Mijn Winkel',
  },
  description: 'Welkom in onze winkel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={inter.variable}>
      <body>
        <CartProvider>
          <Header shopName="Mijn Winkel" />
          <CartDrawer />
          <main>{children}</main>
          <Footer shopName="Mijn Winkel" />
        </CartProvider>
      </body>
    </html>
  );
}
