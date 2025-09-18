import { useState } from 'react';
import { Character, CharacterDisadvantage, PredefinedDisadvantage } from '@/types/character';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DisadvantagesSectionProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  predefinedOptions: PredefinedDisadvantage[];
}

export const DisadvantagesSection = ({ character, updateCharacter, predefinedOptions }: DisadvantagesSectionProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [newDisadvantage, setNewDisadvantage] = useState<Partial<CharacterDisadvantage>>({
    name: '',
    cost: 0,
    description: '',
    notes: ''
  });

  const addDisadvantage = () => {
    if (!newDisadvantage.name || !newDisadvantage.cost) return;
    
    const disadvantage: CharacterDisadvantage = {
      id: crypto.randomUUID(),
      name: newDisadvantage.name,
      cost: newDisadvantage.cost,
      description: newDisadvantage.description || '',
      notes: newDisadvantage.notes || ''
    };

    updateCharacter({
      disadvantages: [...character.disadvantages, disadvantage]
    });

    setNewDisadvantage({ name: '', cost: 0, description: '', notes: '' });
    setIsAddDialogOpen(false);
  };

  const removeDisadvantage = (id: string) => {
    updateCharacter({
      disadvantages: character.disadvantages.filter(dis => dis.id !== id)
    });
  };

  const updateDisadvantage = (id: string, updates: Partial<CharacterDisadvantage>) => {
    updateCharacter({
      disadvantages: character.disadvantages.map(dis => 
        dis.id === id ? { ...dis, ...updates } : dis
      )
    });
  };

  const selectPredefinedDisadvantage = (predefined: PredefinedDisadvantage) => {
    setNewDisadvantage({
      name: predefined.name,
      cost: predefined.cost,
      description: predefined.description,
      notes: ''
    });
  };

  const totalCost = character.disadvantages.reduce((sum, dis) => sum + dis.cost, 0);

  const toggleAllExpanded = () => {
    const newState = !allExpanded;
    setAllExpanded(newState);
    const newExpandedItems: Record<string, boolean> = {};
    character.disadvantages.forEach(dis => {
      newExpandedItems[dis.id] = newState;
    });
    setExpandedItems(newExpandedItems);
  };

  const toggleItemExpanded = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card className="gradient-card shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-accent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Disadvantages & Quirks
          </div>
          <div className="flex items-center gap-2">
            {character.disadvantages.length > 0 && (
              <Button
                onClick={toggleAllExpanded}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                {allExpanded ? (
                  <>
                    <ChevronUp size={14} className="mr-1" />
                    Collapse All
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} className="mr-1" />
                    Expand All
                  </>
                )}
              </Button>
            )}
            <div className="text-sm font-normal">
              Total: <span className="text-destructive font-bold">{totalCost}</span> pts
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {character.disadvantages.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No disadvantages added yet. Consider adding some for extra points!
          </p>
        )}

        {character.disadvantages.map((disadvantage) => (
          <Collapsible key={disadvantage.id} open={expandedItems[disadvantage.id] || false} onOpenChange={() => toggleItemExpanded(disadvantage.id)}>
            <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={disadvantage.name}
                    onChange={(e) => updateDisadvantage(disadvantage.id, { name: e.target.value })}
                    placeholder="Disadvantage name"
                    className="font-medium"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={disadvantage.cost}
                      onChange={(e) => updateDisadvantage(disadvantage.id, { cost: parseInt(e.target.value) || 0 })}
                      placeholder="Cost (negative)"
                    />
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {expandedItems[disadvantage.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </Button>
                    </CollapsibleTrigger>
                    <Button
                      onClick={() => removeDisadvantage(disadvantage.id)}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-right mb-2">
                <span className="text-sm text-destructive font-medium">
                  Cost: {disadvantage.cost} pts
                </span>
              </div>

              <CollapsibleContent>
                <div className="space-y-2">
                  {disadvantage.description && (
                    <p className="text-sm text-muted-foreground">{disadvantage.description}</p>
                  )}
                  
                  <Textarea
                    value={disadvantage.notes || ''}
                    onChange={(e) => updateDisadvantage(disadvantage.id, { notes: e.target.value })}
                    placeholder="Personal notes..."
                    className="resize-none text-sm"
                    rows={2}
                  />
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gradient-primary hover:shadow-accent transition-smooth">
              <Plus size={16} className="mr-2" />
              Add Disadvantage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Disadvantage</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {predefinedOptions.length > 0 && (
                <div>
                  <Label>Quick Select (Optional)</Label>
                  <Select onValueChange={(value) => {
                    const predefined = predefinedOptions.find(p => p.name === value);
                    if (predefined) selectPredefinedDisadvantage(predefined);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose from predefined disadvantages..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {predefinedOptions.map((predefined) => (
                        <SelectItem key={predefined.name} value={predefined.name}>
                          <div className="flex justify-between items-center w-full">
                            <span>{predefined.name}</span>
                            <span className="text-destructive ml-2">{predefined.cost} pts</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newDisadvantage.name || ''}
                    onChange={(e) => setNewDisadvantage(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Disadvantage name"
                  />
                </div>
                <div>
                  <Label>Cost (Negative Points)</Label>
                  <Input
                    type="number"
                    value={newDisadvantage.cost || 0}
                    onChange={(e) => setNewDisadvantage(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g. -15"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newDisadvantage.description || ''}
                  onChange={(e) => setNewDisadvantage(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description of the disadvantage..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Personal Notes</Label>
                <Textarea
                  value={newDisadvantage.notes || ''}
                  onChange={(e) => setNewDisadvantage(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Your notes about this disadvantage..."
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={addDisadvantage}
                  disabled={!newDisadvantage.name || !newDisadvantage.cost}
                  className="flex-1 gradient-primary"
                >
                  Add Disadvantage
                </Button>
                <Button
                  onClick={() => setIsAddDialogOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};