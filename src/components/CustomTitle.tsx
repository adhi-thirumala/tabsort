'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Map of paths to their corresponding titles
const TITLE_MAP: Record<string, string> = {
  '/': 'TabSort',
  '/about': 'About - TabSort',
  '/guide': 'Documentation - TabSort',
  '/sort': 'Sort Judges - TabSort',
};

export function CustomTitle() {
  const pathname = usePathname();

  useEffect(() => {
    // Use the title from the map or fall back to 'TabSort'
    document.title = pathname && TITLE_MAP[pathname] ? TITLE_MAP[pathname] : 'TabSort';
  }, [pathname]);

  // This component doesn't render anything
  return null;
}