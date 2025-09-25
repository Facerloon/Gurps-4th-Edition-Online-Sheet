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
import { EquipmentSimpleSection } from './character/EquipmentSimpleSection';
import { SpellsSection } from './character/SpellsSection';
import { CampaignLoreSection } from './character/CampaignLoreSection';
import { CharacterNavigation, type SectionKey } from './character/CharacterNavigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
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
  spells: [],
  languages: [],
  status: [],
  reputation: [],
  culturalFamiliarities: [],
  reactionModifiers: [],
  equipmentSimple: [],
  campaignLore: '',
};

export const CharacterSheet = () => {
  const [character, setCharacter] = useState<Character>(defaultCharacter);
  const [activeSection, setActiveSection] = useState<SectionKey>('primary');
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

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'primary':
        return (
          <div className="space-y-8">
            <BasicInfo character={character} updateCharacter={updateCharacter} />
            <SocialSection character={character} updateCharacter={updateCharacter} />
          </div>
        );
      case 'attributes':
        return (
          <div className="space-y-8">
            <Attributes character={character} updateCharacter={updateCharacter} />
            <EncumbranceSection character={character} />
            <CombatStats character={character} updateCharacter={updateCharacter} />
          </div>
        );
      case 'advantages':
        return (
          <AdvantagesSection
            character={character}
            updateCharacter={updateCharacter}
            predefinedOptions={config.advantages}
          />
        );
      case 'disadvantages':
        return (
          <DisadvantagesSection
            character={character}
            updateCharacter={updateCharacter}
            predefinedOptions={config.disadvantages}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            character={character}
            updateCharacter={updateCharacter}
            predefinedOptions={config.skills}
          />
        );
      case 'equipment':
        return (
          <EquipmentSimpleSection
            character={character}
            updateCharacter={updateCharacter}
          />
        );
      case 'spells':
        return (
          <SpellsSection
            character={character}
            updateCharacter={updateCharacter}
          />
        );
      case 'campaign':
        return (
          <CampaignLoreSection
            character={character}
            updateCharacter={updateCharacter}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CharacterNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border bg-card p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold text-gradient">
                  GURPS Character Sheet
                </h1>
                <p className="text-muted-foreground">
                  4th Edition Digital Character Creator
                </p>
              </div>
            </div>
            
            {/* Save/Load Section */}
            <div className="mt-4 flex justify-center">
              <SaveLoadSection
                character={character}
                onLoadCharacter={handleLoadCharacter}
              />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              {renderActiveSection()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
