/**
 * D&D 5e SRD 5.2.1 — Mechaniki gry
 * Źródło: rules/rules.txt (CC-BY-4.0)
 */

/** Modyfikator cechy jako liczba: floor((score - 10) / 2) */
export function modNum(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Modyfikator cechy jako string ze znakiem: "+3", "-1", "0" */
export function mod(score: number): string {
  const m = modNum(score);
  return m >= 0 ? `+${m}` : `${m}`;
}

/** Bonus biegłości wg poziomu (Character Advancement table SRD) */
export function profBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

/**
 * Maksymalne HP wg SRD:
 * Level 1 = hitDie + conMod
 * Kolejne = +floor(hitDie/2)+1+conMod każdy poziom
 * Minimum = 1
 */
export function maxHp(hitDie: number, level: number, conMod: number): number {
  const first = hitDie + conMod;
  const subsequent = (level - 1) * (Math.floor(hitDie / 2) + 1 + conMod);
  return Math.max(1, first + subsequent);
}

/** Klasa Pancerza bez zbroi: 10 + DEX mod */
export function unarmoredAC(dex: number): number {
  return 10 + modNum(dex);
}

/** Bierna Percepcja: 10 + WIS mod [+ PB jeśli biegły] */
export function passivePerception(wis: number, proficient: boolean, level: number): number {
  return 10 + modNum(wis) + (proficient ? profBonus(level) : 0);
}

/** Spell Save DC: 8 + spellcasting ability mod + PB */
export function spellSaveDC(abilityScore: number, level: number): number {
  return 8 + modNum(abilityScore) + profBonus(level);
}

/** Spell Attack Bonus: spellcasting ability mod + PB */
export function spellAttackBonus(abilityScore: number, level: number): number {
  return modNum(abilityScore) + profBonus(level);
}

/** Rzut obronny: ability mod + PB (jeśli biegły) */
export function savingThrow(abilityScore: number, proficient: boolean, level: number): number {
  return modNum(abilityScore) + (proficient ? profBonus(level) : 0);
}

/** Bonus umiejętności: ability mod + PB (jeśli biegły) */
export function skillBonus(abilityScore: number, proficient: boolean, level: number): number {
  return modNum(abilityScore) + (proficient ? profBonus(level) : 0);
}
