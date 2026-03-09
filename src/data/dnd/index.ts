/**
 * D&D 5e SRD 5.2.1 — Source of Truth barrel export
 * Import from here instead of individual files.
 *
 * @example
 * import { races, classes, backgrounds, allSpells } from "@/data/dnd";
 * import type { Race, ClassData, Background, Spell } from "@/data/dnd";
 */

// Races
export type { Race, Subrace, RacialTrait, StatKey } from "./races";
export {
  RACES,
  getRaceById,
  getSubraceById,
} from "./races";

// Classes
export type { ClassData, Subclass, ClassRole, SkillKey } from "./classes";
export {
  CLASSES,
  SKILL_NAMES_PL,
  getClassById,
  getClassesByRole,
} from "./classes";

// Backgrounds
export type { Background, PersonalityOption } from "./backgrounds";
export {
  BACKGROUNDS,
  getBackgroundById,
} from "./backgrounds";

// Spells
export type { Spell, SpellSchool, SpellComponent } from "./spells";
export {
  cantrips,
  spellsLevel1,
  allSpells,
  getSpellById,
  getSpellsByClass,
  getCantripsForClass,
  getLevel1SpellsForClass,
  getSpellsBySchool,
  getRitualSpells,
} from "./spells";
