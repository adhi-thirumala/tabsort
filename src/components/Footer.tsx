'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t py-4 px-6 bg-background mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="mb-2 md:mb-0">
          <span>Copyright © 2025 Adhitya Thirumala</span>
        </div>
        <div className="text-center md:text-right max-w-md md:max-w-none">
          <span>This product is not endorsed by the National Speech and Debate Organization or Tabroom in any manner</span>
        </div>
      </div>
    </footer>
  );
}
