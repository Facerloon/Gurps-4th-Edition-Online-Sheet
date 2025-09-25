export interface Character {
  // Basic Information
  name: string;
  player: string;
  pointTotal: number;
  unspentPoints: number;
  height: string;
  weight: string;
  age: string;
  appearance: string;
  sizeModifier: number;
  techLevel: string;
  techLevelCost: number;

  // Attributes
  ST: number; // Strength
  DX: number; // Dexterity
  IQ: number; // Intelligence
  HT: number; // Health

  // Secondary Characteristics (derived from attributes)
  HP: number;     // Hit Points = ST + modifiers
  Will: number;   // Will = IQ + modifiers
  Per: number;    // Perception = IQ + modifiers
  FP: number;     // Fatigue Points = HT + modifiers

  // Movement & Speed
  basicSpeed: number;  // (DX + HT) / 4
  basicMove: number;   // Basic Speed (rounded down) + modifiers

  // Combat Stats
  basicLift: number;
  damageThrust: string;
  damageSwing: string;
  
  // Defense Modifiers
  dodgeModifier: number;
  parryModifier: number;
  blockModifier: number;
  
  // Encumbrance
  currentWeight: number;
  
  // Lists
  advantages: CharacterAdvantage[];
  disadvantages: CharacterDisadvantage[];
  skills: CharacterSkill[];
  equipment: Equipment[];
  spells: CharacterSpell[];
  
  // Social
  languages: CharacterLanguage[];
  status: CharacterStatus[];
  reputation: CharacterReputation[];
  culturalFamiliarities: CharacterCulturalFamiliarity[];
  
  // Reaction Modifiers
  reactionModifiers: ReactionModifier[];
  
  // New sections
  equipmentSimple: string[];
  campaignLore: string;
}

export interface CharacterAdvantage {
  id: string;
  name: string;
  cost: number;
  level?: number;
  description?: string;
  notes?: string;
}

export interface CharacterDisadvantage {
  id: string;
  name: string;
  cost: number; // negative value
  description?: string;
  notes?: string;
}

export interface CharacterSkill {
  id: string;
  name: string;
  attribute: 'ST' | 'DX' | 'IQ' | 'HT' | 'Will' | 'Per';
  difficulty: 'E' | 'A' | 'H' | 'VH'; // Easy, Average, Hard, Very Hard
  points: number;
  level: number;
  relativeLevel: string; // e.g., "DX+1", "IQ-2"
  modifier: number; // Custom modifier to final skill level
  description?: string;
  notes?: string;
}

export interface Equipment {
  id: string;
  name: string;
  weight: number;
  quantity: number;
  description?: string;
  notes?: string;
}

export interface ReactionModifier {
  id: string;
  source: string;
  modifier: number;
  description: string;
}

export interface CharacterLanguage {
  id: string;
  name: string;
  writtenLevel: 'None' | 'Broken' | 'Accented' | 'Native';
  spokenLevel: 'None' | 'Broken' | 'Accented' | 'Native';
  points: number;
  notes?: string;
}

export interface CharacterStatus {
  id: string;
  level: number;
  points: number;
  description?: string;
  notes?: string;
}

export interface CharacterReputation {
  id: string;
  description: string;
  modifier: number;
  scope: string;
  points: number;
  notes?: string;
}

export interface CharacterCulturalFamiliarity {
  id: string;
  name: string;
  points: number;
  notes?: string;
}

export interface CharacterSpell {
  id: string;
  name: string;
  class: string; // College/Class of magic
  skillLevel: number;
  timeToCast: string;
  duration: string;
  costToCast: string;
  costToMaintain: string;
  notes?: string;
  page?: string;
}

// Configuration types for predefined options
export interface PredefinedAdvantage {
  name: string;
  cost: number;
  description: string;
}

export interface PredefinedDisadvantage {
  name: string;
  cost: number;
  description: string;
}

export interface PredefinedSkill {
  name: string;
  attribute: 'ST' | 'DX' | 'IQ' | 'HT' | 'Will' | 'Per';
  difficulty: 'E' | 'A' | 'H' | 'VH';
  description: string;
}

export interface GurpsConfig {
  advantages: PredefinedAdvantage[];
  disadvantages: PredefinedDisadvantage[];
  skills: PredefinedSkill[];
}

// Encumbrance levels
export const ENCUMBRANCE_LEVELS = {
  NONE: { name: 'None', multiplier: 1, penalty: 0, dodgePenalty: 0 },
  LIGHT: { name: 'Light', multiplier: 2, penalty: -1, dodgePenalty: -1 },
  MEDIUM: { name: 'Medium', multiplier: 3, penalty: -2, dodgePenalty: -2 },
  HEAVY: { name: 'Heavy', multiplier: 6, penalty: -3, dodgePenalty: -3 },
  XHEAVY: { name: 'X-Heavy', multiplier: 10, penalty: -4, dodgePenalty: -4 }
};