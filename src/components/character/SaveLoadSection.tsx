import { useState, useRef } from 'react';
import { Character } from '@/types/character';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, FileText, FileJson } from 'lucide-react';
import {
  saveCharacterAsJSON,
  saveCharacterAsCSV,
  loadCharacterFromJSON,
  loadCharacterFromCSV,
} from '@/utils/fileOperations';

interface SaveLoadSectionProps {
  character: Character;
  onLoadCharacter: (character: Character) => void;
}

export const SaveLoadSection = ({ character, onLoadCharacter }: SaveLoadSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSaveJSON = () => {
    try {
      saveCharacterAsJSON(character);
      toast({
        title: "Character Saved",
        description: "Character exported as JSON successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save character as JSON.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCSV = () => {
    try {
      saveCharacterAsCSV(character);
      toast({
        title: "Character Saved",
        description: "Character exported as CSV successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save character as CSV.",
        variant: "destructive",
      });
    }
  };

  const handleFileLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      let loadedCharacter: Character;
      
      if (file.name.endsWith('.json')) {
        loadedCharacter = await loadCharacterFromJSON(file);
      } else if (file.name.endsWith('.csv')) {
        loadedCharacter = await loadCharacterFromCSV(file);
      } else {
        throw new Error('Unsupported file format. Please use .json or .csv files.');
      }

      onLoadCharacter(loadedCharacter);
      toast({
        title: "Character Loaded",
        description: `Character "${loadedCharacter.name || 'Unnamed'}" loaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: error instanceof Error ? error.message : "Failed to load character.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <FileText className="h-5 w-5" />
          Save / Load Character
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Save Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSaveJSON}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FileJson className="h-4 w-4" />
              JSON
            </Button>
            <Button
              onClick={handleSaveCSV}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
          </div>

          {/* Load Button */}
          <Button
            onClick={triggerFileInput}
            variant="secondary"
            size="sm"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isLoading ? 'Loading...' : 'Load'}
          </Button>

          {/* Hidden File Input */}
          <Input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleFileLoad}
            className="hidden"
          />
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Supports JSON and CSV formats. Loading will replace current character.
        </p>
      </CardContent>
    </Card>
  );
};