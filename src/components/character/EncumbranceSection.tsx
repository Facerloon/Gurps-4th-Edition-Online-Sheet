import { Character, ENCUMBRANCE_LEVELS } from '@/types/character';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateEncumbrance, calculateBasicMove, calculateDodge } from '@/utils/gurpsCalculations';

interface EncumbranceSectionProps {
  character: Character;
}

export const EncumbranceSection = ({ character }: EncumbranceSectionProps) => {
  const currentEncumbrance = calculateEncumbrance(character);
  const basicMove = calculateBasicMove(character);
  const dodge = calculateDodge(character);

  const EncumbranceRow = ({ 
    level, 
    name, 
    multiplier, 
    penalty, 
    dodgePenalty,
    isActive 
  }: { 
    level: string;
    name: string; 
    multiplier: number; 
    penalty: number; 
    dodgePenalty: number;
    isActive: boolean;
  }) => {
    const maxWeight = character.basicLift * multiplier;
    
    return (
      <div className={`p-3 rounded-lg border transition-smooth ${
        isActive 
          ? 'bg-accent/20 border-accent shadow-accent/20 shadow-lg' 
          : 'bg-muted/10 border-border/30'
      }`}>
        <div className="grid grid-cols-5 gap-2 text-sm">
          <div className={`font-medium ${isActive ? 'text-accent' : 'text-card-foreground'}`}>
            {name} ({level})
          </div>
          <div className="text-muted-foreground">
            ≤ {maxWeight} lbs
          </div>
          <div className="text-muted-foreground">
            Move ×{multiplier === 1 ? '1' : 
                   multiplier === 2 ? '0.8' : 
                   multiplier === 3 ? '0.6' : 
                   multiplier === 6 ? '0.4' : '0.2'}
          </div>
          <div className="text-muted-foreground">
            {penalty === 0 ? '—' : `${penalty}`}
          </div>
          <div className="text-muted-foreground">
            Dodge {dodgePenalty === 0 ? '—' : `${dodgePenalty}`}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="gradient-card shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-accent flex items-center gap-2">
          <span className="text-2xl">🎒</span>
          Encumbrance & Movement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Current Weight</div>
              <div className="text-xl font-bold text-card-foreground">
                {character.currentWeight} lbs
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Encumbrance Level</div>
              <div className="text-xl font-bold text-accent">
                {currentEncumbrance.name}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Basic Lift</div>
              <div className="text-xl font-bold text-card-foreground">
                {character.basicLift} lbs
              </div>
            </div>
          </div>
        </div>

        {/* Current Effects */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg border border-border/50">
            <div className="text-sm text-muted-foreground">Basic Move</div>
            <div className="text-2xl font-bold text-accent">{basicMove}</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg border border-border/50">
            <div className="text-sm text-muted-foreground">Dodge</div>
            <div className="text-2xl font-bold text-accent">{dodge}</div>
          </div>
        </div>

        {/* Encumbrance Table */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-3">Encumbrance Levels</h3>
          
          {/* Header */}
          <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground mb-2 px-3">
            <div>Level</div>
            <div>Max Weight</div>
            <div>Move Mod</div>
            <div>General</div>
            <div>Dodge Mod</div>
          </div>

          <div className="space-y-2">
            <EncumbranceRow
              level="0"
              name="None"
              multiplier={ENCUMBRANCE_LEVELS.NONE.multiplier}
              penalty={ENCUMBRANCE_LEVELS.NONE.penalty}
              dodgePenalty={ENCUMBRANCE_LEVELS.NONE.dodgePenalty}
              isActive={currentEncumbrance.name === 'None'}
            />
            <EncumbranceRow
              level="1"
              name="Light"
              multiplier={ENCUMBRANCE_LEVELS.LIGHT.multiplier}
              penalty={ENCUMBRANCE_LEVELS.LIGHT.penalty}
              dodgePenalty={ENCUMBRANCE_LEVELS.LIGHT.dodgePenalty}
              isActive={currentEncumbrance.name === 'Light'}
            />
            <EncumbranceRow
              level="2"
              name="Medium"
              multiplier={ENCUMBRANCE_LEVELS.MEDIUM.multiplier}
              penalty={ENCUMBRANCE_LEVELS.MEDIUM.penalty}
              dodgePenalty={ENCUMBRANCE_LEVELS.MEDIUM.dodgePenalty}
              isActive={currentEncumbrance.name === 'Medium'}
            />
            <EncumbranceRow
              level="3"
              name="Heavy"
              multiplier={ENCUMBRANCE_LEVELS.HEAVY.multiplier}
              penalty={ENCUMBRANCE_LEVELS.HEAVY.penalty}
              dodgePenalty={ENCUMBRANCE_LEVELS.HEAVY.dodgePenalty}
              isActive={currentEncumbrance.name === 'Heavy'}
            />
            <EncumbranceRow
              level="4"
              name="X-Heavy"
              multiplier={ENCUMBRANCE_LEVELS.XHEAVY.multiplier}
              penalty={ENCUMBRANCE_LEVELS.XHEAVY.penalty}
              dodgePenalty={ENCUMBRANCE_LEVELS.XHEAVY.dodgePenalty}
              isActive={currentEncumbrance.name === 'X-Heavy'}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> Equipment weight management coming soon! 
          For now, manually update current weight in the character info section.
        </p>
      </CardContent>
    </Card>
  );
};