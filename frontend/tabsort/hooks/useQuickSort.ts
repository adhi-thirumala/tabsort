import { useState } from 'react';
import { Person } from '@/types/Person';

export function useQuickSort(people: Person[], setPeople: (people: Person[]) => void) {
  const [comparing, setComparing] = useState<[Person, Person] | null>(null);
  const [sorted, setSorted] = useState(false);
  const [stack, setStack] = useState<[number, number][]>([]);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  const [leftIndex, setLeftIndex] = useState<number | null>(null);

  const startSorting = (initialPeople: Person[]) => {
    if (initialPeople.length < 2) {
      setSorted(true);
      return;
    }
    
    const newStack: [number, number][] = [[0, initialPeople.length - 1]];
    setStack(newStack);
    processNextPartition(newStack, initialPeople);
  };

  const processNextPartition = (currentStack: [number, number][], currentPeople: Person[]) => {
    if (currentStack.length === 0) {
      setComparing(null);
      setSorted(true);
      return;
    }

    const [low, high] = currentStack[currentStack.length - 1];
    
    if (low >= high) {
      const newStack = [...currentStack];
      newStack.pop();
      setStack(newStack);
      processNextPartition(newStack, currentPeople);
      return;
    }

    setPivotIndex(high);
    setLeftIndex(low);
    setComparing([currentPeople[low], currentPeople[high]]);
  };

  const compareAndContinue = (selectedPerson: Person) => {
    if (!comparing || pivotIndex === null || leftIndex === null || stack.length === 0) return;
    
    const newPeople = [...people];
    const [low, high] = stack[stack.length - 1];
    const currentLeft = leftIndex;
    
    if (selectedPerson === comparing[0]) {
      [newPeople[currentLeft], newPeople[leftIndex]] = 
      [newPeople[leftIndex], newPeople[currentLeft]];
      setLeftIndex(leftIndex + 1);
    }

    const nextLeft = leftIndex + 1;
    if (nextLeft < pivotIndex) {
      setLeftIndex(nextLeft);
      setComparing([newPeople[nextLeft], newPeople[pivotIndex]]);
    } else {
      const pivotFinalPosition = leftIndex;
      [newPeople[pivotFinalPosition], newPeople[pivotIndex]] =
      [newPeople[pivotIndex], newPeople[pivotFinalPosition]];

      const newStack = [...stack];
      newStack.pop();

      if (pivotFinalPosition - 1 > low) {
        newStack.push([low, pivotFinalPosition - 1]);
      }
      if (pivotFinalPosition + 1 < high) {
        newStack.push([pivotFinalPosition + 1, high]);
      }

      setStack(newStack);
      setPeople(newPeople);
      processNextPartition(newStack, newPeople);
      return;
    }

    setPeople(newPeople);
  };

  return {
    comparing,
    sorted,
    startSorting,
    compareAndContinue
  };
}
