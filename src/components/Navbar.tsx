'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isSortingPage, setIsSortingPage] = useState(false);
  const [hasSortData, setHasSortData] = useState(false);

  // Check if we're on the sorting page and if there's data
  useEffect(() => {
    setIsSortingPage(pathname === '/sort');

    // We'll use localStorage to track if there's sort data
    const hasData = localStorage.getItem('tabsort-has-data') === 'true';
    setHasSortData(hasData);

    // Listen for storage events to update our state
    const handleStorageChange = () => {
      const hasData = localStorage.getItem('tabsort-has-data') === 'true';
      setHasSortData(hasData);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pathname]);

  const handleResetClick = () => {
    if (isSortingPage && hasSortData) {
      setIsResetDialogOpen(true);
    } else {
      router.push('/sort');
    }
  };

  return (
    <nav className="w-full border-b py-4 px-6 flex justify-between items-center bg-background sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1
            className="text-3xl font-extrabold tracking-tight tabsort-gradient cursor-pointer hover:scale-105 transition-transform"
          >
            TabSort
          </h1>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">
            About
          </Link>
          <button
            onClick={handleResetClick}
            className="text-foreground hover:text-primary transition-colors font-medium bg-transparent border-none p-0 cursor-pointer"
          >
            Sort
          </button>

          <Link href="/guide" className="text-foreground hover:text-primary transition-colors font-medium">
            Docs
          </Link>
        </div>
      </div>

      <div className="flex items-center">
        <ThemeToggle />
      </div>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset current sorting?</AlertDialogTitle>
            <AlertDialogDescription>
              This will erase all current progress and return to the file upload screen. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              // Clear the sort data flag
              localStorage.setItem('tabsort-has-data', 'false');
              // Trigger a custom event to notify other components
              window.dispatchEvent(new Event('tabsort-reset'));
              // Refresh the page to reset the state
              router.refresh();
              setIsResetDialogOpen(false);
            }}>
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}
