import { useState } from 'react';
import { Character, CharacterSkill, PredefinedSkill } from '@/types/character';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { calculateSkillLevel } from '@/utils/gurpsCalculations';

interface SkillsSectionProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  predefinedOptions: PredefinedSkill[];
}

export const SkillsSection = ({ character, updateCharacter, predefinedOptions }: SkillsSectionProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState<Partial<CharacterSkill>>({
    name: '',
    attribute: 'DX',
    difficulty: 'A',
    points: 1,
    level: 10,
    relativeLevel: '',
    description: '',
    notes: ''
  });

  const addSkill = () => {
    if (!newSkill.name || !newSkill.attribute || !newSkill.difficulty) return;
    
    const skill: CharacterSkill = {
      id: crypto.randomUUID(),
      name: newSkill.name,
      attribute: newSkill.attribute as any,
      difficulty: newSkill.difficulty as any,
      points: newSkill.points || 1,
      level: 10,
      relativeLevel: '',
      description: newSkill.description || '',
      notes: newSkill.notes || ''
    };

    // Calculate initial level
    const calculated = calculateSkillLevel(skill, character);
    skill.level = calculated.level;
    skill.relativeLevel = calculated.relativeLevel;

    updateCharacter({
      skills: [...character.skills, skill]
    });

    setNewSkill({ 
      name: '', 
      attribute: 'DX', 
      difficulty: 'A', 
      points: 1, 
      level: 10, 
      relativeLevel: '', 
      description: '', 
      notes: '' 
    });
    setIsAddDialogOpen(false);
  };

  const removeSkill = (id: string) => {
    updateCharacter({
      skills: character.skills.filter(skill => skill.id !== id)
    });
  };

  const updateSkill = (id: string, updates: Partial<CharacterSkill>) => {
    const updatedSkills = character.skills.map(skill => {
      if (skill.id === id) {
        const updatedSkill = { ...skill, ...updates };
        // Recalculate level when points change
        if (updates.points !== undefined) {
          const calculated = calculateSkillLevel(updatedSkill, character);
          updatedSkill.level = calculated.level;
          updatedSkill.relativeLevel = calculated.relativeLevel;
        }
        return updatedSkill;
      }
      return skill;
    });

    updateCharacter({ skills: updatedSkills });
  };

  const selectPredefinedSkill = (predefined: PredefinedSkill) => {
    setNewSkill({
      name: predefined.name,
      attribute: predefined.attribute,
      difficulty: predefined.difficulty,
      points: 1,
      level: 10,
      relativeLevel: '',
      description: predefined.description,
      notes: ''
    });
  };

  const totalCost = character.skills.reduce((sum, skill) => sum + skill.points, 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'E': return 'text-success';
      case 'A': return 'text-accent';
      case 'H': return 'text-orange-400';
      case 'VH': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="gradient-card shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-accent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Skills
          </div>
          <div className="text-sm font-normal">
            Total: <span className="text-accent font-bold">{totalCost}</span> pts
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {character.skills.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No skills added yet. Start building your character's expertise!
          </p>
        )}

        {character.skills.map((skill) => (
          <div key={skill.id} className="p-4 bg-muted/20 rounded-lg border border-border/30">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
              <Input
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                placeholder="Skill name"
                className="font-medium md:col-span-2"
              />
              
              <Select value={skill.attribute} onValueChange={(value: any) => updateSkill(skill.id, { attribute: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ST">ST</SelectItem>
                  <SelectItem value="DX">DX</SelectItem>
                  <SelectItem value="IQ">IQ</SelectItem>
                  <SelectItem value="HT">HT</SelectItem>
                  <SelectItem value="Will">Will</SelectItem>
                  <SelectItem value="Per">Per</SelectItem>
                </SelectContent>
              </Select>

              <Select value={skill.difficulty} onValueChange={(value: any) => updateSkill(skill.id, { difficulty: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E">Easy</SelectItem>
                  <SelectItem value="A">Average</SelectItem>
                  <SelectItem value="H">Hard</SelectItem>
                  <SelectItem value="VH">Very Hard</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Input
                  type="number"
                  value={skill.points}
                  onChange={(e) => updateSkill(skill.id, { points: parseInt(e.target.value) || 0 })}
                  placeholder="Pts"
                  min="0"
                  className="w-16"
                />
                <Button
                  onClick={() => removeSkill(skill.id)}
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4 text-sm">
                <span>Level: <span className="font-bold text-accent">{skill.level}</span></span>
                <span>Relative: <span className="font-bold">{skill.relativeLevel}</span></span>
                <span className={`font-bold ${getDifficultyColor(skill.difficulty)}`}>
                  {skill.difficulty}
                </span>
              </div>
            </div>
            
            {skill.description && (
              <p className="text-sm text-muted-foreground mb-2">{skill.description}</p>
            )}
            
            <Textarea
              value={skill.notes || ''}
              onChange={(e) => updateSkill(skill.id, { notes: e.target.value })}
              placeholder="Personal notes..."
              className="resize-none text-sm"
              rows={2}
            />
          </div>
        ))}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gradient-primary hover:shadow-accent transition-smooth">
              <Plus size={16} className="mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {predefinedOptions.length > 0 && (
                <div>
                  <Label>Quick Select (Optional)</Label>
                  <Select onValueChange={(value) => {
                    const predefined = predefinedOptions.find(p => p.name === value);
                    if (predefined) selectPredefinedSkill(predefined);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose from predefined skills..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {predefinedOptions.map((predefined) => (
                        <SelectItem key={predefined.name} value={predefined.name}>
                          <div className="flex justify-between items-center w-full">
                            <span>{predefined.name}</span>
                            <span className="text-muted-foreground ml-2">
                              {predefined.attribute}/{predefined.difficulty}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Skill Name</Label>
                  <Input
                    value={newSkill.name || ''}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Skill name"
                  />
                </div>
                <div>
                  <Label>Points to Invest</Label>
                  <Input
                    type="number"
                    value={newSkill.points || 1}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Governing Attribute</Label>
                  <Select value={newSkill.attribute} onValueChange={(value: any) => setNewSkill(prev => ({ ...prev, attribute: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ST">Strength (ST)</SelectItem>
                      <SelectItem value="DX">Dexterity (DX)</SelectItem>
                      <SelectItem value="IQ">Intelligence (IQ)</SelectItem>
                      <SelectItem value="HT">Health (HT)</SelectItem>
                      <SelectItem value="Will">Will</SelectItem>
                      <SelectItem value="Per">Perception</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select value={newSkill.difficulty} onValueChange={(value: any) => setNewSkill(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="E">Easy (E)</SelectItem>
                      <SelectItem value="A">Average (A)</SelectItem>
                      <SelectItem value="H">Hard (H)</SelectItem>
                      <SelectItem value="VH">Very Hard (VH)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newSkill.description || ''}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description of the skill..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Personal Notes</Label>
                <Textarea
                  value={newSkill.notes || ''}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Your notes about this skill..."
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={addSkill}
                  disabled={!newSkill.name || !newSkill.attribute || !newSkill.difficulty}
                  className="flex-1 gradient-primary"
                >
                  Add Skill
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