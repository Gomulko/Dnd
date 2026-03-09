Zrób code review pliku lub folderu: $ARGUMENTS

Przeczytaj wskazany plik/folder i oceń go według zasad projektu z CLAUDE.md:

**Sprawdź:**

1. **DDD** — czy logika jest w odpowiedniej domenie? Czy nie ma logiki biznesowej w `app/`?
2. **TypeScript** — brak `any`, typy inferowane z Zod, poprawne `Promise<T>`
3. **Server Actions** — czy mają `"use server"`, walidację Zod, zwracają `{ error }` zamiast rzucać wyjątki
4. **Komponenty** — czy `"use client"` jest używane tylko gdy potrzebne? Czy Server Components są domyślne?
5. **Design system** — czy używane są kolory i wartości z design systemu? Brak hardcodowanych kolorów spoza palety
6. **Język** — czy wszystkie teksty UI są po polsku?
7. **Bezpieczeństwo** — brak SQL injection, XSS, eksponowania haseł/sekretów
8. **Nazewnictwo** — zgodne z konwencjami z CLAUDE.md

**Format odpowiedzi:**
- ✅ Co jest dobrze
- ⚠️ Co wymaga uwagi (z konkretną linią)
- ❌ Co jest błędem (z propozycją poprawki)

Zaproponuj gotowy kod dla wszystkich znalezionych problemów.
