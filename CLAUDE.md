# Kroniki Przygód — Zasady projektu

## Stack

- **Next.js 14** — App Router, Server Components domyślnie
- **TypeScript** — strict mode, brak `any`
- **Tailwind CSS** + inline styles dla pixel-perfect komponentów
- **Prisma v6** + SQLite (dev) / Postgres (prod)
- **NextAuth.js v5 (beta)** — JWT sessions, Credentials provider
- **Zod** — walidacja wszystkich danych wejściowych
- **bcryptjs** — hashowanie haseł
- **Playwright** — testy E2E, uruchamiane po każdym ukończonym zadaniu

---

## Testy E2E (Playwright)

- Testy w `tests/` (foldery wg domeny: `auth/`, `dashboard/`, `kreator/`)
- Każdy plik: `[feature].spec.ts`
- Konto testowe: `test@kroniki.pl` / `Test1234!` (seed bazy)
- Base URL: `http://localhost:3000`
- **Po każdym ukończonym zadaniu** — napisz test i uruchom: `npx playwright test`
- Testy muszą przechodzić przed przejściem do następnego zadania

### Konwencje testów
```ts
// ✅ Dobrze — opisowe, po polsku
test("logowanie z poprawnymi danymi przekierowuje na dashboard", async ({ page }) => { ... });

// ✅ Reużywaj helper loginAs() zamiast powtarzać logowanie
await loginAs(page, "test@kroniki.pl", "Test1234!");
```

### Dostępne skrypty
```bash
npx playwright test              # wszystkie testy headless
npx playwright test tests/auth/  # tylko auth
npx playwright test --headed     # z oknem przeglądarki
npx playwright show-report       # raport HTML
```

---

## Architektura — Domain Driven Design

```
src/
  domains/
    auth/               ← rejestracja, logowanie, sesja
      actions/          ← Server Actions ("use server")
      components/       ← React komponenty domeny
      schemas/          ← Zod schematy
      types/            ← TypeScript typy domeny
    character/          ← tworzenie, wybór, rozwijanie postaci
      actions/
      components/
      schemas/
      types/
    [nowa-domena]/      ← każda nowa funkcja = nowa domena
  shared/
    ui/                 ← współdzielone komponenty UI
    lib/
      prisma.ts         ← singleton PrismaClient
      auth.ts           ← NextAuth config
  app/                  ← Next.js routing (cienka warstwa)
    logowanie/
    rejestracja/
    dashboard/
    api/auth/[...nextauth]/
```

### Zasady DDD

- Każda domena jest **izolowana** — nie importuje z innych domen bezpośrednio
- Komunikacja między domenami przez `shared/` lub przez props/events
- `app/` tylko routuje i kompozycjonuje — zero logiki biznesowej w page.tsx
- Server Actions w `domains/[domena]/actions/` — nigdy w `app/`
- Typy domenowe w `domains/[domena]/types/` — nigdy globalne bez powodu
- Każdy folder domeny eksportuje przez `index.ts`

---

## TypeScript

- Strict mode — brak `any`, brak `as unknown` bez uzasadnienia
- Typy inferowane z Zod schematów: `z.infer<typeof schema>`
- Props komponentów zawsze typowane inline lub jako `type Props = {...}`
- Funkcje asynchroniczne zawsze z `Promise<T>` zwracanym typem
- Używaj `type` zamiast `interface` (chyba że potrzebna dziedziczenie)

```ts
// ✅ Dobrze
export type LoginInput = z.infer<typeof loginSchema>;
export async function loginUser(input: LoginInput): Promise<{ error?: string }> {}

// ❌ Źle
export async function loginUser(input: any) {}
```

---

## Server Actions

- Zawsze `"use server"` na górze pliku
- Zawsze waliduj przez Zod przed jakąkolwiek operacją
- Zwracaj `{ error: string }` lub `{ success: true, data?: T }`
- Nigdy nie rzucaj wyjątków do klienta — obsłuż błędy i zwróć obiekt

```ts
"use server";
export async function createCharacter(input: CreateCharacterInput) {
  const parsed = createCharacterSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  // ...
  return { success: true, data: character };
}
```

---

## Komponenty

- Server Components domyślnie — `"use client"` tylko gdy potrzebny stan/event
- Nazwy PascalCase, pliki kebab-case lub PascalCase
- Jeden komponent per plik
- Nie importuj server-only kodu w `"use client"` komponentach

```ts
// ✅ Server Component (domyślnie)
export default async function CharacterList() {
  const characters = await getCharacters();
  return <ul>...</ul>;
}

// ✅ Client Component — tylko gdy potrzebny useState/useEffect
"use client";
export function PasswordInput() {
  const [show, setShow] = useState(false);
  return <input type={show ? "text" : "password"} />;
}
```

---

## Design System

### Kolory (TYLKO te)
```
bg-primary:       #0f0e17
bg-secondary:     #1a1825
bg-elevated:      #232136
border:           #2e2b3d
accent-gold:      #c9a84c
accent-gold-light:#e8c97a
accent-red:       #e05252
accent-green:     #52c97a
accent-purple:    #7c5cbf
text-primary:     #f0ece4
text-secondary:   #8b8699
text-muted:       #4a4759
```

### Typografia
- Nagłówki: `fontFamily: "Cinzel, serif"` — fantasy, elegancki
- Body/UI: `fontFamily: "Inter, sans-serif"` — clean

### Stałe wartości
- Border radius kart: `12px`
- Border radius inputów: `8px`
- Border radius przycisków: `6-8px`
- Padding kart: `32px`
- Box shadow: `0 4px 24px rgba(0,0,0,0.4)`
- Złota linia dekoracyjna: `linear-gradient(90deg, #C9A84C 0%, rgba(201,168,76,0.2) 100%)`

### Przyciski
```
Primary:   background: linear-gradient(135deg, #C9A84C 0%, #B8943C 100%)
           color: #1A1408, fontWeight: 700
Secondary: background: transparent, border: 1px solid #C9A84C, color: #C9A84C
Ghost:     background: transparent, color: #8B8699, hover: bg #232136
```

### Inputy
```
background: #0F0E17
border: 1px solid #2E2B3D
focus border: 1px solid #C9A84C
focus shadow: 0px 0px 0px 3px rgba(201, 168, 76, 0.1)
padding: 13px 14px 13px 42px (z ikoną) / 13px 14px (bez)
height: 45px
```

---

## Baza danych (Prisma)

- Modele w `prisma/schema.prisma`
- Singleton klient w `src/shared/lib/prisma.ts`
- Migracje: `npx prisma db push` (dev), `npx prisma migrate deploy` (prod)
- Nigdy nie importuj PrismaClient bezpośrednio — zawsze przez `@/shared/lib/prisma`

---

## Język

- **100% polski** — wszystkie teksty UI, labele, komunikaty błędów, placeholdery
- Komentarze w kodzie mogą być po angielsku
- Nazwy zmiennych/funkcji po angielsku

---

## Konwencje nazewnictwa

| Element | Konwencja | Przykład |
|---------|-----------|---------|
| Komponenty | PascalCase | `LoginForm.tsx` |
| Server Actions | camelCase | `registerUser.ts` |
| Schematy Zod | camelCase + Schema | `loginSchema` |
| Typy | PascalCase | `LoginInput` |
| Foldery domen | kebab-case | `character/` |
| Strony Next.js | `page.tsx` w folderze | `logowanie/page.tsx` |

---

## Pliki kluczowe

```
prisma/schema.prisma          — modele bazy danych
src/shared/lib/auth.ts        — NextAuth config (signIn, signOut, auth)
src/shared/lib/prisma.ts      — PrismaClient singleton
src/domains/auth/schemas/     — loginSchema, registerSchema
src/domains/auth/actions/     — registerUser
src/app/api/auth/[...nextauth]/route.ts — NextAuth handler
.env                          — DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
```

---

## Uruchomienie

```bash
npm run dev          # dev server na localhost:3000
npx prisma studio    # podgląd bazy na localhost:5555
npx prisma db push   # sync schematu z bazą
npx tsc --noEmit     # sprawdź TypeScript
```
