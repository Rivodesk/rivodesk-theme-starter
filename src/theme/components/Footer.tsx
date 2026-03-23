import Link from 'next/link';

interface FooterProps {
  shopName: string;
}

export function Footer({ shopName }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-20 border-t"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-12"
        style={{ maxWidth: 'var(--container-max)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p
              className="font-bold text-lg mb-2"
              style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
            >
              {shopName}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Powered by{' '}
              <a
                href="https://rivodesk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-accent)' }}
              >
                Rivodesk
              </a>
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Navigatie
            </p>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Producten' },
                { href: '/orders', label: 'Bestellingen' },
                { href: '/checkout', label: 'Afrekenen' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Informatie
            </p>
            <ul className="space-y-2">
              {[
                { href: '/privacy', label: 'Privacybeleid' },
                { href: '/terms', label: 'Algemene voorwaarden' },
                { href: '/returns', label: 'Retourneren' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 border-t text-center text-xs"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          © {year} {shopName}. Alle rechten voorbehouden.
        </div>
      </div>
    </footer>
  );
}
