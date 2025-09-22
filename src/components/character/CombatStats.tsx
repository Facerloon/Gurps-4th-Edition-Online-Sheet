import { Character } from '@/types/character';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { calculateDodge, calculateBasicMove } from '@/utils/gurpsCalculations';

interface CombatStatsProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
}

export const CombatStats = ({ character, updateCharacter }: CombatStatsProps) => {
  const baseDodge = Math.floor(character.basicSpeed) + 3;
  const dodge = calculateDodge(character);
  const basicMove = calculateBasicMove(character);
  const baseParry = Math.floor(character.DX / 2) + 3;
  const parry = baseParry + (character.parryModifier || 0);
  const block = 10 + (character.blockModifier || 0); // Base block value

  const StatDisplay = ({ label, value, description }: { 
    label: string; 
    value: string | number; 
    description?: string;
  }) => (
    <div className="text-center p-3 bg-muted/30 rounded-lg border border-border/50">
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
      <div className="text-2xl font-bold text-accent mt-1">{value}</div>
      {description && (
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      )}
    </div>
  );

  return (
    <Card className="gradient-card shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-accent flex items-center gap-2">
          <span className="text-2xl">⚔️</span>
          Combat Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Damage */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-3">Damage</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-card-foreground">Thrust</Label>
              <textarea
                value={character.damageThrust}
                onChange={(e) => updateCharacter({ damageThrust: e.target.value })}
                className="w-full h-16 px-3 py-2 bg-input border border-border rounded-md text-center font-mono resize-none"
                placeholder="1d-2"
              />
              <div className="text-xs text-muted-foreground text-center">Punching, stabbing</div>
            </div>
            <div className="space-y-2">
              <Label className="text-card-foreground">Swing</Label>
              <textarea
                value={character.damageSwing}
                onChange={(e) => updateCharacter({ damageSwing: e.target.value })}
                className="w-full h-16 px-3 py-2 bg-input border border-border rounded-md text-center font-mono resize-none"
                placeholder="1d"
              />
              <div className="text-xs text-muted-foreground text-center">Cutting weapons</div>
            </div>
          </div>
        </div>

        {/* Basic Lift */}
        <div>
          <StatDisplay
            label="Basic Lift"
            value={`${character.basicLift} lbs`}
            description={`(ST×ST)/5 = ${character.basicLift}`}
          />
        </div>

        {/* Defenses */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-3">Active Defenses</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="text-sm text-muted-foreground font-medium">Dodge</div>
              <div className="text-2xl font-bold text-accent mt-1">{dodge}</div>
              <div className="text-xs text-muted-foreground mt-1">BS+3-Enc</div>
              <div className="mt-2">
                <Label className="text-xs">Custom Modifier</Label>
                <Input
                  type="number"
                  value={character.dodgeModifier || 0}
                  onChange={(e) => updateCharacter({ dodgeModifier: parseInt(e.target.value) || 0 })}
                  className="w-16 h-6 text-xs text-center mx-auto mt-1"
                />
              </div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="text-sm text-muted-foreground font-medium">Parry</div>
              <div className="text-2xl font-bold text-accent mt-1">{parry}*</div>
              <div className="text-xs text-muted-foreground mt-1">Skill/2+3</div>
              <div className="mt-2">
                <Label className="text-xs">Custom Modifier</Label>
                <Input
                  type="number"
                  value={character.parryModifier || 0}
                  onChange={(e) => updateCharacter({ parryModifier: parseInt(e.target.value) || 0 })}
                  className="w-16 h-6 text-xs text-center mx-auto mt-1"
                />
              </div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="text-sm text-muted-foreground font-medium">Block</div>
              <div className="text-2xl font-bold text-accent mt-1">{block}</div>
              <div className="text-xs text-muted-foreground mt-1">Skill/2+3</div>
              <div className="mt-2">
                <Label className="text-xs">Custom Modifier</Label>
                <Input
                  type="number"
                  value={character.blockModifier || 0}
                  onChange={(e) => updateCharacter({ blockModifier: parseInt(e.target.value) || 0 })}
                  className="w-16 h-6 text-xs text-center mx-auto mt-1"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * Base values. Actual defense depends on weapon/shield skill.
          </p>
        </div>

        {/* Movement */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-3">Movement</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatDisplay
              label="Basic Move"
              value={basicMove}
              description="Ground movement"
            />
            <StatDisplay
              label="Sprint"
              value={basicMove * 2}
              description="All-out running"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};