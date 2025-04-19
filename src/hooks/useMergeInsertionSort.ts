import { useState } from 'react';
import { Person } from '@/types/Person';

export function useMergeInsertionSort(people: Person[], setPeople: (people: Person[]) => void) {
  const [comparing, setComparing] = useState<[Person, Person] | null>(null);
  const [sorted, setSorted] = useState(false);
  const [pairs, setPairs] = useState<[Person, Person][]>([]);
  const [mainChain, setMainChain] = useState<Person[]>([]);
  const [pend, setPend] = useState<Person[]>([]);
  const [pendIndex, setPendIndex] = useState<number>(0);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<'pairing' | 'merging' | 'insertion'>('pairing');
  const [comparisonsCount, setComparisonsCount] = useState<number>(0);
  const [totalComparisons, setTotalComparisons] = useState<number>(0);

  // Start the sorting process
  const startSorting = (initialPeople: Person[]) => {
    if (initialPeople.length < 2) {
      setSorted(true);
      setProgress(100);
      return;
    }

    // Create pairs for the first phase
    const newPairs: [Person, Person][] = [];
    const newPeople = [...initialPeople];

    // If odd number of elements, set aside the last one
    const hasExtra = newPeople.length % 2 !== 0;
    const extra = hasExtra ? newPeople[newPeople.length - 1] : null;

    // Create pairs
    for (let i = 0; i < (hasExtra ? newPeople.length - 1 : newPeople.length); i += 2) {
      newPairs.push([newPeople[i], newPeople[i + 1]]);
    }

    setPairs(newPairs);
    setPhase('pairing');

    // Calculate total comparisons needed (approximate)
    // For n elements, we need approximately n*log(n) comparisons
    const n = initialPeople.length;
    const estimatedComparisons = Math.ceil(n * Math.log2(n));
    setTotalComparisons(estimatedComparisons);
    setComparisonsCount(0);

    // Start with the first pair comparison
    if (newPairs.length > 0) {
      setComparing([newPairs[0][0], newPairs[0][1]]);
      setCurrentComparisonIndex(0);
    } else {
      setSorted(true);
      setComparisonsCount(estimatedComparisons);
    }
  };

  // Handle user's comparison choice
  const compareAndContinue = (selectedPerson: Person) => {
    if (!comparing) return;

    // Update comparisons count
    setComparisonsCount(comparisonsCount + 1);

    // Handle different phases of the algorithm
    if (phase === 'pairing') {
      handlePairingPhase(selectedPerson);
    } else if (phase === 'merging') {
      handleMergingPhase(selectedPerson);
    } else if (phase === 'insertion') {
      handleInsertionPhase(selectedPerson);
    }
  };

  // Handle the pairing phase - compare within each pair
  const handlePairingPhase = (selectedPerson: Person) => {
    if (currentComparisonIndex === null || !comparing) return;

    const newPairs = [...pairs];
    const currentPair = newPairs[currentComparisonIndex];

    // Order the pair based on user selection (winner first)
    if (selectedPerson === currentPair[1]) {
      newPairs[currentComparisonIndex] = [currentPair[1], currentPair[0]];
    }

    // Move to next pair or phase
    const nextIndex = currentComparisonIndex + 1;
    if (nextIndex < newPairs.length) {
      setCurrentComparisonIndex(nextIndex);
      setComparing([newPairs[nextIndex][0], newPairs[nextIndex][1]]);
    } else {
      // All pairs compared, prepare for merging phase
      const sortedPairs = [...newPairs];
      const newMainChain: Person[] = [sortedPairs[0][0]];
      const newPend: Person[] = [];

      // Build main chain and pend list
      for (let i = 0; i < sortedPairs.length; i++) {
        if (i > 0) {
          newMainChain.push(sortedPairs[i][0]);
        }
        newPend.push(sortedPairs[i][1]);
      }

      // If we had an extra element, add it to pend
      if (people.length % 2 !== 0) {
        newPend.push(people[people.length - 1]);
      }

      setMainChain(newMainChain);
      setPend(newPend);
      setPendIndex(0);
      setPhase('insertion');

      // Start insertion phase with the first pend element
      if (newPend.length > 0) {
        prepareNextInsertion(newMainChain, newPend, 0);
      } else {
        finalizeSorting(newMainChain);
      }
    }

    setPairs(newPairs);
  };

  // Handle the merging phase (not used in this implementation but kept for potential future use)
  const handleMergingPhase = (selectedPerson: Person) => {
    // This phase is not used in the current implementation
    // Ford-Johnson algorithm goes directly from pairing to insertion
  };

  // Handle the insertion phase - binary search insertion of pend elements
  const handleInsertionPhase = (selectedPerson: Person) => {
    if (insertionIndex === null || currentComparisonIndex === null || !comparing) return;

    const newMainChain = [...mainChain];
    const currentPend = pend[pendIndex];

    // Determine where to insert based on comparison
    if (selectedPerson === comparing[0]) {
      // The main chain element is preferred, so insert after it
      setInsertionIndex(currentComparisonIndex + 1);
    } else {
      // The pend element is preferred, so insert before the current comparison
      setInsertionIndex(currentComparisonIndex);
    }

    // Continue binary search or finalize insertion
    const mid = Math.floor((insertionIndex + currentComparisonIndex) / 2);
    if (insertionIndex === currentComparisonIndex || mid === currentComparisonIndex) {
      // We've found the insertion point
      newMainChain.splice(insertionIndex, 0, currentPend);
      setMainChain(newMainChain);

      // Move to next pend element
      const nextPendIndex = pendIndex + 1;
      if (nextPendIndex < pend.length) {
        setPendIndex(nextPendIndex);
        prepareNextInsertion(newMainChain, pend, nextPendIndex);
      } else {
        // All elements inserted, sorting complete
        finalizeSorting(newMainChain);
      }
    } else {
      // Continue binary search
      setComparing([newMainChain[mid], currentPend]);
      if (selectedPerson === comparing[0]) {
        setCurrentComparisonIndex(mid);
      } else {
        setInsertionIndex(mid);
      }
    }
  };

  // Prepare for inserting the next pend element
  const prepareNextInsertion = (chain: Person[], pendList: Person[], index: number) => {
    if (index >= pendList.length) {
      finalizeSorting(chain);
      return;
    }

    const elementToInsert = pendList[index];

    // For the first element, compare with the first element in the chain
    if (chain.length === 1) {
      setComparing([chain[0], elementToInsert]);
      setCurrentComparisonIndex(0);
      setInsertionIndex(1);
      return;
    }

    // Start binary search for insertion point
    const low = 0;
    const high = chain.length - 1;
    const mid = Math.floor((low + high) / 2);

    setComparing([chain[mid], elementToInsert]);
    setCurrentComparisonIndex(mid);
    setInsertionIndex(high + 1);
  };

  // Finalize the sorting process
  const finalizeSorting = (sortedList: Person[]) => {
    setPeople(sortedList);
    setComparing(null);
    setSorted(true);
    setComparisonsCount(totalComparisons);
  };

  const resetSort = () => {
    setComparing(null);
    setSorted(false);
    setPairs([]);
    setMainChain([]);
    setPend([]);
    setPendIndex(0);
    setInsertionIndex(null);
    setCurrentComparisonIndex(null);
    setPhase('pairing');
    setComparisonsCount(0);
    setTotalComparisons(0);
  };

  return {
    comparing,
    sorted,
    startSorting,
    compareAndContinue,
    resetSort,
    comparisonsCount,
    totalComparisons
  };
}
