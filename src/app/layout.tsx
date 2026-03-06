import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { NavigationTracker } from '@/components/NavigationTracker';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'My Store',
    template: '%s | My Store',
  },
  description: 'Welcome to our store.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={inter.variable}>
      <body>
        <NavigationTracker />
        <Header />
        <main>{children}</main>
        <footer className="border-t border-gray-100 mt-20">
          <div className="container-main py-10 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} My Store. Powered by{' '}
            <a
              href="https://rivodesk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600"
            >
              Rivodesk
            </a>
            .
          </div>
        </footer>
      </body>
    </html>
  );
}
