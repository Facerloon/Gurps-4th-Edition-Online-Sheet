import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Character } from '@/types/character';

interface EquipmentSimpleSectionProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
}

export const EquipmentSimpleSection = ({ character, updateCharacter }: EquipmentSimpleSectionProps) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      updateCharacter({
        equipmentSimple: [...character.equipmentSimple, newItem.trim()]
      });
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    const updated = character.equipmentSimple.filter((_, i) => i !== index);
    updateCharacter({ equipmentSimple: updated });
  };

  const updateItem = (index: number, value: string) => {
    const updated = [...character.equipmentSimple];
    updated[index] = value;
    updateCharacter({ equipmentSimple: updated });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-gradient">Equipment List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new item */}
          <div className="flex gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add equipment item..."
              className="flex-1"
            />
            <Button onClick={addItem} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Equipment list */}
          <div className="space-y-2">
            {character.equipmentSimple.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No equipment added yet. Start adding items above.
              </p>
            ) : (
              character.equipmentSimple.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    className="flex-1"
                    placeholder="Equipment item..."
                  />
                  <Button
                    onClick={() => removeItem(index)}
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};