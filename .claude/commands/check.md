Sprawdź jakość kodu w projekcie. Wykonaj kolejno:

1. **TypeScript** — uruchom `npx tsc --noEmit` i wylistuj wszystkie błędy
2. **ESLint** — uruchom `npm run lint` i wylistuj ostrzeżenia/błędy
3. **Struktura DDD** — sprawdź czy wszystkie domeny w `src/domains/` mają:
   - `actions/index.ts`
   - `components/index.ts`
   - `schemas/index.ts`
   - `types/index.ts`
4. **Importy** — sprawdź czy żadna domena nie importuje bezpośrednio z innej domeny (tylko przez `shared/`)
5. **"use client"** — sprawdź czy komponenty z `"use client"` nie importują server-only kodu

Po sprawdzeniu:
- Podsumuj znalezione problemy w punktach
- Zaproponuj konkretne poprawki dla każdego problemu
- Napraw automatycznie tylko bezpieczne, oczywiste błędy (literówki, brakujące eksporty)
- Zapytaj o zgodę przed większymi zmianami
