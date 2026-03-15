"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { buildCharacterPayload } from "@/domains/character/store/buildCharacterPayload";
import { createCharacter } from "@/domains/character/actions/createCharacter";

const STORAGE_KEY = "guest-wizard-character";

export function GuestCharacterSaver() {
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    let cancelled = false;

    async function save() {
      try {
        const storeState = JSON.parse(raw!);
        const payload = buildCharacterPayload(storeState);
        await createCharacter(payload);
        localStorage.removeItem(STORAGE_KEY);
        if (!cancelled) router.refresh();
      } catch (e) {
        console.error("Nie udało się zapisać postaci gościa:", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    void save();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
