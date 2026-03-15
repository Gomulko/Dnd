# PLAN2 — Kreator Postaci bez Konta (Tryb Gościa)

## Cel ficzeru
Użytkownik może stworzyć postać **bez rejestracji**. Na stronie logowania pojawia się przycisk
"Stwórz postać bez konta". Kreator działa identycznie jak normalny, ale postać **nie jest zapisywana
do bazy**. Na stronie końcowej gość może pobrać PDF lub kliknąć "Zarejestruj się i zapisz postać"
— wtedy stan kreatora trafia do localStorage, a po rejestracji + logowaniu postać jest
automatycznie zapisywana.

---

## Architektura — przegląd zmian

### Nowe pliki
```
src/
  app/
    kreator-goscia/
      layout.tsx                      ← brak auth, baner "Tryb Gościa"
      page.tsx                        ← redirect → /kreator-goscia/koncept
      koncept/page.tsx
      rasa/page.tsx
      klasa/page.tsx
      cechy/page.tsx
      tlo/page.tsx
      ekwipunek/page.tsx
      magia/page.tsx
      gotowe/page.tsx                 ← GuestGotoweForm zamiast GotoweForm
    api/
      export-pdf/
        guest/route.ts                ← POST, bez auth, dane z body
  domains/
    character/
      components/
        GuestGotoweForm.tsx           ← podsumowanie + PDF + link do rejestracji
      schemas/
        guestCharacterSchema.ts       ← Zod schema dla POST /api/export-pdf/guest
      store/
        buildCharacterPayload.ts      ← wyciągnięta czysta funkcja budowania payloadu
  shared/
    ui/
      GuestNavbar.tsx                 ← navbar bez auth (tylko logo + "Zaloguj się")
      GuestStepper.tsx                ← Stepper z /kreator-goscia/* ścieżkami
      GuestStepperWrapper.tsx         ← wrapper czytający pathname, mapuje gościnne kroki
    lib/
      fillCharacterPdf.ts             ← wyciągnięta logika wypełniania PDF
tests/
  kreator-goscia/
    guest-flow.spec.ts
    save-after-register.spec.ts
```

### Modyfikowane pliki (istniejące)
| Plik | Zmiana |
|------|--------|
| `src/app/logowanie/page.tsx` | Blok "Stwórz bez konta" |
| `src/domains/auth/components/LoginForm.tsx` | Po logowaniu — sprawdź localStorage i auto-utwórz postać |
| `src/domains/auth/components/RegisterForm.tsx` | Przed przekierowaniem — zapisz wizard state do localStorage |
| `src/domains/character/components/GotoweForm.tsx` | Prop `basePath?`, użyj `buildCharacterPayload` |
| `src/domains/character/components/KonceptForm.tsx` | Prop `basePath?` |
| `src/domains/character/components/RasaForm.tsx` | Prop `basePath?` |
| `src/domains/character/components/KlasaForm.tsx` | Prop `basePath?` |
| `src/domains/character/components/CechyForm.tsx` | Prop `basePath?` |
| `src/domains/character/components/TloForm.tsx` | Prop `basePath?` |
| `src/domains/character/components/EkwipunekForm.tsx` | Prop `basePath?` |
| `src/domains/character/components/MagiaForm.tsx` | Prop `basePath?` |
| `src/app/api/export-pdf/[id]/route.ts` | Użyj `fillCharacterPdf` helpera |

---

## Kolejność implementacji (posortowana wg zależności)

```
1 → fillCharacterPdf.ts           (nie zależy od niczego nowego)
2 → guestCharacterSchema.ts       (czysta logika Zod)
3 → buildCharacterPayload.ts      (czysta funkcja, dane ze store + SRD data)
4 → POST /api/export-pdf/guest    (zależy od 1 i 2)
5 → basePath prop — wszystkie 8 formularzy (izolowane, bez nowych plików)
6 → GuestNavbar, GuestStepper, GuestStepperWrapper (UI chrome)
7 → kreator-goscia/layout.tsx     (zależy od 6)
8 → 7 stron kroków (koncept→magia) (zależy od 5 i 7)
9 → GuestGotoweForm + gotowe/page.tsx (zależy od 2, 3, 4)
10 → Przycisk "Stwórz bez konta" na stronie logowania (zależy od 8)
11 → RegisterForm + LoginForm localStorage flow (zależy od 3)
12 → Testy E2E (zależy od wszystkiego)
```

---

## Szczegółowy plan krok po kroku

---

### Krok 1 — `fillCharacterPdf.ts` (refaktor PDF)

**Plik:** `src/shared/lib/fillCharacterPdf.ts`

Wyciągnij cały kod wypełniania pól PDF z `src/app/api/export-pdf/[id]/route.ts` do
czystej funkcji:

```ts
export type CharacterPdfData = {
  // wszystkie pola potrzebne do wypełnienia PDF
  name: string; race: string; class: string; level: number;
  background: string | null; alignment: string;
  strength: number; dexterity: number; constitution: number;
  intelligence: number; wisdom: number; charisma: number;
  currentHp: number; maxHp: number; tempHp: number;
  ac: number; initiative: number; speed: number;
  skills: string[]; cantrips: string[]; spells: string[];
  equipment: { name: string; qty: number }[];
  gold: number;
  personalityTraits: string[]; ideals: string[];
  bonds: string[]; flaws: string[];
  backstory: string | null; allies: string | null; treasure: string | null;
  proficiencyBonus: number;
};

export async function fillCharacterPdf(pdfBytes: Uint8Array, data: CharacterPdfData): Promise<Uint8Array>
```

Zaktualizuj `/api/export-pdf/[id]/route.ts` żeby używał tej funkcji.

---

### Krok 2 — `guestCharacterSchema.ts`

**Plik:** `src/domains/character/schemas/guestCharacterSchema.ts`

Schema Zod dla danych które POST /api/export-pdf/guest przyjmuje w body.
Odpowiada stanowi kreatora po kroku 7 (wszystkie 7 kroków uzupełnionych):

```ts
import { z } from "zod";

export const guestCharacterSchema = z.object({
  step1: z.object({
    name: z.string().min(1),
    gender: z.string(),
    age: z.number().nullable(),
    height: z.number().nullable(),
    weight: z.number().nullable(),
    eyeColor: z.string(),
    skinColor: z.string(),
    hairColor: z.string(),
    description: z.string(),
    alignment: z.string(),
  }),
  step2: z.object({ race: z.string(), subrace: z.string().nullable() }),
  step3: z.object({ class: z.string(), subclass: z.string().nullable(), skills: z.array(z.string()) }),
  step4: z.object({
    method: z.string(),
    strength: z.number(), dexterity: z.number(), constitution: z.number(),
    intelligence: z.number(), wisdom: z.number(), charisma: z.number(),
  }),
  step5: z.object({
    background: z.string(),
    personalityTraits: z.array(z.string()),
    ideals: z.array(z.string()),
    bonds: z.array(z.string()),
    flaws: z.array(z.string()),
    languages: z.array(z.string()),
    backstory: z.string(),
    allies: z.string(),
    treasure: z.string(),
  }),
  step6: z.object({
    equipment: z.array(z.object({ name: z.string(), qty: z.number(), weight: z.number() })),
    gold: z.number(),
  }),
  step7: z.object({
    cantrips: z.array(z.string()),
    spells: z.array(z.string()),
  }),
});

export type GuestCharacterInput = z.infer<typeof guestCharacterSchema>;
```

---

### Krok 3 — `buildCharacterPayload.ts`

**Plik:** `src/domains/character/store/buildCharacterPayload.ts`

Wyciągnij istniejącą logikę z `GotoweForm.tsx` (budowanie `characterPayload`) do czystej
funkcji. Funkcja importuje z `@/data/dnd/races` i `@/data/dnd/backgrounds` — dane SRD,
bez zależności serwerowych.

```ts
import type { WizardStore } from "./wizardStore";
import type { CreateCharacterInput } from "@/domains/character/schemas/characterSchema";

export function buildCharacterPayload(store: Pick<WizardStore, "step1"|"step2"|"step3"|"step4"|"step5"|"step6"|"step7">): CreateCharacterInput
```

---

### Krok 4 — `POST /api/export-pdf/guest/route.ts`

**Plik:** `src/app/api/export-pdf/guest/route.ts`

Nowy endpoint HTTP POST. Bez auth. Przyjmuje `GuestCharacterInput` w body,
buduje `CharacterPdfData`, wywołuje `fillCharacterPdf`, zwraca plik PDF.

```ts
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = guestCharacterSchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid data", { status: 400 });

  // Oblicz pochodne (maxHp, AC, speed, itd.) na podstawie danych SRD
  // Wywołaj fillCharacterPdf(pdfBytes, data)
  // Zwróć Response z plikiem PDF
}
```

Obliczenia HP/AC/prędkości: użyj tych samych funkcji mechanic co na karcie postaci
(`calcMaxHp`, `calcAc` itp. z `src/shared/lib/mechanics.ts`).

---

### Krok 5 — Prop `basePath` we wszystkich 8 formularzach

Mechaniczna zmiana w każdym z 8 komponentów formularza. Przykład dla `KonceptForm`:

**Przed:**
```tsx
export default function KonceptForm() {
  // ...
  router.push("/kreator/rasa");
  // ...
  router.push("/dashboard");
}
```

**Po:**
```tsx
type Props = { basePath?: string };
export default function KonceptForm({ basePath = "/kreator" }: Props) {
  // ...
  router.push(`${basePath}/rasa`);
  // ...
  // Wróć do /dashboard tylko z kreator (gość wraca do /kreator-goscia lub inaczej)
}
```

Tabela `router.push` do zmiany dla każdego formularza:

| Formularz | "Dalej" → | "Wróć" → |
|-----------|----------|---------|
| KonceptForm | `${basePath}/rasa` | `/dashboard` (bez zmiany — gość nie ma dashboardu, ale to krok 1 — OK) |
| RasaForm | `${basePath}/klasa` | `${basePath}/koncept` |
| KlasaForm | `${basePath}/cechy` | `${basePath}/rasa` |
| CechyForm | `${basePath}/tlo` | `${basePath}/klasa` |
| TloForm | `${basePath}/ekwipunek` | `${basePath}/cechy` |
| EkwipunekForm | `${basePath}/magia` | `${basePath}/tlo` |
| MagiaForm | `${basePath}/gotowe` | `${basePath}/ekwipunek` |
| GotoweForm | `/dashboard` (bez zmiany — tu zapisuje) | `${basePath}/magia` |

Istniejące strony `/kreator/*` nie przekazują prop → używają domyślnego `/kreator`. Zero
regresji.

---

### Krok 6 — GuestNavbar, GuestStepper, GuestStepperWrapper

#### `src/shared/ui/GuestNavbar.tsx`
Uproszczony Navbar bez `auth()`. Pokazuje tylko logo + "Zaloguj się" (link do `/logowanie`).
Identyczny styl wizualny jak `Navbar` (BLACK bg, WHITE text, Cinzel/Barlow fonts).

#### `src/shared/ui/GuestStepper.tsx`
Kopia `Stepper` z jedną różnicą — tablica `STEPS` używa `/kreator-goscia/[step]` zamiast
`/kreator/[step]`. Identyczny wygląd.

#### `src/shared/ui/GuestStepperWrapper.tsx`
Kopia `StepperWrapper` która renderuje `<GuestStepper />` zamiast `<Stepper />`.

---

### Krok 7 — `kreator-goscia/layout.tsx`

**Plik:** `src/app/kreator-goscia/layout.tsx`

Server Component **bez** wywołania `auth()`. Struktura:

```tsx
export default function KreatorGosciaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#d8d8d8" }}>
      <GuestNavbar />
      {/* Baner trybu gościa */}
      <div style={{
        background: "#0a0a0a", color: "#ffffff",
        padding: "8px 32px",
        fontFamily: "var(--font-ui), 'Barlow', sans-serif",
        fontSize: 11, textTransform: "uppercase", letterSpacing: "2.5px",
        textAlign: "center",
      }}>
        TRYB GOŚCIA — dane nie zostaną zapisane na stałe
      </div>
      <GuestStepperWrapper />
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
        {children}
      </main>
    </div>
  );
}
```

---

### Krok 8 — 7 stron kroków (koncept → magia)

Każda strona to cienki Server Component — identyczny z odpowiednikiem w `/kreator/`,
z jedną różnicą: przekazuje `basePath="/kreator-goscia"` do formularza.

Przykład `/src/app/kreator-goscia/koncept/page.tsx`:
```tsx
import KonceptForm from "@/domains/character/components/KonceptForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function GoscKonceptPage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <KonceptForm basePath="/kreator-goscia" />
      </div>
      <CharacterPreview />
    </div>
  );
}
```

Powtórzyć dla: `rasa`, `klasa`, `cechy`, `tlo`, `ekwipunek`, `magia`.

Oraz `src/app/kreator-goscia/page.tsx`:
```tsx
import { redirect } from "next/navigation";
export default function KreatorGosciaPage() {
  redirect("/kreator-goscia/koncept");
}
```

---

### Krok 9 — GuestGotoweForm + gotowe/page.tsx

#### `src/domains/character/components/GuestGotoweForm.tsx`

Komponent klasy "use client". Czyta `useWizardStore()`. Renderuje to samo podsumowanie
co `GotoweForm` (wyciągnięty `GotoweSummary` lub skopiowana prezentacja), ale z innym
obszarem przycisków:

```
[ ← Wróć ]                        [ Eksportuj PDF ]  [ Zarejestruj się i zapisz postać → ]
```

**"Eksportuj PDF":**
```ts
async function handleExportPdf() {
  setExportingPdf(true);
  const payload = buildCharacterPayload(store); // z buildCharacterPayload.ts
  const res = await fetch("/api/export-pdf/guest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), // zawiera state kreatora
  });
  if (res.ok) {
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${store.step1.name || "postac"}.pdf`;
    a.click(); URL.revokeObjectURL(url);
  }
  setExportingPdf(false);
}
```

**"Zarejestruj się i zapisz postać":**
```ts
function handleRegister() {
  // Serializuj cały stan kreatora do localStorage
  const storeState = {
    step1: store.step1, step2: store.step2, step3: store.step3,
    step4: store.step4, step5: store.step5, step6: store.step6, step7: store.step7,
  };
  localStorage.setItem("guest-wizard-character", JSON.stringify(storeState));
  router.push("/rejestracja");
}
```

#### `src/app/kreator-goscia/gotowe/page.tsx`
```tsx
import GuestGotoweForm from "@/domains/character/components/GuestGotoweForm";
import CharacterPreview from "@/domains/character/components/CharacterPreview";

export default function GoscGotowePage() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <GuestGotoweForm />
      </div>
      <CharacterPreview />
    </div>
  );
}
```

---

### Krok 10 — Przycisk "Stwórz bez konta" na stronie logowania

**Plik:** `src/app/logowanie/page.tsx` (lub w `LoginForm.tsx` na dole)

Po sekcji "Nie masz konta?" dodaj blok:

```tsx
{/* Separator */}
<div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
  <div style={{ flex: 1, height: 1, background: "#cccccc" }} />
  <span style={{ fontFamily: FONT_UI, fontSize: 11, color: "#555555", textTransform: "uppercase", letterSpacing: "2px" }}>
    lub
  </span>
  <div style={{ flex: 1, height: 1, background: "#cccccc" }} />
</div>

<Link href="/kreator-goscia/koncept" style={{
  display: "block", textAlign: "center",
  padding: "12px 24px",
  border: "1.5px solid #0a0a0a", background: "transparent",
  color: "#0a0a0a",
  fontFamily: FONT_UI, fontSize: 14, textTransform: "uppercase", letterSpacing: "2px",
  textDecoration: "none",
}}>
  Stwórz postać bez konta
</Link>

<p style={{ fontFamily: FONT_UI, fontSize: 11, color: "#555555", textAlign: "center", marginTop: 8 }}>
  Dane nie zostaną zapisane na stałe
</p>
```

---

### Krok 11 — "Zapisz po rejestracji" flow

#### `RegisterForm.tsx` — zapis do localStorage przed przekierowaniem

```ts
// Po sukcesie registerUser(input, recaptchaToken):
if (typeof localStorage !== "undefined" && localStorage.getItem("guest-wizard-character")) {
  router.push("/logowanie?registered=true&pendingCharacter=1");
} else {
  router.push("/logowanie?registered=true");
}
```

#### `LoginForm.tsx` — po logowaniu sprawdź localStorage

```ts
// Po sukcesie signIn("credentials", {..., redirect: false}):
const pendingCharacterRaw = localStorage.getItem("guest-wizard-character");
if (pendingCharacterRaw) {
  try {
    const storeState = JSON.parse(pendingCharacterRaw);
    const payload = buildCharacterPayload(storeState);
    await createCharacter(payload); // Server Action
    localStorage.removeItem("guest-wizard-character");
  } catch (e) {
    console.error("Nie udało się zapisać postaci gościa:", e);
  }
}
router.push("/dashboard");
```

#### Baner "pending character" w `LoginForm`

Jeśli `searchParams.get("pendingCharacter") === "1"`, pokaż nad formularzem:
```tsx
<div style={{
  background: "#f0f0f0", border: "1.5px solid #0a0a0a",
  padding: "12px 16px", marginBottom: 20,
  fontFamily: FONT_UI, fontSize: 13,
}}>
  Zaloguj się, aby zapisać swoją postać z trybu gościa.
</div>
```

---

### Krok 12 — Testy E2E

#### `tests/kreator-goscia/guest-flow.spec.ts`

```ts
test("strona logowania zawiera przycisk Stwórz postać bez konta")
test("kliknięcie otwiera /kreator-goscia/koncept")
test("baner TRYB GOŚCIA jest widoczny")
test("kreator gościa przechodzi przez 8 kroków (via sessionStorage inject)")
test("strona gotowe nie ma przycisku Zapisz Postać")
test("strona gotowe ma przycisk Eksportuj PDF")
test("Eksportuj PDF pobiera plik PDF (POST /api/export-pdf/guest, status 200)")
test("Zarejestruj się ustawia localStorage i przekierowuje na /rejestracja")
```

#### `tests/kreator-goscia/save-after-register.spec.ts`

```ts
test("po rejestracji z pending character logowanie automatycznie zapisuje postać na dashboardzie")
// użyj unikalnej nazwy użytkownika: `gosctester_${Date.now()}`
// ustaw localStorage przed odwiedzeniem /rejestracja
// zarejestruj, zaloguj, sprawdź dashboard
```

---

## Potencjalne problemy i rozwiązania

| Problem | Rozwiązanie |
|---------|------------|
| `Navbar` wywołuje `auth()` (Server Component) | Osobny `GuestNavbar` bez `auth()` |
| `createCharacter` wewnętrznie wywołuje `auth()` — czy zadziała zaraz po `signIn`? | Po `signIn(..., { redirect: false })` cookie sesji jest ustawione; kolejne SA call widzi sesję. Fallback: `createCharacterFromGuest(payload, userId)` przyjmuje `userId` explicite |
| `buildCharacterPayload` importuje dane SRD — czy bezpieczne na kliencie? | Tak — `src/data/dnd/*` to czyste TS, bez server-only imports |
| Gość otwiera kreator po raz drugi — store ma stare dane | `GuestStepperWrapper` wywołuje `store.reset()` gdy `pathname === "/kreator-goscia/koncept"` i brak `step1.name` |
| PDF z brakującymi polami (gość nie wypełnił wszystkich kroków) | Zod schema na POST `/api/export-pdf/guest` waliduje kompletność; jeśli nieważne — `400 Bad Request` |

---

## Definicja ukończenia (Definition of Done)

- [ ] Przycisk "Stwórz postać bez konta" widoczny na `/logowanie`
- [ ] Kreator gościa działa od kroku 1 do 8 bez logowania
- [ ] Baner "TRYB GOŚCIA" widoczny przez cały kreator
- [ ] Strona `/kreator-goscia/gotowe` pokazuje podgląd postaci
- [ ] Eksport PDF z trybu gościa działa (plik pobierany)
- [ ] Kliknięcie "Zarejestruj się i zapisz" → `/rejestracja` z zapisanym stanem w localStorage
- [ ] Po rejestracji i logowaniu postać pojawia się na dashboardzie
- [ ] `npx playwright test tests/kreator-goscia/` — wszystkie testy przechodzą
- [ ] `npx tsc --noEmit` — brak błędów TypeScript
- [ ] Istniejące testy (`tests/kreator/`) nadal przechodzą (brak regresji z prop `basePath`)
