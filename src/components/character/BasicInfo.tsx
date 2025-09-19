import { Character } from '@/types/character';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
}

export const BasicInfo = ({ character, updateCharacter }: BasicInfoProps) => {
  const handleInputChange = (field: keyof Character, value: string | number) => {
    updateCharacter({ [field]: value });
  };

  return (
    <Card className="gradient-card shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-accent flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Character Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-card-foreground">Character Name</Label>
            <Input
              id="name"
              value={character.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="bg-input border-border focus:ring-accent"
              placeholder="Enter character name"
            />
          </div>
          
          <div>
            <Label htmlFor="player" className="text-card-foreground">Player Name</Label>
            <Input
              id="player"
              value={character.player}
              onChange={(e) => handleInputChange('player', e.target.value)}
              className="bg-input border-border focus:ring-accent"
              placeholder="Enter player name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="pointTotal" className="text-card-foreground">Point Total</Label>
            <Input
              id="pointTotal"
              type="number"
              value={character.pointTotal}
              onChange={(e) => handleInputChange('pointTotal', parseInt(e.target.value) || 0)}
              className="bg-input border-border focus:ring-accent"
            />
          </div>
          
          <div>
            <Label className="text-card-foreground">Unspent Points</Label>
            <Input
              value={character.unspentPoints}
              disabled
              className={`bg-muted border-border ${
                character.unspentPoints < 0 ? 'text-destructive' : 'text-success'
              }`}
            />
          </div>
          
          <div>
            <Label htmlFor="age" className="text-card-foreground">Age</Label>
            <Input
              id="age"
              value={character.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="bg-input border-border focus:ring-accent"
              placeholder="25"
            />
          </div>

          <div>
            <Label htmlFor="sizeModifier" className="text-card-foreground">Size Modifier</Label>
            <Input
              id="sizeModifier"
              type="number"
              value={character.sizeModifier}
              onChange={(e) => handleInputChange('sizeModifier', parseInt(e.target.value) || 0)}
              className="bg-input border-border focus:ring-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="height" className="text-card-foreground">Height</Label>
            <Input
              id="height"
              value={character.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="bg-input border-border focus:ring-accent"
              placeholder="6'0&quot;"
            />
          </div>
          
          <div>
            <Label htmlFor="weight" className="text-card-foreground">Weight</Label>
            <Input
              id="weight"
              value={character.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="bg-input border-border focus:ring-accent"
              placeholder="170 lbs"
            />
          </div>

          <div>
            <Label htmlFor="techLevel" className="text-card-foreground">Tech Level</Label>
            <Input
              id="techLevel"
              value={character.techLevel}
              onChange={(e) => handleInputChange('techLevel', e.target.value)}
              className="bg-input border-border focus:ring-accent"
              placeholder="TL8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="techLevelCost" className="text-card-foreground">Tech Level Cost</Label>
          <Input
            id="techLevelCost"
            type="number"
            value={character.techLevelCost}
            onChange={(e) => handleInputChange('techLevelCost', parseInt(e.target.value) || 0)}
            className="bg-input border-border focus:ring-accent"
            placeholder="0"
          />
        </div>

        <div>
          <Label htmlFor="appearance" className="text-card-foreground">Appearance</Label>
          <Textarea
            id="appearance"
            value={character.appearance}
            onChange={(e) => handleInputChange('appearance', e.target.value)}
            className="bg-input border-border focus:ring-accent resize-none"
            placeholder="Describe your character's appearance..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};