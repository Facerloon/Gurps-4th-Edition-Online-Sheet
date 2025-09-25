import { Character } from '@/types/character';

// Helper function to generate filename
const generateFilename = (character: Character, extension: string): string => {
  const name = character.name || 'Character';
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  return `${name}_${timestamp}.${extension}`;
};

// Save character as JSON
export const saveCharacterAsJSON = (character: Character, filename?: string): void => {
  const jsonData = JSON.stringify(character, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || generateFilename(character, 'json');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Convert array of objects to pipe-separated string
const arrayToString = (arr: any[]): string => {
  return arr.map(item => {
    const pairs = Object.entries(item).map(([key, value]) => `${key}:${value}`);
    return pairs.join('§');
  }).join('|');
};

// Save character as CSV
export const saveCharacterAsCSV = (character: Character, filename?: string): void => {
  const headers = [
    'name', 'player', 'pointTotal', 'unspentPoints', 'height', 'weight', 'age', 'appearance',
    'sizeModifier', 'techLevel', 'techLevelCost', 'ST', 'DX', 'IQ', 'HT', 'HP', 'Will', 'Per', 'FP',
    'basicSpeed', 'basicMove', 'basicLift', 'damageThrust', 'damageSwing', 'dodgeModifier',
    'parryModifier', 'blockModifier', 'currentWeight', 'advantages', 'disadvantages', 'skills',
    'equipment', 'languages', 'status', 'reputation', 'culturalFamiliarities', 'reactionModifiers'
  ];

  const values = [
    character.name, character.player, character.pointTotal, character.unspentPoints,
    character.height, character.weight, character.age, character.appearance,
    character.sizeModifier, character.techLevel, character.techLevelCost,
    character.ST, character.DX, character.IQ, character.HT, character.HP, character.Will, character.Per, character.FP,
    character.basicSpeed, character.basicMove, character.basicLift, character.damageThrust, character.damageSwing,
    character.dodgeModifier, character.parryModifier, character.blockModifier, character.currentWeight,
    arrayToString(character.advantages), arrayToString(character.disadvantages), arrayToString(character.skills),
    arrayToString(character.equipment), arrayToString(character.languages), arrayToString(character.status),
    arrayToString(character.reputation), arrayToString(character.culturalFamiliarities), arrayToString(character.reactionModifiers)
  ];

  const csvContent = [headers.join(','), values.map(v => `"${v}"`).join(',')].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || generateFilename(character, 'csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Convert pipe-separated string back to array of objects
const stringToArray = (str: string): any[] => {
  if (!str || str.trim() === '') return [];
  
  return str.split('|').map(item => {
    const obj: any = {};
    item.split('§').forEach(pair => {
      const [key, value] = pair.split(':');
      if (key && value !== undefined) {
        // Try to parse numbers
        const numValue = Number(value);
        obj[key] = !isNaN(numValue) && value !== '' ? numValue : value;
      }
    });
    return obj;
  });
};

// Load character from JSON
export const loadCharacterFromJSON = async (file: File): Promise<Character> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const validatedCharacter = validateCharacterData(data);
        resolve(validatedCharacter);
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Load character from CSV
export const loadCharacterFromCSV = async (file: File): Promise<Character> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const lines = csvText.trim().split('\n');
        
        if (lines.length < 2) {
          throw new Error('Invalid CSV format: missing data');
        }

        const headers = lines[0].split(',');
        const values = lines[1].split(',').map(v => v.replace(/^"|"$/g, ''));

        const data: any = {};
        headers.forEach((header, index) => {
          const value = values[index];
          
          // Handle array fields
          if (['advantages', 'disadvantages', 'skills', 'equipment', 'languages', 'status', 'reputation', 'culturalFamiliarities', 'reactionModifiers'].includes(header)) {
            data[header] = stringToArray(value);
          } else {
            // Try to parse numbers
            const numValue = Number(value);
            data[header] = !isNaN(numValue) && value !== '' ? numValue : value;
          }
        });

        const validatedCharacter = validateCharacterData(data);
        resolve(validatedCharacter);
      } catch (error) {
        reject(new Error('Invalid CSV format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Validate and fill missing character data
export const validateCharacterData = (data: any): Character => {
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

  // Merge with defaults, ensuring all required fields exist
  const character: Character = { ...defaultCharacter, ...data };

  // Ensure arrays are arrays and add IDs if missing
  const ensureArrayWithIds = (arr: any[]): any[] => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => ({
      ...item,
      id: item.id || crypto.randomUUID()
    }));
  };

  character.advantages = ensureArrayWithIds(character.advantages);
  character.disadvantages = ensureArrayWithIds(character.disadvantages);
  character.skills = ensureArrayWithIds(character.skills);
  character.equipment = ensureArrayWithIds(character.equipment);
  character.languages = ensureArrayWithIds(character.languages);
  character.status = ensureArrayWithIds(character.status);
  character.reputation = ensureArrayWithIds(character.reputation);
  character.culturalFamiliarities = ensureArrayWithIds(character.culturalFamiliarities);
  character.reactionModifiers = ensureArrayWithIds(character.reactionModifiers);

  return character;
};