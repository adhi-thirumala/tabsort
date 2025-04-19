import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavbarProps {
  onReset: () => void;
  showResetWarning: boolean;
}

export function Navbar({ onReset, showResetWarning }: NavbarProps) {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleResetClick = () => {
    if (showResetWarning) {
      setIsResetDialogOpen(true);
    } else {
      onReset();
    }
  };

  return (
    <nav className="w-full border-b py-4 px-6 flex justify-between items-center bg-background sticky top-0 z-50 shadow-sm">
      <div className="flex items-center">
        <h1
          className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-fuchsia-600 animate-gradient-x bg-200% cursor-pointer hover:scale-105 transition-transform"
          onClick={handleResetClick}
        >
          TabSort
        </h1>
      </div>

      <div className="flex items-center gap-4">
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
              onReset();
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
