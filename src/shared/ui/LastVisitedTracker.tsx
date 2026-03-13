"use client";

import { useEffect } from "react";

type Props = { id: string; name: string };

export function LastVisitedTracker({ id, name }: Props) {
  useEffect(() => {
    localStorage.setItem("lastVisitedCharacter", JSON.stringify({ id, name }));
  }, [id, name]);

  return null;
}
