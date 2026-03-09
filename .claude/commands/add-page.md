Utwórz nową stronę Next.js: $ARGUMENTS

Format argumentu: `[nazwa-strony] [domena]`
Przykład: `dashboard character` lub `profil auth`

Wykonaj:

1. Utwórz `src/app/[nazwa-strony]/page.tsx` jako Server Component
   - Sprawdź sesję przez `auth()` i redirect jeśli wymagane logowanie
   - Użyj layoutu zgodnego z design systemem (bg-primary, Cinzel nagłówki)
   - Zero logiki biznesowej — tylko kompozycja komponentów z domeny

2. Jeśli podano domenę, utwórz odpowiedni komponent w `src/domains/[domena]/components/`
   - Komponent kliencki tylko gdy potrzebny stan
   - Styl zgodny z design systemem projektu

3. Dodaj eksport do `src/domains/[domena]/components/index.ts`

4. Uruchom `npx tsc --noEmit` i napraw błędy

5. Podsumuj co utworzono i jak przejść do strony
