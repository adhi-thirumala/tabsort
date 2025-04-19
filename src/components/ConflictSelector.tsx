import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Person } from '@/types/Person';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConflictSelectorProps {
  people: Person[];
  onContinue: (people: Person[]) => void;
  onBack: () => void;
}

export function ConflictSelector({ people, onContinue, onBack }: ConflictSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [conflictedPeople, setConflictedPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter people based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPeople([]);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = people
      .filter(person => 
        !conflictedPeople.includes(person) && 
        (person.name.toLowerCase().includes(lowerSearchTerm) || 
         person.institution.toLowerCase().includes(lowerSearchTerm))
      )
      .slice(0, 5); // Limit to 5 results for better UX
    
    setFilteredPeople(filtered);
  }, [searchTerm, people, conflictedPeople]);

  // Mark a person as conflicted
  const addConflict = (person: Person) => {
    setConflictedPeople([...conflictedPeople, person]);
    setSearchTerm('');
    inputRef.current?.focus();
  };

  // Remove a person from conflicts
  const removeConflict = (person: Person) => {
    setConflictedPeople(conflictedPeople.filter(p => p !== person));
  };

  // Continue to sorting with updated people list
  const handleContinue = () => {
    const updatedPeople = people.map(person => ({
      ...person,
      conflicted: conflictedPeople.includes(person)
    }));
    
    // Filter out conflicted judges
    const nonConflictedPeople = updatedPeople.filter(person => !person.conflicted);
    
    onContinue(nonConflictedPeople);
  };

  return (
    <Card className="p-8 w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Mark Conflicted Judges</h2>
      <p className="text-muted-foreground mb-6 text-center text-lg">
        Search and select any judges you have conflicts with. They will be removed from your sorting list.
      </p>

      <div className="mb-8">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for judges by name or institution..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          {filteredPeople.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg">
              {filteredPeople.map((person, index) => (
                <div 
                  key={index}
                  className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                  onClick={() => addConflict(person)}
                >
                  <div className="font-medium">{person.name}</div>
                  <div className="text-sm text-muted-foreground">{person.institution} - {person.state}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Conflicted Judges:</h3>
        {conflictedPeople.length === 0 ? (
          <p className="text-muted-foreground">No conflicts marked yet. Search for judges above to mark conflicts.</p>
        ) : (
          <ScrollArea className="h-[200px] border rounded-md p-4">
            <div className="flex flex-wrap gap-2">
              {conflictedPeople.map((person, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="py-2 px-3 cursor-pointer hover:bg-destructive/10"
                  onClick={() => removeConflict(person)}
                >
                  {person.name} <span className="ml-1 text-xs">×</span>
                </Badge>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Upload
        </Button>
        <Button onClick={handleContinue}>
          Continue to Sorting
        </Button>
      </div>
    </Card>
  );
}
