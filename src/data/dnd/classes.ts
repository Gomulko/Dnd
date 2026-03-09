/**
 * ŹRÓDŁO PRAWDY — Klasy D&D
 * Źródło: SRD 5.2.1 (rules/rules.txt)
 * Wszystkie 12 klas pochodzi z SRD 5.2.1.
 */

export type StatKey = "str" | "dex" | "con" | "int" | "wis" | "cha";
export type SkillKey =
  | "acrobatics" | "arcana" | "athletics" | "deception" | "history"
  | "insight" | "intimidation" | "investigation" | "medicine" | "nature"
  | "perception" | "performance" | "persuasion" | "religion" | "sleightOfHand"
  | "stealth" | "survival" | "animalHandling";

export type ClassRole = "DAMAGE" | "TANK" | "SUPPORT" | "KONTROLA" | "HYBRID";

export interface Subclass {
  id: string;
  name: string;
  nameEn: string;
  description: string;
}

export interface ClassData {
  id: string;
  name: string;           // Polski
  nameEn: string;         // Angielski (SRD)
  description: string;
  role: ClassRole;
  hitDie: number;         // k6=6, k8=8, k10=10, k12=12
  primaryAbility: StatKey[];
  savingThrows: StatKey[];
  armorTraining: string[];
  weaponProficiencies: string;
  skillChoices: SkillKey[];
  skillCount: number;     // ile umiejętności do wyboru
  spellcasting: boolean;
  spellcastingAbility?: StatKey;
  subclasses: Subclass[];
  startingEquipmentA: string;
  startingEquipmentGold: number;
  icon: string;
  difficulty: 1 | 2 | 3; // 1=łatwa, 3=trudna
  synergies: string[];    // id ras z dobrą synergią
}

export const CLASSES: ClassData[] = [
  {
    id: "barbarian",
    name: "Barbarzyńca",
    nameEn: "Barbarian",
    description: "Nieustraszony wojownik napędzany pierwotną wściekłością",
    role: "DAMAGE",
    hitDie: 12,
    primaryAbility: ["str"],
    savingThrows: ["str", "con"],
    armorTraining: ["Lekka", "Średnia", "Tarcze"],
    weaponProficiencies: "Prosta i Bojowa",
    skillChoices: ["animalHandling", "athletics", "intimidation", "nature", "perception", "survival"],
    skillCount: 2,
    spellcasting: false,
    subclasses: [
      {
        id: "berserker",
        name: "Ścieżka Berserka",
        nameEn: "Path of the Berserker",
        description: "Kanalizuj wściekłość w brutalną furię walki",
      },
    ],
    startingEquipmentA: "Wielki topór, 4× Ręczny topór, Plecak Exploratora, 15 sz. złota",
    startingEquipmentGold: 75,
    icon: "🪓",
    difficulty: 1,
    synergies: ["half-orc", "human", "dwarf"],
  },
  {
    id: "bard",
    name: "Bard",
    nameEn: "Bard",
    description: "Mistrz słowa i muzyki, czerpiący magię z piękna",
    role: "HYBRID",
    hitDie: 8,
    primaryAbility: ["cha"],
    savingThrows: ["dex", "cha"],
    armorTraining: ["Lekka"],
    weaponProficiencies: "Prosta",
    skillChoices: ["acrobatics", "arcana", "athletics", "deception", "history", "insight",
      "intimidation", "investigation", "medicine", "nature", "perception", "performance",
      "persuasion", "religion", "sleightOfHand", "stealth", "survival", "animalHandling"],
    skillCount: 3,
    spellcasting: true,
    spellcastingAbility: "cha",
    subclasses: [
      {
        id: "lore",
        name: "Kolegium Wiedzy",
        nameEn: "College of Lore",
        description: "Zbieraj sekrety i zaklęcia z różnych tradycji",
      },
    ],
    startingEquipmentA: "Skórzana zbroja, 2× Sztylet, Instrument muzyczny, Plecak Entertainera, 19 sz. złota",
    startingEquipmentGold: 90,
    icon: "🎵",
    difficulty: 2,
    synergies: ["half-elf", "tiefling", "human"],
  },
  {
    id: "cleric",
    name: "Kleryk",
    nameEn: "Cleric",
    description: "Boskie Naczynie — Leczenie i Ochrona",
    role: "SUPPORT",
    hitDie: 8,
    primaryAbility: ["wis"],
    savingThrows: ["wis", "cha"],
    armorTraining: ["Lekka", "Średnia", "Tarcze"],
    weaponProficiencies: "Prosta",
    skillChoices: ["history", "insight", "medicine", "persuasion", "religion"],
    skillCount: 2,
    spellcasting: true,
    spellcastingAbility: "wis",
    subclasses: [
      {
        id: "life",
        name: "Domena Życia",
        nameEn: "Life Domain",
        description: "Uzdrawiaj sojuszników i chroń słabych",
      },
      {
        id: "knowledge",
        name: "Domena Wiedzy",
        nameEn: "Knowledge Domain",
        description: "Dostęp do tajemnej wiedzy i umysłów innych",
      },
      {
        id: "light",
        name: "Domena Światła",
        nameEn: "Light Domain",
        description: "Broń wiarą i boskim ogień",
      },
      {
        id: "nature",
        name: "Domena Natury",
        nameEn: "Nature Domain",
        description: "Połącz boską moc z siłami natury",
      },
      {
        id: "tempest",
        name: "Domena Burzy",
        nameEn: "Tempest Domain",
        description: "Kanalizuj gniew burzy i piorunów",
      },
      {
        id: "trickery",
        name: "Domena Oszustwa",
        nameEn: "Trickery Domain",
        description: "Iluzja i podstęp jako broń boska",
      },
      {
        id: "war",
        name: "Domena Wojny",
        nameEn: "War Domain",
        description: "Walcz jako mistrzowski wojownik boga",
      },
    ],
    startingEquipmentA: "Kolczuga, Tarcza, Maczuga, Symbol Święty, Plecak Kapłański, 7 sz. złota",
    startingEquipmentGold: 110,
    icon: "✝",
    difficulty: 2,
    synergies: ["elf", "dwarf", "half-elf"],
  },
  {
    id: "druid",
    name: "Druid",
    nameEn: "Druid",
    description: "Strażnik natury władający magią świata",
    role: "KONTROLA",
    hitDie: 8,
    primaryAbility: ["wis"],
    savingThrows: ["int", "wis"],
    armorTraining: ["Lekka", "Średnia (niemetalowa)", "Tarcze (niemetalowe)"],
    weaponProficiencies: "Wybrane proste",
    skillChoices: ["arcana", "animalHandling", "insight", "medicine", "nature", "perception", "religion", "survival"],
    skillCount: 2,
    spellcasting: true,
    spellcastingAbility: "wis",
    subclasses: [
      {
        id: "land",
        name: "Krąg Lądu",
        nameEn: "Circle of the Land",
        description: "Czerpij magię z konkretnego terenu naturalnego",
      },
    ],
    startingEquipmentA: "Skórzana zbroja, Tarcza, Sierp, Plecak Exploratora, Symbol Druidyczny, 9 sz. złota",
    startingEquipmentGold: 50,
    icon: "🌿",
    difficulty: 3,
    synergies: ["elf", "halfling", "gnome"],
  },
  {
    id: "fighter",
    name: "Wojownik",
    nameEn: "Fighter",
    description: "Wszechstronny mistrz walki wszelkimi bronią",
    role: "DAMAGE",
    hitDie: 10,
    primaryAbility: ["str", "dex"],
    savingThrows: ["str", "con"],
    armorTraining: ["Lekka", "Średnia", "Ciężka", "Tarcze"],
    weaponProficiencies: "Prosta i Bojowa",
    skillChoices: ["acrobatics", "animalHandling", "athletics", "history", "insight", "intimidation", "perception", "survival"],
    skillCount: 2,
    spellcasting: false,
    subclasses: [
      {
        id: "champion",
        name: "Mistrz",
        nameEn: "Champion",
        description: "Doskonał technikę walki do perfekcji",
      },
    ],
    startingEquipmentA: "Kolczuga, Tarcza, Miecz Długi, 8× Oszczep, Plecak Podróżnika, 4 sz. złota",
    startingEquipmentGold: 175,
    icon: "⚔",
    difficulty: 1,
    synergies: ["half-orc", "dwarf", "human"],
  },
  {
    id: "monk",
    name: "Mnich",
    nameEn: "Monk",
    description: "Mistrzowski wojownik ciała i umysłu z punktami Ki",
    role: "DAMAGE",
    hitDie: 8,
    primaryAbility: ["dex", "wis"],
    savingThrows: ["str", "dex"],
    armorTraining: [],
    weaponProficiencies: "Prosta, krótki miecz",
    skillChoices: ["acrobatics", "athletics", "history", "insight", "religion", "stealth"],
    skillCount: 2,
    spellcasting: false,
    subclasses: [
      {
        id: "open-hand",
        name: "Droga Otwartej Dłoni",
        nameEn: "Warrior of the Open Hand",
        description: "Mistrz walki wręcz i kontroli ciała",
      },
    ],
    startingEquipmentA: "Krótki miecz, 10× Oszczep, Plecak Eksploratora, 11 sz. złota",
    startingEquipmentGold: 50,
    icon: "👊",
    difficulty: 3,
    synergies: ["elf", "halfling", "human"],
  },
  {
    id: "paladin",
    name: "Paladyn",
    nameEn: "Paladin",
    description: "Święty wojownik napędzany boską przysięgą",
    role: "TANK",
    hitDie: 10,
    primaryAbility: ["str", "cha"],
    savingThrows: ["wis", "cha"],
    armorTraining: ["Lekka", "Średnia", "Ciężka", "Tarcze"],
    weaponProficiencies: "Prosta i Bojowa",
    skillChoices: ["athletics", "insight", "intimidation", "medicine", "persuasion", "religion"],
    skillCount: 2,
    spellcasting: true,
    spellcastingAbility: "cha",
    subclasses: [
      {
        id: "devotion",
        name: "Przysięga Pobożności",
        nameEn: "Oath of Devotion",
        description: "Chroń niewinnych i walcz ze złem",
      },
    ],
    startingEquipmentA: "Kolczuga, Tarcza, Miecz Długi, 6× Oszczep, Plecak Kapłański, Symbol Święty, 9 sz. złota",
    startingEquipmentGold: 150,
    icon: "🛡",
    difficulty: 2,
    synergies: ["half-elf", "human", "dwarf"],
  },
  {
    id: "ranger",
    name: "Łowca",
    nameEn: "Ranger",
    description: "Strażnik kresów, mistrz tropienia i łuku",
    role: "DAMAGE",
    hitDie: 10,
    primaryAbility: ["dex", "wis"],
    savingThrows: ["str", "dex"],
    armorTraining: ["Lekka", "Średnia", "Tarcze"],
    weaponProficiencies: "Prosta i Bojowa",
    skillChoices: ["animalHandling", "athletics", "insight", "investigation", "nature", "perception", "stealth", "survival"],
    skillCount: 3,
    spellcasting: true,
    spellcastingAbility: "wis",
    subclasses: [
      {
        id: "hunter",
        name: "Łowca",
        nameEn: "Hunter",
        description: "Specjalizuj się w polowaniu na konkretne typy wrogów",
      },
    ],
    startingEquipmentA: "Kolczuga z kółek, 2× Krótki miecz, Długi łuk, 20× Strzały, Kołczan, Plecak Exploratora, 7 sz. złota",
    startingEquipmentGold: 150,
    icon: "🏹",
    difficulty: 2,
    synergies: ["elf", "halfling", "half-orc"],
  },
  {
    id: "rogue",
    name: "Łotrzyk",
    nameEn: "Rogue",
    description: "Skryty mistrz podstępu i skrytobójstwa",
    role: "DAMAGE",
    hitDie: 8,
    primaryAbility: ["dex"],
    savingThrows: ["dex", "int"],
    armorTraining: ["Lekka"],
    weaponProficiencies: "Prosta, ręczna kusza, długi miecz, rapier, krótki miecz",
    skillChoices: ["acrobatics", "athletics", "deception", "insight", "intimidation",
      "investigation", "perception", "performance", "persuasion", "sleightOfHand", "stealth"],
    skillCount: 4,
    spellcasting: false,
    subclasses: [
      {
        id: "thief",
        name: "Złodziej",
        nameEn: "Thief",
        description: "Mistrz kradzieży, infiltracji i skrytego ruchu",
      },
    ],
    startingEquipmentA: "Skórzana zbroja, 2× Sztylet, Krótki miecz, Złodziejskie narzędzia, Plecak Włamywacza, 8 sz. złota",
    startingEquipmentGold: 100,
    icon: "🗡",
    difficulty: 2,
    synergies: ["halfling", "elf", "tiefling"],
  },
  {
    id: "sorcerer",
    name: "Czarownik",
    nameEn: "Sorcerer",
    description: "Wrodzona moc magiczna płynąca z krwi",
    role: "KONTROLA",
    hitDie: 6,
    primaryAbility: ["cha"],
    savingThrows: ["con", "cha"],
    armorTraining: [],
    weaponProficiencies: "Prosta",
    skillChoices: ["arcana", "deception", "insight", "intimidation", "persuasion", "religion"],
    skillCount: 2,
    spellcasting: true,
    spellcastingAbility: "cha",
    subclasses: [
      {
        id: "draconic",
        name: "Smocze Dziedzictwo",
        nameEn: "Draconic Sorcery",
        description: "Moc smoczej krwi wzmacnia twoją magię",
      },
    ],
    startingEquipmentA: "2× Sztylet, Laska Arcańska, Plecak Dungeonera, 28 sz. złota",
    startingEquipmentGold: 50,
    icon: "✨",
    difficulty: 2,
    synergies: ["dragonborn", "tiefling", "half-elf"],
  },
  {
    id: "warlock",
    name: "Warlock",
    nameEn: "Warlock",
    description: "Pakt z potężnym patronem w zamian za magię",
    role: "KONTROLA",
    hitDie: 8,
    primaryAbility: ["cha"],
    savingThrows: ["wis", "cha"],
    armorTraining: ["Lekka"],
    weaponProficiencies: "Prosta",
    skillChoices: ["arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"],
    skillCount: 2,
    spellcasting: true,
    spellcastingAbility: "cha",
    subclasses: [
      {
        id: "fiend",
        name: "Patron — Diabeł",
        nameEn: "Fiend Patron",
        description: "Pakt z potężnym diabłem z Piekieł",
      },
    ],
    startingEquipmentA: "Skórzana zbroja, Prosta broń ×2, Laska Arcańska, Plecak Dungeonera, 15 sz. złota",
    startingEquipmentGold: 100,
    icon: "🔮",
    difficulty: 3,
    synergies: ["tiefling", "half-elf", "gnome"],
  },
  {
    id: "wizard",
    name: "Czarodziej",
    nameEn: "Wizard",
    description: "Mistrz nauki magii i potężnych zaklęć",
    role: "KONTROLA",
    hitDie: 6,
    primaryAbility: ["int"],
    savingThrows: ["int", "wis"],
    armorTraining: [],
    weaponProficiencies: "Prosta",
    skillChoices: ["arcana", "history", "insight", "investigation", "medicine", "religion"],
    skillCount: 2,
    spellcasting: true,
    spellcastingAbility: "int",
    subclasses: [
      {
        id: "evoker",
        name: "Ewokator",
        nameEn: "Evoker",
        description: "Specjalizuj się w niszczycielskich zaklęciach magii siły",
      },
    ],
    startingEquipmentA: "Laska Arcańska, Plecak Scholarza, Księga Czarów, 5 sz. złota",
    startingEquipmentGold: 50,
    icon: "📖",
    difficulty: 3,
    synergies: ["elf", "gnome", "tiefling"],
  },
];

export const SKILL_NAMES_PL: Record<SkillKey, string> = {
  acrobatics: "Akrobatyka",
  arcana: "Arcana",
  athletics: "Atletyka",
  deception: "Podstęp",
  history: "Historia",
  insight: "Wnikliwość",
  intimidation: "Zastraszanie",
  investigation: "Badanie",
  medicine: "Medycyna",
  nature: "Natura",
  perception: "Percepcja",
  performance: "Występy",
  persuasion: "Perswazja",
  religion: "Religia",
  sleightOfHand: "Zręczność Dłoni",
  stealth: "Ukrywanie",
  survival: "Przetrwanie",
  animalHandling: "Obsługa Zwierząt",
};

export function getClassById(id: string): ClassData | undefined {
  return CLASSES.find((c) => c.id === id);
}

export function getSubclassById(classId: string, subclassId: string): Subclass | undefined {
  return getClassById(classId)?.subclasses.find((s) => s.id === subclassId);
}

export function getClassesByRole(role: ClassRole): ClassData[] {
  return CLASSES.filter((c) => c.role === role);
}
