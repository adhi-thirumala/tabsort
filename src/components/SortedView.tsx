import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Person } from '@/types/Person';

// Helper function to determine text size class based on content length
const getTextSizeClass = (person: Person): string => {
  const totalLength = person.name.length + person.institution.length + person.state.length;

  if (totalLength > 80) return 'text-very-long';
  if (totalLength > 60) return 'text-long';
  if (person.name.length > 20 || person.institution.length > 25) return 'text-medium-long';
  return '';
};

interface SortedViewProps {
  people: Person[];
  onDownload: (people: Person[], sortType: 'ranked' | 'alphabetical') => void;
  totalComparisons: number;
}

export function SortedView({ people, onDownload, totalComparisons }: SortedViewProps) {
  const [showAlphabetical, setShowAlphabetical] = useState(false);

  // Sort people based on the toggle state
  const displayPeople = [...people];
  if (showAlphabetical) {
    displayPeople.sort((a, b) => a.name.localeCompare(b.name));
  }
  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <div className="w-full mb-6">
        <Progress value={100} className="h-2" />
      </div>
      <div className="flex flex-col items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-center">Final Ranking</h2>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${!showAlphabetical ? 'text-primary' : 'text-muted-foreground'}`}>Ranked</span>
          <Switch
            checked={showAlphabetical}
            onCheckedChange={setShowAlphabetical}
          />
          <span className={`text-sm font-medium ${showAlphabetical ? 'text-primary' : 'text-muted-foreground'}`}>Alphabetical</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 place-items-stretch">
        {displayPeople.map((person, index) => (
          <Card key={index} className={`p-5 text-center flex flex-col items-center justify-center w-full ${showAlphabetical ? 'h-36' : 'h-32'} group ${getTextSizeClass(person)}`}>
            <p className="font-bold text-lg mb-1 w-full break-words overflow-hidden group-[.text-medium-long]:text-base group-[.text-long]:text-sm group-[.text-very-long]:text-xs">
              {showAlphabetical ? (
                person.name
              ) : (
                <>{index + 1}. {person.name}</>
              )}
            </p>
            <p className="text-muted-foreground text-sm w-full break-words overflow-hidden group-[.text-medium-long]:text-xs group-[.text-long]:text-xs group-[.text-very-long]:text-xs">
              {person.institution} - {person.state}
            </p>
            {showAlphabetical && (
              <div className="bg-primary/10 text-primary text-sm font-medium mt-1 px-3 py-1 rounded-full">
                Rank: {people.indexOf(person) + 1}
              </div>
            )}
          </Card>
        ))}
      </div>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => onDownload(people, 'ranked')}>
          Download Ranked CSV
        </Button>
        <Button onClick={() => onDownload(people, 'alphabetical')}>
          Download Alphabetical CSV
        </Button>
      </div>
    </div>
  );
}
