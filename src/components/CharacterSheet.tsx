import { useState, useEffect } from 'react';
import { Character, GurpsConfig } from '@/types/character';
import { BasicInfo } from './character/BasicInfo';
import { Attributes } from './character/Attributes';
import { CombatStats } from './character/CombatStats';
import { AdvantagesSection } from './character/AdvantagesSection';
import { DisadvantagesSection } from './character/DisadvantagesSection';
import { SkillsSection } from './character/SkillsSection';
import { EncumbranceSection } from './character/EncumbranceSection';
import { calculateBasicLift, calculateDamage, calculateTotalPoints } from '@/utils/gurpsCalculations';

const defaultCharacter: Character = {
  name: '',
  player: '',
  pointTotal: 100,
  unspentPoints: 0,
  height: '',
  weight: '',
  age: '',
  appearance: '',
  sizeModifier: 0,
  techLevel: '',
  ST: 10,
  DX: 10,
  IQ: 10,
  HT: 10,
  HP: 10,
  Will: 10,
  Per: 10,
  FP: 10,
  basicLift: 20,
  damageThrust: '1d-2',
  damageSwing: '1d',
  currentWeight: 0,
  advantages: [],
  disadvantages: [],
  skills: [],
  equipment: [],
  reactionModifiers: []
};

export const CharacterSheet = () => {
  const [character, setCharacter] = useState<Character>(defaultCharacter);
  const [config, setConfig] = useState<GurpsConfig>({ advantages: [], disadvantages: [], skills: [] });

  // Load configuration on component mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/gurps-config.json');
        const configData = await response.json();
        setConfig(configData);
      } catch (error) {
        console.error('Failed to load GURPS configuration:', error);
      }
    };
    
    loadConfig();
  }, []);

  // Update derived stats when base attributes change
  useEffect(() => {
    const basicLift = calculateBasicLift(character.ST);
    const damage = calculateDamage(character.ST);
    
    setCharacter(prev => ({
      ...prev,
      basicLift,
      damageThrust: damage.thrust,
      damageSwing: damage.swing,
      HP: prev.ST, // Default HP = ST, can be modified
      Will: prev.IQ, // Default Will = IQ, can be modified
      Per: prev.IQ, // Default Per = IQ, can be modified
      FP: prev.HT, // Default FP = HT, can be modified
    }));
  }, [character.ST, character.DX, character.IQ, character.HT]);

  // Calculate unspent points
  useEffect(() => {
    const totalSpent = calculateTotalPoints(character);
    const unspent = character.pointTotal - totalSpent;
    
    setCharacter(prev => ({
      ...prev,
      unspentPoints: unspent
    }));
  }, [character]);

  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">GURPS Character Sheet</h1>
          <p className="text-muted-foreground text-lg">4th Edition Digital Character Creator</p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <BasicInfo character={character} updateCharacter={updateCharacter} />
            <Attributes character={character} updateCharacter={updateCharacter} />
            <CombatStats character={character} />
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <AdvantagesSection 
              character={character} 
              updateCharacter={updateCharacter}
              predefinedOptions={config.advantages}
            />
            <DisadvantagesSection 
              character={character} 
              updateCharacter={updateCharacter}
              predefinedOptions={config.disadvantages}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SkillsSection 
              character={character} 
              updateCharacter={updateCharacter}
              predefinedOptions={config.skills}
            />
            <EncumbranceSection character={character} />
          </div>
        </div>
      </div>
    </div>
  );
};