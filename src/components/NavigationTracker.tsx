'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function NavigationTracker() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      window.parent.postMessage({ type: 'rivodesk-route', pathname }, '*');
    } catch {}
  }, [pathname]);
  return null;
}
