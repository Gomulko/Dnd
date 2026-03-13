"use client";

import { useEffect, useState } from "react";
import { QuickActionLink } from "./QuickActionLink";

type Props = {
  fallbackId?: string;
  fallbackName?: string;
};

export function KontynuujSesjeLink({ fallbackId, fallbackName }: Props) {
  const [href, setHref] = useState(fallbackId ? `/karta/${fallbackId}` : "/kreator");
  const [desc, setDesc] = useState(fallbackName ? `Ostatnia: ${fallbackName}` : "Brak aktywnych postaci");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lastVisitedCharacter");
      if (stored) {
        const { id, name } = JSON.parse(stored) as { id: string; name: string };
        setHref(`/karta/${id}`);
        setDesc(`Ostatnia: ${name}`);
      }
    } catch {
      // ignoruj
    }
  }, []);

  return <QuickActionLink title="Kontynuuj Sesję" desc={desc} href={href} />;
}
