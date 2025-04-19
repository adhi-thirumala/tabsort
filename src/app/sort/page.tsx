'use client';

import { useState, useCallback, useEffect } from 'react';
import { Person } from '@/types/Person';
import { useMergeInsertionSort } from '@/hooks/useMergeInsertionSort';
import { FileUploader } from '@/components/FileUploader';
import { ComparisonView } from '@/components/ComparisonView';
import { SortedView } from '@/components/SortedView';
import { downloadCSV } from '@/utils/csvHelpers';

export default function SortPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const { comparing, sorted, startSorting, compareAndContinue, resetSort, comparisonsCount, totalComparisons } = useMergeInsertionSort(people, setPeople);

  // Listen for reset events from the Navbar
  useEffect(() => {
    const handleReset = () => {
      setPeople([]);
      resetSort();
    };

    window.addEventListener('tabsort-reset', handleReset);
    return () => window.removeEventListener('tabsort-reset', handleReset);
  }, [resetSort]);

  // Update localStorage when people data changes
  useEffect(() => {
    if (people.length > 0) {
      localStorage.setItem('tabsort-has-data', 'true');
    } else {
      localStorage.setItem('tabsort-has-data', 'false');
    }
  }, [people.length]);

  const handleFileUpload = (parsedPeople: Person[]) => {
    setPeople(parsedPeople);
    startSorting(parsedPeople);
    localStorage.setItem('tabsort-has-data', 'true');
  };

  return (
      <main className="container mx-auto p-4 flex flex-col items-center justify-center flex-1 overflow-y-auto pt-6">
        {!people.length && (
          <div className="w-full mx-auto flex-1 flex items-center justify-center min-h-[80vh]">
            <FileUploader onUpload={handleFileUpload} />
          </div>
        )}

        {comparing && (
          <ComparisonView
            comparing={comparing}
            onCompare={compareAndContinue}
            comparisonsCount={comparisonsCount}
            totalComparisons={totalComparisons}
          />
        )}

        {sorted && (
          <SortedView
            people={people}
            onDownload={downloadCSV}
            totalComparisons={totalComparisons}
          />
        )}
      </main>
  );
}
