"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ── Types ─────────────────────────────────────────────────────────────────────

export type WizardStep1 = {
  name: string;
  gender: "kobieta" | "mezczyzna" | "inne";
  age: number | null;
  height: number | null;
  weight: number | null;
  eyeColor: string;
  skinColor: string;
  hairColor: string;
  description: string;
  alignment: "LG" | "NG" | "CG" | "LN" | "TN" | "CN" | "LE" | "NE" | "CE";
};

export type WizardStep2 = {
  race: string;
  subrace: string | null;
};

export type WizardStep3 = {
  class: string;
  subclass: string | null;
  skills: string[];
};

export type WizardStep4 = {
  method: "standard" | "pointbuy" | "roll";
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type WizardStep5 = {
  background: string;
  personalityTraits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
  languages: string[];
  backstory: string;
  allies: string;
  treasure: string;
};

export type WizardStep6 = {
  equipment: { name: string; qty: number; weight: number }[];
  gold: number;
};

export type WizardStep7 = {
  cantrips: string[];
  spells: string[];
};

export type WizardData = {
  step1: WizardStep1;
  step2: WizardStep2;
  step3: WizardStep3;
  step4: WizardStep4;
  step5: WizardStep5;
  step6: WizardStep6;
  step7: WizardStep7;
};

type WizardStore = WizardData & {
  editingId: string | null;
  setStep1: (data: Partial<WizardStep1>) => void;
  setStep2: (data: Partial<WizardStep2>) => void;
  setStep3: (data: Partial<WizardStep3>) => void;
  setStep4: (data: Partial<WizardStep4>) => void;
  setStep5: (data: Partial<WizardStep5>) => void;
  setStep6: (data: Partial<WizardStep6>) => void;
  setStep7: (data: Partial<WizardStep7>) => void;
  setEditingId: (id: string | null) => void;
  loadCharacter: (data: WizardData, id: string) => void;
  reset: () => void;
};

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_STEP1: WizardStep1 = {
  name: "",
  gender: "inne",
  age: null,
  height: null,
  weight: null,
  eyeColor: "",
  skinColor: "",
  hairColor: "",
  description: "",
  alignment: "TN",
};

const DEFAULT_STEP2: WizardStep2 = {
  race: "",
  subrace: null,
};

const DEFAULT_STEP3: WizardStep3 = {
  class: "",
  subclass: null,
  skills: [],
};

// Standard Array defaults — stats=0 means "not selected yet"
const DEFAULT_STEP4: WizardStep4 = {
  method: "standard",
  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0,
};

const DEFAULT_STEP5: WizardStep5 = {
  background: "",
  personalityTraits: [],
  ideals: [],
  bonds: [],
  flaws: [],
  languages: [],
  backstory: "",
  allies: "",
  treasure: "",
};

const DEFAULT_STEP6: WizardStep6 = {
  equipment: [],
  gold: 0,
};

const DEFAULT_STEP7: WizardStep7 = {
  cantrips: [],
  spells: [],
};

const DEFAULTS: WizardData = {
  step1: DEFAULT_STEP1,
  step2: DEFAULT_STEP2,
  step3: DEFAULT_STEP3,
  step4: DEFAULT_STEP4,
  step5: DEFAULT_STEP5,
  step6: DEFAULT_STEP6,
  step7: DEFAULT_STEP7,
};

// ── Store ─────────────────────────────────────────────────────────────────────

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      editingId: null,

      setStep1: (data) =>
        set((s) => ({ step1: { ...s.step1, ...data } })),
      setStep2: (data) =>
        set((s) => ({ step2: { ...s.step2, ...data } })),
      setStep3: (data) =>
        set((s) => ({ step3: { ...s.step3, ...data } })),
      setStep4: (data) =>
        set((s) => ({ step4: { ...s.step4, ...data } })),
      setStep5: (data) =>
        set((s) => ({ step5: { ...s.step5, ...data } })),
      setStep6: (data) =>
        set((s) => ({ step6: { ...s.step6, ...data } })),
      setStep7: (data) =>
        set((s) => ({ step7: { ...s.step7, ...data } })),

      setEditingId: (id) => set({ editingId: id }),

      loadCharacter: (data, id) =>
        set({ ...data, editingId: id }),

      reset: () => set({ ...DEFAULTS, editingId: null }),
    }),
    {
      name: "wizard-character",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
