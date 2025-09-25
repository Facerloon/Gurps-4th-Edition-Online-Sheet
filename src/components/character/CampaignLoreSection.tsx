import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Character } from '@/types/character';

interface CampaignLoreSectionProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
}

export const CampaignLoreSection = ({ character, updateCharacter }: CampaignLoreSectionProps) => {
  const handleChange = (value: string) => {
    updateCharacter({ campaignLore: value });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-gradient">Campaign Lore & Background</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={character.campaignLore}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Write your character's background, campaign notes, personal history, goals, relationships, and any other lore details here..."
            className="min-h-[400px] resize-vertical"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Use this space to record your character's story, campaign events, relationships with other characters, and any other narrative details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};