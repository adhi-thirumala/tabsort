import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Person } from '@/types/Person';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onUpload: (people: Person[]) => void;
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setFileName(file.name);
    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim() !== '');

        if (rows.length < 2) {
          setError('CSV file appears to be empty or invalid');
          return;
        }

        const headers = rows[0].split(',');
        const requiredHeaders = ['First', 'Last', 'Location', 'Institution'];

        // Check if all required headers exist
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          setError(`Missing required headers: ${missingHeaders.join(', ')}`);
          return;
        }

        const parsedPeople = rows.slice(1)
          .filter(row => row.trim() !== '')
          .map(row => {
            const values = row.split(',');
            return {
              name: `${values[headers.indexOf('First')].trim()} ${values[headers.indexOf('Last')].trim()}`,
              state: values[headers.indexOf('Location')].trim(),
              institution: values[headers.indexOf('Institution')].trim(),
            };
          });

        if (parsedPeople.length === 0) {
          setError('No valid entries found in the CSV file');
          return;
        }

        onUpload(parsedPeople);
      } catch (err) {
        setError('Error processing CSV file. Please check the format.');
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading the file');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  }, [onUpload]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Add effect to handle page-level drag and drop
  useEffect(() => {
    const handlePageDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handlePageDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) {
        setIsDragging(true);
      }
    };

    const handlePageDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Only set isDragging to false if we're leaving the window
      if (e.relatedTarget === null) {
        setIsDragging(false);
      }
    };

    const handlePageDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    };

    // Add event listeners to the document
    document.addEventListener('dragenter', handlePageDragEnter);
    document.addEventListener('dragover', handlePageDragOver);
    document.addEventListener('dragleave', handlePageDragLeave);
    document.addEventListener('drop', handlePageDrop);

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('dragenter', handlePageDragEnter);
      document.removeEventListener('dragover', handlePageDragOver);
      document.removeEventListener('dragleave', handlePageDragLeave);
      document.removeEventListener('drop', handlePageDrop);
    };
  }, [isDragging, processFile]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Don't set isDragging to false here since we're handling it at the document level
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Full-page drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-primary/10 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-background border-2 border-dashed border-primary rounded-lg p-12 shadow-xl max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Drop CSV File Here</h3>
            <p className="text-muted-foreground">Release to upload your file</p>
          </div>
        </div>
      )}

      <Card className="p-8 w-full max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Upload Participants</h2>
        <p className="text-muted-foreground mb-6 text-center text-lg">Upload a CSV file with participant information to begin sorting</p>

        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-16 min-h-[400px] transition-all duration-200 flex flex-col items-center justify-center cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50",
            error ? "border-destructive bg-destructive/5" : ""
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            {isProcessing ? (
              <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>

          {fileName ? (
            <div>
              <p className="font-medium text-xl">Selected file:</p>
              <p className="text-primary font-semibold text-xl">{fileName}</p>
              {isProcessing && <p className="text-base text-muted-foreground mt-2">Processing file...</p>}
            </div>
          ) : (
            <div>
              <p className="font-medium text-xl">Drag and drop your CSV file here</p>
              <p className="text-base text-muted-foreground mt-2">or click to browse files</p>
            </div>
          )}

          {error && (
            <p className="text-destructive mt-2 text-lg">{error}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm text-muted-foreground text-center">CSV should include <span className="font-semibold">First</span>, <span className="font-semibold">Last</span>, <span className="font-semibold">Location</span>, and <span className="font-semibold">Institution</span> columns</p>
      </div>
    </Card>
    </>
  );
}
