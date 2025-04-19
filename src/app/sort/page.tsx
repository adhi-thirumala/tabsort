'use client';

import { useState, useCallback, useEffect } from 'react';
import { Person } from '@/types/Person';
import { useMergeInsertionSort } from '@/hooks/useMergeInsertionSort';
import { FileUploader } from '@/components/FileUploader';
import { ComparisonView } from '@/components/ComparisonView';
import { SortedView } from '@/components/SortedView';
import { ConflictSelector } from '@/components/ConflictSelector';
import { downloadCSV } from '@/utils/csvHelpers';

export default function SortPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [uploadedPeople, setUploadedPeople] = useState<Person[]>([]);
  const [showConflictSelector, setShowConflictSelector] = useState(false);
  const { comparing, sorted, startSorting, compareAndContinue, resetSort, comparisonsCount, totalComparisons } = useMergeInsertionSort(people, setPeople);

  // Listen for reset events from the Navbar
  useEffect(() => {
    const handleReset = () => {
      setPeople([]);
      setUploadedPeople([]);
      setShowConflictSelector(false);
      resetSort();
    };

    window.addEventListener('tabsort-reset', handleReset);
    return () => window.removeEventListener('tabsort-reset', handleReset);
  }, [resetSort]);

  // Update localStorage when people data changes
  useEffect(() => {
    if (people.length > 0 || uploadedPeople.length > 0) {
      localStorage.setItem('tabsort-has-data', 'true');
    } else {
      localStorage.setItem('tabsort-has-data', 'false');
    }
  }, [people.length, uploadedPeople.length]);

  const handleFileUpload = (parsedPeople: Person[]) => {
    setUploadedPeople(parsedPeople);
    setShowConflictSelector(true);
    localStorage.setItem('tabsort-has-data', 'true');
  };

  const handleConflictSelectionComplete = (filteredPeople: Person[]) => {
    setPeople(filteredPeople);
    setShowConflictSelector(false);
    startSorting(filteredPeople);
  };

  const handleBackToUpload = () => {
    setUploadedPeople([]);
    setShowConflictSelector(false);
  };

  return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center overflow-y-auto pt-6 pb-12">
        {!people.length && !showConflictSelector && (
          <div className="w-full mx-auto flex-1 flex items-center justify-center min-h-[80vh]">
            <FileUploader onUpload={handleFileUpload} />
          </div>
        )}

        {showConflictSelector && (
          <div className="w-full mx-auto flex-1 flex items-center justify-center min-h-[80vh]">
            <ConflictSelector
              people={uploadedPeople}
              onContinue={handleConflictSelectionComplete}
              onBack={handleBackToUpload}
            />
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
      </div>
  );
}
