"use client";

import { usePathname } from "next/navigation";
import Stepper from "@/shared/ui/Stepper";

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
  return <Stepper currentStep={currentStep} />;
}
