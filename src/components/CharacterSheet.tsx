import { useState, useEffect } from 'react';
import { Character, GurpsConfig } from '@/types/character';
import { BasicInfo } from './character/BasicInfo';
import { Attributes } from './character/Attributes';
import { CombatStats } from './character/CombatStats';
import { AdvantagesSection } from './character/AdvantagesSection';
import { DisadvantagesSection } from './character/DisadvantagesSection';
import { SkillsSection } from './character/SkillsSection';
import { EncumbranceSection } from './character/EncumbranceSection';
import { SocialSection } from './character/SocialSection';
import { SaveLoadSection } from './character/SaveLoadSection';
import {
  calculateBasicLift,
  calculateDamage,
  calculateTotalPoints,
  calculateBasicSpeed,
  calculateSkillLevel,
} from '@/utils/gurpsCalculations';

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
  techLevel: '3',
  techLevelCost: 0,
  ST: 10,
  DX: 10,
  IQ: 10,
  HT: 10,
  HP: 10,
  Will: 10,
  Per: 10,
  FP: 10,
  basicSpeed: 5.0,
  basicMove: 5,
  basicLift: 20,
  damageThrust: '1d-2',
  damageSwing: '1d',
  dodgeModifier: 0,
  parryModifier: 0,
  blockModifier: 0,
  currentWeight: 0,
  advantages: [],
  disadvantages: [],
  skills: [],
  equipment: [],
  languages: [],
  status: [],
  reputation: [],
  culturalFamiliarities: [],
  reactionModifiers: [],
};

export const CharacterSheet = () => {
  const [character, setCharacter] = useState<Character>(defaultCharacter);
  const [config, setConfig] = useState<GurpsConfig>({
    advantages: [],
    disadvantages: [],
    skills: [],
  });

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
    const baseBasicSpeed = calculateBasicSpeed(character.DX, character.HT);
    const baseHP = character.ST;
    const baseWill = character.IQ;
    const basePer = character.IQ;
    const baseFP = character.HT;
    const baseBasicMove = Math.floor(baseBasicSpeed);

    // Solo actualiza si los secundarios están sincronizados con los primarios
    // (es decir, si el usuario NO los personalizó)
    let needsUpdate = false;
    const updates: Partial<Character> = {};

    if (character.basicLift !== basicLift) {
      updates.basicLift = basicLift;
      needsUpdate = true;
    }
    if (character.HP === character.ST && character.HP !== baseHP) {
      updates.HP = baseHP;
      needsUpdate = true;
    }
    if (character.Will === character.IQ && character.Will !== baseWill) {
      updates.Will = baseWill;
      needsUpdate = true;
    }
    if (character.Per === character.IQ && character.Per !== basePer) {
      updates.Per = basePer;
      needsUpdate = true;
    }
    if (character.FP === character.HT && character.FP !== baseFP) {
      updates.FP = baseFP;
      needsUpdate = true;
    }
    if (
      character.basicSpeed ===
        calculateBasicSpeed(character.DX, character.HT) &&
      character.basicSpeed !== baseBasicSpeed
    ) {
      updates.basicSpeed = baseBasicSpeed;
      needsUpdate = true;
    }
    if (
      character.basicMove ===
        Math.floor(calculateBasicSpeed(character.DX, character.HT)) &&
      character.basicMove !== baseBasicMove
    ) {
      updates.basicMove = baseBasicMove;
      needsUpdate = true;
    }

    if (needsUpdate) {
      setCharacter((prev) => ({
        ...prev,
        ...updates,
      }));
    }
  }, [character.ST, character.DX, character.IQ, character.HT]);

  // Recalculate skills when attributes change
  useEffect(() => {
    if (character.skills.length > 0) {
      const updatedSkills = character.skills.map((skill) => {
        const { level, relativeLevel } = calculateSkillLevel(skill, character);
        return { ...skill, level: level + skill.modifier, relativeLevel };
      });

      // Solo actualiza si hay algún cambio real en los skills
      const isDifferent = character.skills.some((skill, idx) => {
        return (
          skill.level !== updatedSkills[idx].level ||
          skill.relativeLevel !== updatedSkills[idx].relativeLevel
        );
      });

      if (isDifferent) {
        setCharacter((prev) => ({ ...prev, skills: updatedSkills }));
      }
    }
  }, [
    character.ST,
    character.DX,
    character.IQ,
    character.HT,
    character.Will,
    character.Per,
    character.skills,
  ]);

  // Calculate unspent points
  useEffect(() => {
    const totalSpent = calculateTotalPoints(character);
    const unspent = character.pointTotal - totalSpent;

    if (character.unspentPoints !== unspent) {
      setCharacter((prev) => ({
        ...prev,
        unspentPoints: unspent,
      }));
    }
  }, [character]);

  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter((prev) => ({ ...prev, ...updates }));
  };

  const handleLoadCharacter = (newCharacter: Character) => {
    setCharacter(newCharacter);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            GURPS Character Sheet
          </h1>
          <p className="text-muted-foreground text-lg">
            4th Edition Digital Character Creator
          </p>
        </div>

        {/* Save/Load Section */}
        <div className="max-w-md mx-auto mb-6">
          <SaveLoadSection
            character={character}
            onLoadCharacter={handleLoadCharacter}
          />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-none">
          {/* Left Column */}
          <div className="space-y-6">
            <BasicInfo
              character={character}
              updateCharacter={updateCharacter}
            />
            <Attributes
              character={character}
              updateCharacter={updateCharacter}
            />
            <CombatStats
              character={character}
              updateCharacter={updateCharacter}
            />
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <SocialSection
              character={character}
              updateCharacter={updateCharacter}
            />
            <EncumbranceSection character={character} />
            <AdvantagesSection
              character={character}
              updateCharacter={updateCharacter}
              predefinedOptions={config.advantages}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DisadvantagesSection
              character={character}
              updateCharacter={updateCharacter}
              predefinedOptions={config.disadvantages}
            />
            <SkillsSection
              character={character}
              updateCharacter={updateCharacter}
              predefinedOptions={config.skills}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
