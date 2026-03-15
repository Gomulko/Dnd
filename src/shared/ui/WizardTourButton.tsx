"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { WIZARD_TOUR_STEPS } from "@/shared/lib/tour";

const STORAGE_KEY = "wizardTourCompleted";

export function WizardTourButton() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
  const startedRef = useRef(false);

  const steps = WIZARD_TOUR_STEPS[pathname];
  if (!steps) return null;

  async function startTour() {
    const { driver } = await import("driver.js");

    const filteredSteps = steps.filter((step) => {
      if (!step.element) return true;
      return !!document.querySelector(step.element as string);
    });

    const driverObj = driver({
      showProgress: true,
      progressText: "{{current}} / {{total}}",
      nextBtnText: "Dalej →",
      prevBtnText: "← Wstecz",
      doneBtnText: "Rozumiem!",
      steps: filteredSteps,
      onDestroyed: () => {
        localStorage.setItem(STORAGE_KEY, "true");
      },
    });

    driverObj.drive();
  }

  // Auto-start na pierwszej wizycie w kreatorze
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Tylko na pierwszym kroku kreatora
    if (pathname !== "/kreator/koncept") return;

    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      const timer = setTimeout(() => startTour(), 600);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      type="button"
      onClick={startTour}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Pokaż pomoc dla tego kroku"
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: hovered ? "#ffffff" : "#0a0a0a",
        border: "2px solid #0a0a0a",
        color: hovered ? "#0a0a0a" : "#ffffff",
        fontFamily: "var(--font-display), Georgia, serif",
        fontSize: 22,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        transition: "background 0.15s, color 0.15s",
        zIndex: 9999,
        lineHeight: 1,
      }}
    >
      ?
    </button>
  );
}
