import { Character, CharacterSkill, ENCUMBRANCE_LEVELS } from '@/types/character';

// Calculate Basic Lift from ST
export const calculateBasicLift = (ST: number): number => {
  return Math.floor((ST * ST) / 5);
};

// Calculate Basic Speed from DX and HT
export const calculateBasicSpeed = (DX: number, HT: number): number => {
  return Math.floor(((DX + HT) / 4) * 4) / 4; // Round down to nearest 0.25
};

// Calculate damage from ST
export const calculateDamage = (ST: number) => {
  const thrust = Math.floor(ST / 6);
  const swing = Math.floor(ST / 3);
  
  const thrustDice = thrust >= 1 ? thrust : 1;
  const swingDice = swing >= 1 ? swing : 1;
  
  const thrustMod = ST % 6 >= 3 ? '+1' : ST % 6 >= 1 ? '' : '-1';
  const swingMod = ST % 3 >= 2 ? '+2' : ST % 3 >= 1 ? '+1' : '';
  
  return {
    thrust: `${thrustDice}d${thrustMod}`,
    swing: `${swingDice}d${swingMod}`
  };
};

// Calculate skill level from points invested
export const calculateSkillLevel = (
  skill: CharacterSkill,
  character: Character
): { level: number; relativeLevel: string } => {
  const baseAttribute = getAttributeValue(skill.attribute, character);
  let level = baseAttribute;
  
  // Calculate level based on difficulty and points
  const difficultyModifier = getDifficultyModifier(skill.difficulty);
  
  if (skill.points === 0) {
    level = baseAttribute + difficultyModifier;
  } else if (skill.points === 1) {
    level = baseAttribute + difficultyModifier;
  } else if (skill.points === 2) {
    level = baseAttribute + difficultyModifier + 1;
  } else if (skill.points === 4) {
    level = baseAttribute + difficultyModifier + 2;
  } else if (skill.points >= 8) {
    const extraLevels = Math.floor(Math.log2(skill.points / 4));
    level = baseAttribute + difficultyModifier + 2 + extraLevels;
  }
  
  const relativeDifference = level - baseAttribute;
  const relativeLevel = `${skill.attribute}${relativeDifference >= 0 ? '+' : ''}${relativeDifference}`;
  
  return { level, relativeLevel };
};

const getAttributeValue = (attribute: string, character: Character): number => {
  switch (attribute) {
    case 'ST': return character.ST;
    case 'DX': return character.DX;
    case 'IQ': return character.IQ;
    case 'HT': return character.HT;
    case 'Will': return character.Will;
    case 'Per': return character.Per;
    default: return 10;
  }
};

const getDifficultyModifier = (difficulty: string): number => {
  switch (difficulty) {
    case 'E': return 0;  // Easy
    case 'A': return -1; // Average
    case 'H': return -2; // Hard
    case 'VH': return -3; // Very Hard
    default: return -1;
  }
};

// Calculate encumbrance level
export const calculateEncumbrance = (character: Character) => {
  const basicLift = calculateBasicLift(character.ST);
  const currentWeight = character.currentWeight;
  
  if (currentWeight <= basicLift) return ENCUMBRANCE_LEVELS.NONE;
  if (currentWeight <= basicLift * 2) return ENCUMBRANCE_LEVELS.LIGHT;
  if (currentWeight <= basicLift * 3) return ENCUMBRANCE_LEVELS.MEDIUM;
  if (currentWeight <= basicLift * 6) return ENCUMBRANCE_LEVELS.HEAVY;
  return ENCUMBRANCE_LEVELS.XHEAVY;
};

// Calculate dodge score
export const calculateDodge = (character: Character): number => {
  const baseDodge = Math.floor(character.basicSpeed) + 3;
  const encumbrance = calculateEncumbrance(character);
  return baseDodge + encumbrance.dodgePenalty + (character.dodgeModifier || 0);
};

// Calculate basic move
export const calculateBasicMove = (character: Character): number => {
  const baseMove = Math.floor(character.basicSpeed) + (character.basicMove - Math.floor(character.basicSpeed));
  const encumbrance = calculateEncumbrance(character);
  return Math.floor(baseMove * (encumbrance.multiplier === 1 ? 1 : 
    encumbrance.multiplier === 2 ? 0.8 :
    encumbrance.multiplier === 3 ? 0.6 :
    encumbrance.multiplier === 6 ? 0.4 : 0.2));
};

// Calculate total character points
export const calculateTotalPoints = (character: Character): number => {
  // Attribute costs (10 is baseline, costs 10 points per level above 10)
  const attributeCost = 
    (character.ST - 10) * 10 +
    (character.DX - 10) * 20 + // DX costs more
    (character.IQ - 10) * 20 + // IQ costs more
    (character.HT - 10) * 10;
  
  // Secondary characteristic costs
  const baseBasicSpeed = calculateBasicSpeed(character.DX, character.HT);
  const baseBasicMove = Math.floor(baseBasicSpeed);
  
  const secondaryCost = 
    (character.HP - character.ST) * 2 +
    (character.Will - character.IQ) * 5 +
    (character.Per - character.IQ) * 5 +
    (character.FP - character.HT) * 3 +
    Math.round((character.basicSpeed - baseBasicSpeed) * 20) + // 5 pts per 0.25
    (character.basicMove - baseBasicMove) * 5;
  
  // Advantages cost
  const advantagesCost = character.advantages.reduce((sum, adv) => {
    return sum + (adv.cost * (adv.level || 1));
  }, 0);
  
  // Disadvantages cost (negative)
  const disadvantagesCost = character.disadvantages.reduce((sum, dis) => {
    return sum + dis.cost; // Already negative
  }, 0);
  
  // Skills cost
  const skillsCost = character.skills.reduce((sum, skill) => sum + skill.points, 0);
  
  return attributeCost + secondaryCost + advantagesCost + disadvantagesCost + skillsCost;
};