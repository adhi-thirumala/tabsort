import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Person } from '@/types/Person';

// Helper function to determine text size class based on content length
const getTextSizeClass = (person: Person): string => {
  const totalLength = person.name.length + person.institution.length + person.state.length;

  if (totalLength > 80) return 'text-very-long';
  if (totalLength > 60) return 'text-long';
  if (person.name.length > 20 || person.institution.length > 25) return 'text-medium-long';
  return '';
};

interface ComparisonViewProps {
  comparing: [Person, Person];
  onCompare: (person: Person) => void;
  comparisonsCount: number;
  totalComparisons: number;
}

export function ComparisonView({ comparing, onCompare, comparisonsCount, totalComparisons }: ComparisonViewProps) {
  return (
    <div className="flex flex-col gap-6 mt-8 max-w-3xl mx-auto w-full">
      <div className="w-full">
        <Progress value={Math.min(Math.round((comparisonsCount / totalComparisons) * 100), 99)} className="h-2" />
      </div>
      <div className="grid grid-cols-2 gap-8 place-items-center w-full">
      {comparing.map((person, index) => (
        <Card
          key={index}
          className={`p-6 cursor-pointer hover:bg-accent w-64 h-64 flex flex-col items-center justify-center text-center transition-colors group ${getTextSizeClass(person)}`}
          onClick={() => onCompare(person)}
        >
          <h3 className="text-xl font-bold mb-2 w-full break-words overflow-hidden group-[.text-medium-long]:text-lg group-[.text-long]:text-base group-[.text-very-long]:text-sm">{person.name}</h3>
          <p className="text-muted-foreground w-full break-words overflow-hidden group-[.text-medium-long]:text-sm group-[.text-long]:text-xs group-[.text-very-long]:text-xs">{person.institution}</p>
          <p className="text-muted-foreground/70 w-full break-words overflow-hidden group-[.text-medium-long]:text-xs group-[.text-long]:text-xs group-[.text-very-long]:text-xs">{person.state}</p>
        </Card>
      ))}
      </div>
    </div>
  );
}
