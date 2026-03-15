import { RACES } from "@/data/dnd/races";
import { BACKGROUNDS } from "@/data/dnd/backgrounds";
import type { CreateCharacterInput } from "@/domains/character/actions/createCharacter";
import type { WizardStep1, WizardStep2, WizardStep3, WizardStep4, WizardStep5, WizardStep6, WizardStep7 } from "./wizardStore";

type WizardSnapshot = {
  step1: WizardStep1;
  step2: WizardStep2;
  step3: WizardStep3;
  step4: WizardStep4;
  step5: WizardStep5;
  step6: WizardStep6;
  step7: WizardStep7;
};

export function buildCharacterPayload(store: WizardSnapshot): CreateCharacterInput {
  const { step1, step2, step3, step4, step5, step6, step7 } = store;
  const race = RACES.find((r) => r.id === step2.race);
  const bg   = BACKGROUNDS.find((b) => b.id === step5.background);

  return {
    name:             step1.name,
    gender:           step1.gender,
    age:              step1.age,
    height:           step1.height,
    weight:           step1.weight ?? null,
    eyeColor:         step1.eyeColor || undefined,
    skinColor:        step1.skinColor || undefined,
    hairColor:        step1.hairColor || undefined,
    description:      step1.description,
    alignment:        step1.alignment,
    race:             step2.race,
    subrace:          step2.subrace,
    class:            step3.class,
    subclass:         step3.subclass,
    skills:           [...new Set([...step3.skills, ...(bg?.skillProficiencies ?? [])])],
    strength:         step4.strength || 10,
    dexterity:        step4.dexterity || 10,
    constitution:     step4.constitution || 10,
    intelligence:     step4.intelligence || 10,
    wisdom:           step4.wisdom || 10,
    charisma:         step4.charisma || 10,
    background:       step5.background,
    personalityTraits: step5.personalityTraits,
    ideals:           step5.ideals,
    bonds:            step5.bonds,
    flaws:            step5.flaws,
    languages: [
      ...(race?.languages.filter((l) => !l.includes("wg wyboru")) ?? []),
      ...step5.languages,
    ],
    backstory:        step5.backstory,
    allies:           step5.allies || undefined,
    treasure:         step5.treasure || undefined,
    equipment:        step6.equipment,
    gold:             step6.gold,
    cantrips:         step7.cantrips,
    spells:           step7.spells,
  };
}
