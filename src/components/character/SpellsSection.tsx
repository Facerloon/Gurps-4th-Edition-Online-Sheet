import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Character, CharacterSpell } from '@/types/character';

interface SpellsSectionProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
}

interface SpellFormData {
  name: string;
  class: string;
  skillLevel: number;
  timeToCast: string;
  duration: string;
  costToCast: string;
  costToMaintain: string;
  notes: string;
  page: string;
}

const defaultSpellForm: SpellFormData = {
  name: '',
  class: '',
  skillLevel: 10,
  timeToCast: '',
  duration: '',
  costToCast: '',
  costToMaintain: '',
  notes: '',
  page: '',
};

export const SpellsSection = ({ character, updateCharacter }: SpellsSectionProps) => {
  const [editingSpell, setEditingSpell] = useState<CharacterSpell | null>(null);
  const [formData, setFormData] = useState<SpellFormData>(defaultSpellForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openAddDialog = () => {
    setEditingSpell(null);
    setFormData(defaultSpellForm);
    setIsDialogOpen(true);
  };

  const openEditDialog = (spell: CharacterSpell) => {
    setEditingSpell(spell);
    setFormData({
      name: spell.name,
      class: spell.class,
      skillLevel: spell.skillLevel,
      timeToCast: spell.timeToCast,
      duration: spell.duration,
      costToCast: spell.costToCast,
      costToMaintain: spell.costToMaintain,
      notes: spell.notes || '',
      page: spell.page || '',
    });
    setIsDialogOpen(true);
  };

  const saveSpell = () => {
    if (!formData.name.trim()) return;

    const spellData: CharacterSpell = {
      id: editingSpell?.id || `spell-${Date.now()}`,
      name: formData.name.trim(),
      class: formData.class.trim(),
      skillLevel: formData.skillLevel,
      timeToCast: formData.timeToCast.trim(),
      duration: formData.duration.trim(),
      costToCast: formData.costToCast.trim(),
      costToMaintain: formData.costToMaintain.trim(),
      notes: formData.notes.trim(),
      page: formData.page.trim(),
    };

    let updatedSpells: CharacterSpell[];
    if (editingSpell) {
      updatedSpells = character.spells.map(spell =>
        spell.id === editingSpell.id ? spellData : spell
      );
    } else {
      updatedSpells = [...character.spells, spellData];
    }

    updateCharacter({ spells: updatedSpells });
    setIsDialogOpen(false);
  };

  const removeSpell = (spellId: string) => {
    const updatedSpells = character.spells.filter(spell => spell.id !== spellId);
    updateCharacter({ spells: updatedSpells });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gradient">Spells</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Spell
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingSpell ? 'Edit Spell' : 'Add New Spell'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Spell Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Spell name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Class/College</label>
                  <Input
                    value={formData.class}
                    onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                    placeholder="Fire, Water, etc."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Skill Level</label>
                  <Input
                    type="number"
                    value={formData.skillLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, skillLevel: parseInt(e.target.value) || 10 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time to Cast</label>
                  <Input
                    value={formData.timeToCast}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeToCast: e.target.value }))}
                    placeholder="1 second, 2 minutes, etc."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="Instant, 1 minute, etc."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cost to Cast</label>
                  <Input
                    value={formData.costToCast}
                    onChange={(e) => setFormData(prev => ({ ...prev, costToCast: e.target.value }))}
                    placeholder="1 FP, 2 FP, etc."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cost to Maintain</label>
                  <Input
                    value={formData.costToMaintain}
                    onChange={(e) => setFormData(prev => ({ ...prev, costToMaintain: e.target.value }))}
                    placeholder="1 FP/minute, etc."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Page Reference</label>
                  <Input
                    value={formData.page}
                    onChange={(e) => setFormData(prev => ({ ...prev, page: e.target.value }))}
                    placeholder="B241, M15, etc."
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the spell"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={saveSpell}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Spell
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {character.spells.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No spells learned yet. Add your first spell above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Spell Name</th>
                    <th className="text-left p-2">Class</th>
                    <th className="text-left p-2">Level</th>
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">Duration</th>
                    <th className="text-left p-2">Cost</th>
                    <th className="text-left p-2">Maintain</th>
                    <th className="text-left p-2">Page</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {character.spells.map((spell) => (
                    <tr key={spell.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{spell.name}</td>
                      <td className="p-2">{spell.class}</td>
                      <td className="p-2">{spell.skillLevel}</td>
                      <td className="p-2">{spell.timeToCast}</td>
                      <td className="p-2">{spell.duration}</td>
                      <td className="p-2">{spell.costToCast}</td>
                      <td className="p-2">{spell.costToMaintain}</td>
                      <td className="p-2">{spell.page}</td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button
                            onClick={() => openEditDialog(spell)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => removeSpell(spell.id)}
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};