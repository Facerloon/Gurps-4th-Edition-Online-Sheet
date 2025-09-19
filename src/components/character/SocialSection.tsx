import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Plus } from 'lucide-react';
import { Character, CharacterLanguage, CharacterStatus, CharacterReputation, CharacterCulturalFamiliarity } from '@/types/character';

interface SocialSectionProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
}

const LANGUAGE_LEVELS = [
  { value: 'None', label: 'None', points: 0 },
  { value: 'Broken', label: 'Broken', points: 1 },
  { value: 'Accented', label: 'Accented', points: 2 },
  { value: 'Native', label: 'Native', points: 3 }
];

const calculateLanguagePoints = (written: string, spoken: string): number => {
  const writtenPoints = LANGUAGE_LEVELS.find(l => l.value === written)?.points || 0;
  const spokenPoints = LANGUAGE_LEVELS.find(l => l.value === spoken)?.points || 0;
  return writtenPoints + spokenPoints;
};

export const SocialSection = ({ character, updateCharacter }: SocialSectionProps) => {
  const [newLanguage, setNewLanguage] = useState<Partial<CharacterLanguage>>({
    name: '',
    writtenLevel: 'None',
    spokenLevel: 'None',
    points: 0,
    notes: ''
  });
  const [newStatus, setNewStatus] = useState<Partial<CharacterStatus>>({
    level: 0,
    points: 0,
    description: '',
    notes: ''
  });
  const [newReputation, setNewReputation] = useState<Partial<CharacterReputation>>({
    description: '',
    modifier: 0,
    scope: '',
    points: 0,
    notes: ''
  });
  const [newCulturalFamiliarity, setNewCulturalFamiliarity] = useState<Partial<CharacterCulturalFamiliarity>>({
    name: '',
    points: 0,
    notes: ''
  });

  const addLanguage = () => {
    if (!newLanguage.name) return;
    
    const language: CharacterLanguage = {
      id: crypto.randomUUID(),
      name: newLanguage.name,
      writtenLevel: newLanguage.writtenLevel as any || 'None',
      spokenLevel: newLanguage.spokenLevel as any || 'None',
      points: calculateLanguagePoints(newLanguage.writtenLevel || 'None', newLanguage.spokenLevel || 'None'),
      notes: newLanguage.notes
    };

    updateCharacter({
      languages: [...character.languages, language]
    });

    setNewLanguage({
      name: '',
      writtenLevel: 'None',
      spokenLevel: 'None',
      points: 0,
      notes: ''
    });
  };

  const removeLanguage = (id: string) => {
    updateCharacter({
      languages: character.languages.filter(lang => lang.id !== id)
    });
  };

  const updateLanguage = (id: string, updates: Partial<CharacterLanguage>) => {
    const updatedLanguages = character.languages.map(lang => {
      if (lang.id === id) {
        const updated = { ...lang, ...updates };
        if (updates.writtenLevel || updates.spokenLevel) {
          updated.points = calculateLanguagePoints(updated.writtenLevel, updated.spokenLevel);
        }
        return updated;
      }
      return lang;
    });
    updateCharacter({ languages: updatedLanguages });
  };

  const addStatus = () => {
    if (newStatus.level === undefined) return;
    
    const status: CharacterStatus = {
      id: crypto.randomUUID(),
      level: newStatus.level,
      points: newStatus.level * 5, // Status costs 5 pts per level
      description: newStatus.description,
      notes: newStatus.notes
    };

    updateCharacter({
      status: [...character.status, status]
    });

    setNewStatus({
      level: 0,
      points: 0,
      description: '',
      notes: ''
    });
  };

  const removeStatus = (id: string) => {
    updateCharacter({
      status: character.status.filter(status => status.id !== id)
    });
  };

  const updateStatus = (id: string, updates: Partial<CharacterStatus>) => {
    const updatedStatus = character.status.map(status => {
      if (status.id === id) {
        const updated = { ...status, ...updates };
        if (updates.level !== undefined) {
          updated.points = updated.level * 5;
        }
        return updated;
      }
      return status;
    });
    updateCharacter({ status: updatedStatus });
  };

  const addReputation = () => {
    if (!newReputation.description) return;
    
    const reputation: CharacterReputation = {
      id: crypto.randomUUID(),
      description: newReputation.description,
      modifier: newReputation.modifier || 0,
      scope: newReputation.scope || '',
      points: newReputation.points || 0,
      notes: newReputation.notes
    };

    updateCharacter({
      reputation: [...character.reputation, reputation]
    });

    setNewReputation({
      description: '',
      modifier: 0,
      scope: '',
      points: 0,
      notes: ''
    });
  };

  const removeReputation = (id: string) => {
    updateCharacter({
      reputation: character.reputation.filter(rep => rep.id !== id)
    });
  };

  const updateReputation = (id: string, updates: Partial<CharacterReputation>) => {
    const updatedReputation = character.reputation.map(rep => {
      if (rep.id === id) {
        return { ...rep, ...updates };
      }
      return rep;
    });
    updateCharacter({ reputation: updatedReputation });
  };

  const addCulturalFamiliarity = () => {
    if (!newCulturalFamiliarity.name) return;
    
    const cf: CharacterCulturalFamiliarity = {
      id: crypto.randomUUID(),
      name: newCulturalFamiliarity.name,
      points: newCulturalFamiliarity.points || 0,
      notes: newCulturalFamiliarity.notes
    };

    updateCharacter({
      culturalFamiliarities: [...character.culturalFamiliarities, cf]
    });

    setNewCulturalFamiliarity({
      name: '',
      points: 0,
      notes: ''
    });
  };

  const removeCulturalFamiliarity = (id: string) => {
    updateCharacter({
      culturalFamiliarities: character.culturalFamiliarities.filter(cf => cf.id !== id)
    });
  };

  const updateCulturalFamiliarity = (id: string, updates: Partial<CharacterCulturalFamiliarity>) => {
    const updatedCFs = character.culturalFamiliarities.map(cf => {
      if (cf.id === id) {
        return { ...cf, ...updates };
      }
      return cf;
    });
    updateCharacter({ culturalFamiliarities: updatedCFs });
  };

  const totalSocialCost = 
    character.languages.reduce((sum, lang) => sum + lang.points, 0) +
    character.status.reduce((sum, status) => sum + status.points, 0) +
    character.reputation.reduce((sum, rep) => sum + rep.points, 0) +
    character.culturalFamiliarities.reduce((sum, cf) => sum + cf.points, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Social
          <span className="text-sm font-normal text-muted-foreground">
            Total Cost: {totalSocialCost} points
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="languages" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="reputation">Reputation</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
          </TabsList>

          <TabsContent value="languages" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Languages</h4>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Language
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Language</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="languageName">Language Name</Label>
                      <Input
                        id="languageName"
                        value={newLanguage.name || ''}
                        onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Written Level</Label>
                        <Select 
                          value={newLanguage.writtenLevel || 'None'}
                          onValueChange={(value) => setNewLanguage({ ...newLanguage, writtenLevel: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGE_LEVELS.map(level => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label} ({level.points} pts)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Spoken Level</Label>
                        <Select 
                          value={newLanguage.spokenLevel || 'None'}
                          onValueChange={(value) => setNewLanguage({ ...newLanguage, spokenLevel: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGE_LEVELS.map(level => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label} ({level.points} pts)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="languageNotes">Notes</Label>
                      <Textarea
                        id="languageNotes"
                        value={newLanguage.notes || ''}
                        onChange={(e) => setNewLanguage({ ...newLanguage, notes: e.target.value })}
                      />
                    </div>
                    <Button onClick={addLanguage}>Add Language</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {character.languages.map((language) => (
              <div key={language.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Input
                    value={language.name}
                    onChange={(e) => updateLanguage(language.id, { name: e.target.value })}
                    className="font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLanguage(language.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Written</Label>
                    <Select 
                      value={language.writtenLevel}
                      onValueChange={(value) => updateLanguage(language.id, { writtenLevel: value as any })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_LEVELS.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label} ({level.points} pts)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Spoken</Label>
                    <Select 
                      value={language.spokenLevel}
                      onValueChange={(value) => updateLanguage(language.id, { spokenLevel: value as any })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_LEVELS.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label} ({level.points} pts)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total: {language.points} points
                  </span>
                </div>
                {language.notes && (
                  <Textarea
                    value={language.notes}
                    onChange={(e) => updateLanguage(language.id, { notes: e.target.value })}
                    className="text-sm"
                    rows={2}
                  />
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Status</h4>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Status
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Status</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="statusLevel">Level</Label>
                      <Input
                        id="statusLevel"
                        type="number"
                        value={newStatus.level || 0}
                        onChange={(e) => setNewStatus({ ...newStatus, level: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="statusDescription">Description</Label>
                      <Input
                        id="statusDescription"
                        value={newStatus.description || ''}
                        onChange={(e) => setNewStatus({ ...newStatus, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="statusNotes">Notes</Label>
                      <Textarea
                        id="statusNotes"
                        value={newStatus.notes || ''}
                        onChange={(e) => setNewStatus({ ...newStatus, notes: e.target.value })}
                      />
                    </div>
                    <Button onClick={addStatus}>Add Status</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {character.status.map((status) => (
              <div key={status.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Level:</Label>
                    <Input
                      type="number"
                      value={status.level}
                      onChange={(e) => updateStatus(status.id, { level: parseInt(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStatus(status.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={status.description || ''}
                  onChange={(e) => updateStatus(status.id, { description: e.target.value })}
                  placeholder="Description"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Cost: {status.points} points
                  </span>
                </div>
                {status.notes && (
                  <Textarea
                    value={status.notes}
                    onChange={(e) => updateStatus(status.id, { notes: e.target.value })}
                    className="text-sm"
                    rows={2}
                  />
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="reputation" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Reputation</h4>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Reputation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Reputation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="repDescription">Description</Label>
                      <Input
                        id="repDescription"
                        value={newReputation.description || ''}
                        onChange={(e) => setNewReputation({ ...newReputation, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="repModifier">Modifier</Label>
                        <Input
                          id="repModifier"
                          type="number"
                          value={newReputation.modifier || 0}
                          onChange={(e) => setNewReputation({ ...newReputation, modifier: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="repPoints">Points</Label>
                        <Input
                          id="repPoints"
                          type="number"
                          value={newReputation.points || 0}
                          onChange={(e) => setNewReputation({ ...newReputation, points: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="repScope">Scope</Label>
                      <Input
                        id="repScope"
                        value={newReputation.scope || ''}
                        onChange={(e) => setNewReputation({ ...newReputation, scope: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="repNotes">Notes</Label>
                      <Textarea
                        id="repNotes"
                        value={newReputation.notes || ''}
                        onChange={(e) => setNewReputation({ ...newReputation, notes: e.target.value })}
                      />
                    </div>
                    <Button onClick={addReputation}>Add Reputation</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {character.reputation.map((rep) => (
              <div key={rep.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Input
                    value={rep.description}
                    onChange={(e) => updateReputation(rep.id, { description: e.target.value })}
                    placeholder="Description"
                    className="font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReputation(rep.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Modifier</Label>
                    <Input
                      type="number"
                      value={rep.modifier}
                      onChange={(e) => updateReputation(rep.id, { modifier: parseInt(e.target.value) || 0 })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Points</Label>
                    <Input
                      type="number"
                      value={rep.points}
                      onChange={(e) => updateReputation(rep.id, { points: parseInt(e.target.value) || 0 })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Scope</Label>
                    <Input
                      value={rep.scope}
                      onChange={(e) => updateReputation(rep.id, { scope: e.target.value })}
                      className="h-8"
                    />
                  </div>
                </div>
                {rep.notes && (
                  <Textarea
                    value={rep.notes}
                    onChange={(e) => updateReputation(rep.id, { notes: e.target.value })}
                    className="text-sm"
                    rows={2}
                  />
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="cultural" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Cultural Familiarities</h4>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Cultural Familiarity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Cultural Familiarity</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cfName">Name</Label>
                      <Input
                        id="cfName"
                        value={newCulturalFamiliarity.name || ''}
                        onChange={(e) => setNewCulturalFamiliarity({ ...newCulturalFamiliarity, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cfPoints">Points</Label>
                      <Input
                        id="cfPoints"
                        type="number"
                        value={newCulturalFamiliarity.points || 0}
                        onChange={(e) => setNewCulturalFamiliarity({ ...newCulturalFamiliarity, points: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cfNotes">Notes</Label>
                      <Textarea
                        id="cfNotes"
                        value={newCulturalFamiliarity.notes || ''}
                        onChange={(e) => setNewCulturalFamiliarity({ ...newCulturalFamiliarity, notes: e.target.value })}
                      />
                    </div>
                    <Button onClick={addCulturalFamiliarity}>Add Cultural Familiarity</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {character.culturalFamiliarities.map((cf) => (
              <div key={cf.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Input
                    value={cf.name}
                    onChange={(e) => updateCulturalFamiliarity(cf.id, { name: e.target.value })}
                    placeholder="Cultural Familiarity"
                    className="font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCulturalFamiliarity(cf.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Points:</Label>
                  <Input
                    type="number"
                    value={cf.points}
                    onChange={(e) => updateCulturalFamiliarity(cf.id, { points: parseInt(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                {cf.notes && (
                  <Textarea
                    value={cf.notes}
                    onChange={(e) => updateCulturalFamiliarity(cf.id, { notes: e.target.value })}
                    className="text-sm"
                    rows={2}
                  />
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};