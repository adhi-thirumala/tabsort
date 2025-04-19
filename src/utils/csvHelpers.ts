import { Person } from '@/types/Person';

export function downloadCSV(people: Person[], sortType: 'ranked' | 'alphabetical') {
  // Create a map of original ranks before sorting
  const rankMap = new Map<Person, number>();
  people.forEach((person, index) => {
    rankMap.set(person, index + 1);
  });

  const sortedPeople = [...people];
  if (sortType === 'alphabetical') {
    sortedPeople.sort((a, b) => a.name.localeCompare(b.name));
  }

  const headers = sortType === 'ranked'
    ? ['Rank', 'Name', 'State', 'Institution']
    : ['Name', 'State', 'Institution', 'Rank'];

  const csv = [
    headers,
    ...sortedPeople.map((person, index) => {
      const rank = rankMap.get(person) || index + 1;
      return sortType === 'ranked'
        ? [String(index + 1), person.name, person.state, person.institution]
        : [person.name, person.state, person.institution, String(rank)];
    })
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tabsort_${sortType}.csv`;
  a.click();
}
