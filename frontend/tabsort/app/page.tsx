'use client';

import { useState, useCallback } from 'react';
import { Person } from '@/types/Person';
import { useMergeInsertionSort } from '@/hooks/useMergeInsertionSort';
import { FileUploader } from '@/components/FileUploader';
import { ComparisonView } from '@/components/ComparisonView';
import { SortedView } from '@/components/SortedView';
import { downloadCSV } from '@/utils/csvHelpers';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const { comparing, sorted, startSorting, compareAndContinue, resetSort, comparisonsCount, totalComparisons } = useMergeInsertionSort(people, setPeople);

  const handleFileUpload = (parsedPeople: Person[]) => {
    setPeople(parsedPeople);
    startSorting(parsedPeople);
  };

  const handleReset = useCallback(() => {
    setPeople([]);
    resetSort();
  }, [resetSort]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onReset={handleReset}
        showResetWarning={people.length > 0 && (!!comparing || sorted)}
      />

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
    </div>
  );
}
