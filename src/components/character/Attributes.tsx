import { Character } from '@/types/character';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateBasicSpeed } from '@/utils/gurpsCalculations';
import React from 'react'; // Asegura que React esté importado

interface AttributesProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
}

export const Attributes = ({ character, updateCharacter }: AttributesProps) => {
  const handleAttributeChange = (attribute: keyof Character, value: number) => {
    const updates: Partial<Character> = { [attribute]: value };

    // Update secondary characteristics when base attributes change
    if (attribute === 'ST') {
      updates.HP = value; // HP defaults to ST but can be modified separately
    } else if (attribute === 'IQ') {
      updates.Will = value; // Will defaults to IQ
      updates.Per = value; // Per defaults to IQ
    } else if (attribute === 'HT') {
      updates.FP = value; // FP defaults to HT
    }

    updateCharacter(updates);
  };

  // Permite edición manual y solo acepta enteros
  const AttributeInput = ({
    label,
    attribute,
    value,
    cost,
  }: {
    label: string;
    attribute: keyof Character;
    value: number;
    cost: number;
  }) => {
    const [inputValue, setInputValue] = React.useState<string>(
      value.toString()
    );

    React.useEffect(() => {
      setInputValue(value.toString());
    }, [value]);

    return (
      <div className="space-y-2">
        <Label className="text-card-foreground font-semibold text-lg">
          {label}
        </Label>
        <div className="relative">
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => {
              // Permite vacío temporalmente
              setInputValue(e.target.value);
              // Solo actualiza si es un entero válido
              const parsed = parseInt(e.target.value, 10);
              if (!isNaN(parsed) && Number.isInteger(parsed)) {
                const newValue = Math.max(1, Math.min(200, parsed));
                handleAttributeChange(attribute, newValue);
              }
            }}
            onBlur={() => {
              // Si el campo queda vacío o no es válido, restaura el valor anterior
              if (inputValue === '' || isNaN(Number(inputValue))) {
                setInputValue(value.toString());
              }
            }}
            className="bg-input border-border focus:ring-accent text-center text-xl font-bold"
            min="1"
            max="200"
            step="1"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <div className="text-xs text-muted-foreground mt-1 text-center">
            Cost: {cost > 0 ? `+${cost}` : cost} pts
          </div>
        </div>
      </div>
    );
  };

  // Permite edición manual y solo acepta enteros
  const SecondaryInput = ({
    label,
    attribute,
    value,
    baseValue,
    cost,
  }: {
    label: string;
    attribute: keyof Character;
    value: number;
    baseValue: number;
    cost: number;
  }) => {
    const [inputValue, setInputValue] = React.useState<string>(
      value.toString()
    );

    React.useEffect(() => {
      setInputValue(value.toString());
    }, [value]);

    return (
      <div className="space-y-2">
        <Label className="text-card-foreground">{label}</Label>
        <div className="relative">
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              const parsed = parseInt(e.target.value, 10);
              if (!isNaN(parsed) && Number.isInteger(parsed)) {
                updateCharacter({ [attribute]: parsed });
              }
            }}
            onBlur={() => {
              if (inputValue === '' || isNaN(Number(inputValue))) {
                setInputValue(value.toString());
              }
            }}
            className="bg-input border-border focus:ring-accent text-center"
            step="1"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {value !== baseValue && (
            <div className="text-xs text-accent mt-1 text-center">
              {value > baseValue ? '+' : ''}
              {value - baseValue} ({cost > 0 ? '+' : ''}
              {cost} pts)
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calculate costs
  const attributeCosts = {
    ST: (character.ST - 10) * 10,
    DX: (character.DX - 10) * 20,
    IQ: (character.IQ - 10) * 20,
    HT: (character.HT - 10) * 10,
  };

  const baseBasicSpeed = calculateBasicSpeed(character.DX, character.HT);
  const baseBasicMove = Math.floor(character.basicSpeed); // Use actual basicSpeed for baseBasicMove

  const secondaryCosts = {
    HP: (character.HP - character.ST) * 2,
    Will: (character.Will - character.IQ) * 5,
    Per: (character.Per - character.IQ) * 5,
    FP: (character.FP - character.HT) * 3,
    basicSpeed: Math.round((character.basicSpeed - baseBasicSpeed) * 20),
    basicMove: (character.basicMove - baseBasicMove) * 5,
  };

  return (
    <Card className="gradient-card shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-accent flex items-center gap-2">
          <span className="text-2xl">💪</span>
          Attributes & Characteristics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Attributes */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-3">
            Primary Attributes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AttributeInput
              label="ST"
              attribute="ST"
              value={character.ST}
              cost={attributeCosts.ST}
            />
            <AttributeInput
              label="DX"
              attribute="DX"
              value={character.DX}
              cost={attributeCosts.DX}
            />
            <AttributeInput
              label="IQ"
              attribute="IQ"
              value={character.IQ}
              cost={attributeCosts.IQ}
            />
            <AttributeInput
              label="HT"
              attribute="HT"
              value={character.HT}
              cost={attributeCosts.HT}
            />
          </div>
        </div>

        {/* Secondary Characteristics */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-3">
            Secondary Characteristics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SecondaryInput
              label="HP"
              attribute="HP"
              value={character.HP}
              baseValue={character.ST}
              cost={secondaryCosts.HP}
            />
            <SecondaryInput
              label="Will"
              attribute="Will"
              value={character.Will}
              baseValue={character.IQ}
              cost={secondaryCosts.Will}
            />
            <SecondaryInput
              label="Per"
              attribute="Per"
              value={character.Per}
              baseValue={character.IQ}
              cost={secondaryCosts.Per}
            />
            <SecondaryInput
              label="FP"
              attribute="FP"
              value={character.FP}
              baseValue={character.HT}
              cost={secondaryCosts.FP}
            />
          </div>
        </div>

        {/* Movement & Speed */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-3">
            Movement & Speed
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-card-foreground">Basic Speed</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.25"
                  value={character.basicSpeed}
                  onChange={(e) =>
                    updateCharacter({
                      basicSpeed: parseFloat(e.target.value) || baseBasicSpeed,
                    })
                  }
                  className="bg-input border-border focus:ring-accent text-center"
                />
                {character.basicSpeed !== baseBasicSpeed && (
                  <div className="text-xs text-accent mt-1 text-center">
                    {character.basicSpeed > baseBasicSpeed ? '+' : ''}
                    {(character.basicSpeed - baseBasicSpeed).toFixed(2)} (
                    {secondaryCosts.basicSpeed > 0 ? '+' : ''}
                    {secondaryCosts.basicSpeed} pts)
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-card-foreground">Basic Move</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={character.basicMove}
                  onChange={(e) => {
                    // Solo acepta enteros
                    const parsed = parseInt(e.target.value, 10);
                    if (!isNaN(parsed) && Number.isInteger(parsed)) {
                      updateCharacter({ basicMove: parsed });
                    }
                  }}
                  onBlur={(e) => {
                    // Si el campo queda vacío o no es válido, restaura el valor anterior
                    if (
                      e.target.value === '' ||
                      isNaN(Number(e.target.value))
                    ) {
                      updateCharacter({ basicMove: baseBasicMove });
                    }
                  }}
                  className="bg-input border-border focus:ring-accent text-center"
                  step="1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                {character.basicMove !== baseBasicMove && (
                  <div className="text-xs text-accent mt-1 text-center">
                    {character.basicMove > baseBasicMove ? '+' : ''}
                    {character.basicMove - baseBasicMove} (
                    {secondaryCosts.basicMove > 0 ? '+' : ''}
                    {secondaryCosts.basicMove} pts)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total Attribute Cost */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-card-foreground font-medium">
              Total Attribute Cost:
            </span>
            <span
              className={`font-bold text-lg ${
                Object.values(attributeCosts).reduce((a, b) => a + b, 0) +
                  Object.values(secondaryCosts).reduce((a, b) => a + b, 0) >=
                0
                  ? 'text-accent'
                  : 'text-destructive'
              }`}
            >
              {Object.values(attributeCosts).reduce((a, b) => a + b, 0) +
                Object.values(secondaryCosts).reduce((a, b) => a + b, 0)}{' '}
              pts
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};