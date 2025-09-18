import { Character } from '@/types/character';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateDodge, calculateBasicMove } from '@/utils/gurpsCalculations';

interface CombatStatsProps {
  character: Character;
}

export const CombatStats = ({ character }: CombatStatsProps) => {
  const dodge = calculateDodge(character);
  const basicMove = calculateBasicMove(character);
  const parry = Math.floor(character.DX / 2) + 3; // Base parry, will vary by weapon

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
            <StatDisplay
              label="Thrust"
              value={character.damageThrust}
              description="Punching, stabbing"
            />
            <StatDisplay
              label="Swing"
              value={character.damageSwing}
              description="Cutting weapons"
            />
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
            <StatDisplay
              label="Dodge"
              value={dodge}
              description={`DX/2+3 - Enc`}
            />
            <StatDisplay
              label="Parry"
              value={`${parry}*`}
              description="Weapon skill/2+3"
            />
            <StatDisplay
              label="Block"
              value="—"
              description="Shield skill/2+3"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * Base parry. Actual parry depends on weapon skill.
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