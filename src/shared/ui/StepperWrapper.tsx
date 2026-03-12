"use client";

import { usePathname } from "next/navigation";
import Stepper from "@/shared/ui/Stepper";
import { useWizardStore } from "@/domains/character/store/wizardStore";

const STEP_PATHS: Record<string, number> = {
  "/kreator/koncept": 1,
  "/kreator/rasa": 2,
  "/kreator/klasa": 3,
  "/kreator/cechy": 4,
  "/kreator/tlo": 5,
  "/kreator/ekwipunek": 6,
  "/kreator/magia": 7,
  "/kreator/gotowe": 8,
};

export default function StepperWrapper() {
  const pathname = usePathname();
  const currentStep = STEP_PATHS[pathname] ?? 1;

  const { step1, step2, step3, step4, step5 } = useWizardStore();

  function getMaxReachedStep(): number {
    if (!step1.name) return 1;
    if (!step2.race) return 2;
    if (!step3.class) return 3;
    const { strength, dexterity, constitution, intelligence, wisdom, charisma } = step4;
    if ([strength, dexterity, constitution, intelligence, wisdom, charisma].some((v) => v === 0)) return 4;
    if (!step5.background) return 5;
    return 8;
  }

  return <Stepper currentStep={currentStep} maxReachedStep={getMaxReachedStep()} />;
}
