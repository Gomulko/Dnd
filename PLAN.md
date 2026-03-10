# Kroniki Przygód — Plan Implementacji

> Zadania podzielone na małe, niezależne jednostki. Każde można zaimplementować i przetestować osobno.
> Kolejność jest ważna — każda faza zależy od poprzedniej.

---

## ANALIZA WIDOKÓW

### Nawigacja globalna
- Topbar: logo "⚔ Kroniki Przygód" + avatar + imię + Wyloguj
- Sidebar (dashboard): Moje Postacie / Stwórz Postać / Podręcznik Zasad / Rzutnik Kości
- Kreator: pełnoekranowy, bez sidebara, stepper 8 kroków u góry
- Karta postaci: topbar z przyciskami "← Moje Postacie", "Edytuj Postać", "Eksportuj PDF"

### Widoki (12 ekranów)
1. **Logowanie** ✅ — split screen, gotowe
2. **Rejestracja** ✅ — split screen, gotowe
3. **Dashboard** ✅ — sidebar + karty postaci + szybkie akcje
4. **Kreator krok 1** — Koncept (imię, płeć, wiek, wzrost, opis, alignment)
5. **Kreator krok 2** — Rasa (grid 9 ras + panel szczegółów + podrasę)
6. **Kreator krok 3** — Klasa (12 klas + filtry + panel z domeną/subklasą)
7. **Kreator krok 4** — Cechy (3 metody: Standard Array / Point Buy / Rzut Kośćmi)
8. **Kreator krok 5** — Tło postaci (12 teł + cechy charakteru / ideały / więzi / wady)
9. **Kreator krok 6** — Ekwipunek startowy (pakiety klasy + tło + opcja za złoto)
10. **Kreator krok 7** — Magia (cantrips + czary poz. 1, tylko dla klas magicznych)
11. **Kreator krok 8** — Gotowe (podsumowanie + "Zapisz i Graj")
12. **Karta postaci** — pełna karta: cechy / rzuty / umiejętności / HP / ataki / ekwipunek / zaklęcia / osobowość

---

## DANE D&D 5e (źródło: SRD 5.2.1 — `src/data/dnd/`)

> ✅ Dane zapisane jako TypeScript w `src/data/dnd/` i importowane bezpośrednio — nie przez bazę danych.
> Pliki: `races.ts`, `classes.ts`, `backgrounds.ts`, `spells.ts`, `index.ts` (barrel)

### Rasy (11 = 9 SRD + 2 PHB)
| Rasa | Bonusy | Prędkość | Cechy Kluczowe | Źródło |
|------|--------|----------|----------------|--------|
| Człowiek | +1 do wszystkich | 30 | Wszechstronny | SRD |
| Krasnolud | +2 KON | 25 | Odporność na trucizny, Darkvision. Podrasy: Górski (+2 SIŁ), Wzgórzowy (+1 MĄD) | SRD |
| Elf | +2 ZRR | 30 | Ciemnowidz, Odporność na czarowanie, Trance. Podrasy: Wysoki (+1 INT), Leśny (+1 MĄD), Drow (+1 CHA) | SRD |
| Niziołek | +2 ZRR | 25 | Szczęście, Nieustraszoność, Zwinność. Podrasy: Lekkonogi (+1 CHA), Rubaszny (+1 KON) | SRD |
| Gnom | +2 INT | 25 | Ciemnowidz, Przebiegłość Gnoma. Podrasy: Leśny (+1 ZRR), Kamienny (+1 KON) | SRD |
| Dragonborn | +2 SIŁ, +1 CHA | 30 | Oddech smoka (wg rodowodu), Odporność na żywioł | SRD |
| Tiefling | +2 CHA, +1 INT | 30 | Ciemnowidz, Infernalne Dziedzictwo, Odporność na ogień | SRD |
| Goliath | +2 SIŁ, +1 KON | 30 | Budowa Atletyczna, Redukcja Obrażeń, Odporność na zimno | SRD |
| Ork | +2 SIŁ, +1 KON | 30 | Ciemnowidz, Potężny Atak, Agresja | SRD |
| Półelf | +2 CHA, +1 do 2 wg wyboru | 30 | Ciemnowidz, Odporność na czarowanie, Wszechstronność | PHB |
| Półork | +2 SIŁ, +1 KON | 30 | Ciemnowidz, Groźny, Nieustępliwy, Uderzenie Dzikości | PHB |

### Klasy (12)
| Klasa | Hit Die | Kluczowe Cechy | Saving Throws | Rola |
|-------|---------|----------------|---------------|------|
| Barbarzyńca | k12 | Wściekłość, Obrona bez zbroi | SIŁ, KON | DAMAGE |
| Bard | k8 | Inspiracja Barda, Magia | ZRR, CHA | HYBRID |
| Kleryk | k8 | Magia Boska, Domena | MĄD, CHA | SUPPORT |
| Druid | k8 | Magia Natury, Przemiana | INT, MĄD | KONTROLA |
| Wojownik | k10 | Styl Walki, Drugi Oddech | SIŁ, KON | DAMAGE |
| Mnich | k8 | Ki, Obrona bez zbroi | SIŁ, ZRR | DAMAGE |
| Paladyn | k10 | Boska Przysięga, Magia | MĄD, CHA | TANK |
| Łowca | k10 | Ulubiony Wróg, Teren | SIŁ, ZRR | DAMAGE |
| Łotrzyk | k8 | Skrytobójstwo, Spryt | ZRR, INT | DAMAGE |
| Czarownik | k6 | Magia Wrodzona, Metamagia | KON, CHA | KONTROLA |
| Warlock | k8 | Patron, Pakty | MĄD, CHA | KONTROLA |
| Czarodziej | k6 | Księga Czarów, Tradycja Magiczna | INT, MĄD | KONTROLA |

### Tła (12 = 4 SRD + 8 PHB)
| Tło | Umiejętności | Źródło |
|-----|-------------|--------|
| Akolita | Wnikliwość, Religia | SRD |
| Kryminalista | Podstęp, Ukrywanie | SRD |
| Uczony | Arcana, Historia | SRD |
| Żołnierz | Atletyka, Zastraszanie | SRD |
| Ludowy Bohater | Obsługa zwierząt, Przetrwanie | PHB |
| Szlachcic | Historia, Perswazja | PHB |
| Wędrowiec | Atletyka, Przetrwanie | PHB |
| Oszust | Podstęp, Wnikliwość | PHB |
| Artysta | Akrobatyka, Występy | PHB |
| Rzemieślnik | Historia, Wnikliwość | PHB |
| Pustelnik | Medycyna, Religia | PHB |
| Marynarz | Atletyka, Percepcja | PHB |

### Czary (źródło: `src/data/dnd/spells.ts`)
- **26 cantrips** dla 8 klas: Bard, Cleric, Druid, Sorcerer, Warlock, Wizard + Paladin, Ranger
- **45 czarów poziomu 1** dla tych samych klas
- Wszystkie z polskimi nazwami i opisami
- Helpery: `getCantripsForClass()`, `getLevel1SpellsForClass()`, `getSpellsBySchool()`

### Wartości Cech
- **Standard Array:** 15, 14, 13, 12, 10, 8
- **Point Buy:** 27 punktów, wartości 8–15, koszty: 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=7, 15=9
- **Modyfikatory:** (wartość - 10) / 2, zaokrąglone w dół
- **Rzut kośćmi:** 4k6, odrzuć najniższy, powtórz 6 razy

### Alignment (9)
LG, NG, CG, LN, TN, CN, LE, NE, CE (po polsku: Praworządny Dobry, Neutralny Dobry, itd.)

---

## SCHEMAT BAZY DANYCH

### Nowe/rozszerzone tabele

```prisma
model Character {
  id          String  @id @default(cuid())
  userId      String
  user        User    @relation(...)

  // Krok 1 — Koncept
  name        String
  gender      String  // "kobieta" | "mezczyzna" | "inne"
  age         Int?
  height      Int?    // cm
  description String?
  alignment   String  // "LG" | "NG" | "CG" | "LN" | "TN" | "CN" | "LE" | "NE" | "CE"

  // Krok 2 — Rasa
  race        String  // "elf" | "krasnolud" | itd.
  subrace     String?

  // Krok 3 — Klasa
  class       String  // "kleryk" | "wojownik" | itd.
  subclass    String? // "domena-zycia" | itd.
  level       Int     @default(1)

  // Krok 4 — Cechy
  strength    Int     @default(10)
  dexterity   Int     @default(10)
  constitution Int    @default(10)
  intelligence Int    @default(10)
  wisdom      Int     @default(10)
  charisma    Int     @default(10)

  // Krok 5 — Tło
  background  String?
  personalityTraits String[] // JSON array
  ideals      String[]
  bonds       String[]
  flaws       String[]
  languages   String[]
  backstory   String?

  // Krok 6 — Ekwipunek
  equipment   Json    @default("[]")  // Item[]
  gold        Int     @default(0)

  // Krok 7 — Magia (tylko klasy magiczne)
  cantrips    String[] // nazwy czarów
  spells      String[] // nazwy czarów

  // Stan rozgrywki (karta postaci)
  currentHp   Int?
  tempHp      Int      @default(0)
  deathSaves  Json     @default("{\"successes\":0,\"failures\":0}")
  sessionNotes String?

  // Meta
  isComplete  Boolean  @default(false)
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## FAZY IMPLEMENTACJI

---

## FAZA 1 — BAZA DANYCH ✅ (gotowe)
- ✅ User, Account, Session
- ✅ Character (podstawowy)

---

## FAZA 2 — ROZSZERZENIE BAZY DANYCH

> ✅ Dane D&D (rasy, klasy, tła, czary) są już w `src/data/dnd/` jako TypeScript — **nie wymagają seeda do bazy**.
> Seed bazy potrzebny jest tylko dla danych użytkowników (np. testowy user).

### Zadanie 2.1 — Rozszerz model Character w Prisma
- Dodaj wszystkie pola z planu powyżej
- `npx prisma db push`
- **Test:** `npx prisma studio` — sprawdź że tabela ma nowe kolumny

### Zadanie 2.2 ✅ — Dane ras
- `src/data/dnd/races.ts` — 11 ras (9 SRD + 2 PHB) z bonusami, podrasami, cechami

### Zadanie 2.3 ✅ — Dane klas
- `src/data/dnd/classes.ts` — 12 klas z hit die, saving throws, subklasami, SKILL_NAMES_PL

### Zadanie 2.4 ✅ — Dane teł
- `src/data/dnd/backgrounds.ts` — 12 teł z pełnymi cechami, ideałami, więziami, wadami

### Zadanie 2.5 ✅ — Dane czarów
- `src/data/dnd/spells.ts` — 26 cantrips + 45 czarów poz. 1, polskie opisy

### Zadanie 2.6 ✅ — Barrel export
- `src/data/dnd/index.ts` — eksportuje wszystko z jednego miejsca

### Zadanie 2.7 — Seed testowego użytkownika (opcjonalny)
- `prisma/seed.ts` — jeden użytkownik demo + jedna przykładowa postać
- **Test:** `npx prisma db seed` → login jako demo user

---

## FAZA 3 — LAYOUT APLIKACJI

### Zadanie 3.1 — Shared Navbar (topbar)
- `src/shared/ui/Navbar.tsx` — Server Component
- Logo + avatar + imię usera + przycisk Wyloguj
- **Test:** widoczny na `/dashboard`

### Zadanie 3.2 — Sidebar nawigacji
- `src/shared/ui/Sidebar.tsx`
- Linki: Moje Postacie / Stwórz Postać / Podręcznik Zasad / Rzutnik Kości
- Aktywny link wyróżniony złotym akcentem
- Avatar + imię + "PRO ACCOUNT" badge na dole
- **Test:** kliknij każdy link, sprawdź active state

### Zadanie 3.3 — Dashboard layout
- `src/app/dashboard/layout.tsx` — Sidebar + Navbar + children
- Sprawdź sesję, redirect jeśli niezalogowany
- **Test:** `/dashboard` pokazuje sidebar i navbar

---

## FAZA 4 — DASHBOARD (Moje Postacie)

### Zadanie 4.1 — Server Action: pobierz postacie usera
- `src/domains/character/actions/getCharacters.ts`
- Zwróć listę postaci zalogowanego usera
- **Test:** wywołaj action, sprawdź zwrócone dane

### Zadanie 4.2 — Karta postaci (CharacterCard)
- `src/domains/character/components/CharacterCard.tsx`
- Inicjały w kółku (avatar), imię, rasa/klasa/domena, poziom badge
- Pasek HP (kolor: zielony/żółty/czerwony wg %HP), AC, Inicjatywa, Prędkość
- Badges: klasa, rasa, alignment
- Przycisk "Graj →" + "..." menu
- **Test:** render z mockowymi danymi

### Zadanie 4.3 — Strona Moje Postacie
- `src/app/dashboard/page.tsx`
- Grid 3 kolumny z CharacterCard
- Nagłówek "Moje Postacie" + liczba postaci + "Ostatnia sesja"
- Przycisk "+ Nowa Postać" → `/kreator`
- Stan pusty gdy brak postaci
- **Test:** zaloguj się, sprawdź stronę

### Zadanie 4.4 — Szybkie Akcje
- Sekcja pod kartami: "Kontynuuj ostatnią sesję" / "Przeglądaj zasady" / "Rzuć kośćmi"
- **Test:** widoczne pod kartami postaci

---

## FAZA 5 — KREATOR POSTACI — SHELL

### Zadanie 5.1 ✅ — Stepper komponent
- `src/shared/ui/Stepper.tsx`
- 8 kroków: Koncept / Rasa / Klasa / Cechy / Tło / Ekwipunek / Magia / Gotowe
- Stany: ukończony (✓ zielony), aktywny (złoty z numerem), przyszły (szary)

### Zadanie 5.2 ✅ — Wizard layout + routing
- `src/app/kreator/layout.tsx` — Navbar + StepperWrapper + children, auth guard
- `src/app/kreator/page.tsx` → redirect do `/kreator/koncept`
- `src/shared/ui/StepperWrapper.tsx` — Client Component, czyta pathname → currentStep
- Foldery: `/kreator/koncept`, `/rasa`, `/klasa`, `/cechy`, `/tlo`, `/ekwipunek`, `/magia`, `/gotowe` (placeholdery)

### Zadanie 5.3 ✅ — Store stanu kreatora (Zustand lub sessionStorage)
- `src/domains/character/store/wizardStore.ts`
- Trzyma dane wszystkich kroków w pamięci
- Persystencja do sessionStorage (nie ginie przy refresh)
- **Test:** wpisz imię na kroku 1, przejdź dalej i wróć — dane są zachowane

### Zadanie 5.4 ✅ — Panel podglądu postaci (prawy sidebar w kreatorze)
- `src/domains/character/components/CharacterPreview.tsx`
- Inicjały/avatar, imię, Rasa / Klasa / Poziom / Alignment
- Aktualizuje się na żywo podczas wypełniania
- **Test:** wpisz imię — pojawia się w podglądzie

---

## FAZA 6 — KREATOR KROK PO KROKU

### Zadanie 6.1 ✅ — Krok 1: Koncept
- Pole: Imię postaci (wymagane, Cinzel placeholder)
- Przyciski płci: Kobieta ♀ / Mężczyzna ♂ / Inne ◆ (toggle)
- Pola opcjonalne: Wiek, Wzrost
- Textarea: Opis postaci (licznik 0/500)
- Grid Alignment 3×3 (9 przycisków, każdy z kodem LG/NG/etc.)
- Walidacja: imię wymagane przed przejściem dalej
- **Test:** wypełnij wszystko, sprawdź podgląd, kliknij Dalej

### Zadanie 6.2 ✅ — Krok 2: Rasa — grid kart
- Grid 3×3 z kartami ras (ikona, nazwa, opis, bonusy statystyk jako badges)
- Pole wyszukiwania (filtruje karty)
- Wybrana rasa: złoty border + ✓ badge
- **Test:** kliknij rasę — podświetla się

### Zadanie 6.3 ✅ — Krok 2: Rasa — panel szczegółów
- Prawy panel: nazwa rasy, przyciski podras, bonusy statystyk, lista cech rasowych
- Aktualizuje się po wyborze rasy i podrasy
- **Test:** wybierz Elf → wybierz Wysoki Elf → panel pokazuje +2 ZRR, +1 INT

### Zadanie 6.4 ✅ — Krok 3: Klasa — grid + filtry
- Filtry: Wszystkie / Damage / Tank / Support / Kontrola / Hybrid
- Grid 4×3 z kartami klas (ikona, nazwa, rola badge, trudność w kropkach, Hit Die)
- Wybrana klasa: złoty border + ✓
- **Test:** filtruj "Support" — tylko Kleryk, Bard widoczni

### Zadanie 6.5 ✅ — Krok 3: Klasa — panel szczegółów
- Hit Die, typ zbroi, saving throws
- Lista podklas do wyboru (np. Domeny Kleryk: Wiedza/Życie/Światło/Natura/Burza/Oszustwo/Wojna)
- Wybór 2 biegłości w umiejętnościach (z listy dla klasy)
- Wskaźnik synergii z wybraną rasą (★★★)
- **Test:** wybierz Kleryk → wybierz Domenę Życia → wybierz 2 umiejętności

### Zadanie 6.6 — Krok 4: Cechy — Standard Array
- Zakładki: Standardowy Zestaw / Zakup Punktów / Rzut Kośćmi
- Standard Array: 6 dropdownów (wartości 15/14/13/12/10/8), każda użyta raz
- Pokazuj bonus rasowy obok (np. "+2 Elf")
- Wynik = base + bonus rasowy + modifier w kółku
- **Test:** przypisz wszystkie wartości, sprawdź wyniki

### Zadanie 6.7 — Krok 4: Cechy — Point Buy
- Licznik punktów (27 dostępnych)
- Przyciski +/- dla każdej cechy (min 8, max 15)
- Koszt punktowy: 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=7, 15=9
- **Test:** kup cechy, sprawdź czy punkty się odliczają

### Zadanie 6.8 — Krok 4: Cechy — Rzut Kośćmi
- Przycisk "Rzuć" dla każdej cechy (4k6, drop lowest)
- Animacja rzutu (opcjonalnie)
- **Test:** kliknij rzuć — pojawia się wynik 3-18

### Zadanie 6.9 — Krok 4: Panel podsumowania
- HP na poziomie 1 (hit die max + KON mod)
- Klasa Pancerza, Inicjatywa, Prędkość, Bonus Biegłości, Bierna Percepcja
- Rekomendacja dla klasy (np. "Postaw Mądrość na 15 dla Kleryk")
- **Test:** zmień wartości — panel aktualizuje się

### Zadanie 6.10 — Krok 5: Tło — grid
- Grid 4×3 z kartami teł (ikona emoji, nazwa, umiejętności jako badges)
- Wybrane tło: złoty border
- **Test:** wybierz Akolita — podświetla się

### Zadanie 6.11 — Krok 5: Tło — panel szczegółów + cechy charakteru
- Lewa strona: nazwa tła, cecha specjalna, biegłości, języki, ekwipunek startowy
- Prawa strona: Cechy Charakteru (wybierz 2 z listy), Ideał (1), Więź (1), Wada (1)
- Każda cecha to klikalny kafelek (toggle selected/unselected)
- **Test:** wybierz tło + cechy, dane widoczne w store

### Zadanie 6.12 — Krok 6: Ekwipunek
- Sekcja "Ekwipunek klasy": Pakiet A i Pakiet B (radio wybór)
- Sekcja "Ekwipunek z tła": automatycznie dodany, wyszarzony
- Tryb zaawansowany: link do zakupu za złoto (opcjonalny)
- Panel bojowy po prawej: AC, Inicjatywa, Prędkość, HP, lista ataków, pełny ekwipunek
- **Test:** wybierz Pakiet A → panel pokazuje ekwipunek

### Zadanie 6.13 — Krok 7: Magia (tylko klasy magiczne)
- Jeśli klasa nie-magiczna: przekieruj automatycznie do kroku 8
- Podsumowanie magii: sloty, DC zaklęć, bonus ataku magicznego
- Cantrips: grid z filtrem, wybierz N (wg klasy)
- Zaklęcia Poz. 1: grid z filtrem szkół magii, wybierz N
- Prawa kolumna: lista wybranych zaklęć + sloty na dziś
- **Test:** wybierz Kleryk → pojawia się krok Magia z czarami Kleryk

### Zadanie 6.14 — Krok 8: Gotowe — podsumowanie
- Badge "✓ KREATOR UKOŃCZONY"
- Nagłówek "Twoja Postać Jest Gotowa" (gold)
- Karta hero: inicjały w kółku, imię, rasa/klasa/domena, HP/KP/INT/STOP stats, alignment + tło badges
- Grid 6 sekcji: Koncept / Rasa / Klasa / Wartości Cech / Tło / Ekwipunek — każda z "Edytuj →"
- Sekcja Historia postaci (z kroku 1, jeśli wypełniona)
- Przycisk "✨ Zapisz Postać i Graj →"
- **Test:** sprawdź że wszystkie dane wyświetlają się poprawnie

### Zadanie 6.15 — Zapis postaci do bazy
- `src/domains/character/actions/createCharacter.ts` — Server Action
- Zbierze dane z wizardStore, waliduje Zod, zapisze do bazy
- Po zapisie: redirect na `/karta/{characterId}`
- **Test:** zapisz postać, sprawdź w Prisma Studio

---

## FAZA 7 — KARTA POSTACI

### Zadanie 7.1 — Layout karty postaci
- Topbar z "← Moje Postacie", "Edytuj Postać", "Eksportuj PDF"
- Trzykolumnowy układ
- **Test:** wejdź na `/karta/[id]`, sprawdź layout

### Zadanie 7.2 — Lewa kolumna: profil + cechy + rzuty + umiejętności
- Avatar z inicjałami (kolor wg klasy)
- Imię, rasa/klasa/poziom, alignment badge, tło badge, biegłość badge
- Grid 6 cech: wartość + modifier w kółku (kolor: czerwony ujemny, zielony dodatni)
- Rzuty obronne: lista z proficiency dot
- Umiejętności: lista z proficiency dot + wartość
- **Test:** render z danymi postaci

### Zadanie 7.3 — Środkowa kolumna: stats + HP + kości + ataki + ekwipunek
- 3 statsy górą: KP / Inicjatywa / Prędkość
- Sekcja HP: current/max + pasek, tymczasowe HP, przyciski +/-
- Kości życia (Hit Dice) + Rzuty śmierci (success/failure circles)
- Tabela ataków i zaklęć: nazwa, trafienie, obrażenia
- Accordion ekwipunku: Broń / Zbroja / Przybory / Waluta
- **Test:** kliknij +/- HP — wartość się zmienia i zapisuje

### Zadanie 7.4 — Prawa kolumna: osobowość + cechy specjalne + zaklęcia
- Sekcja osobowości: Cechy / Ideał / Więź / Wada (read-only lub inline edit)
- Cechy Specjalne: lista z ikoną koloru (rasowe/klasowe/tłowe)
- Zaklęcia: cantrips lista, poz. 1 z checkboxami (użyte sloty), sloty na dziś
- Notatki z sesji: textarea auto-save
- **Test:** sprawdź że wszystkie sekcje renderują dane z bazy

### Zadanie 7.5 — Zapis zmian HP do bazy
- Server Action `updateCharacterHp`
- Optimistic update (UI aktualizuje się natychmiast)
- **Test:** zmień HP, odśwież stronę — wartość zachowana

### Zadanie 7.6 — Zapis notatek z sesji
- Auto-save po 1 sekundzie od ostatniej zmiany (debounce)
- **Test:** wpisz notatkę, odśwież — jest zachowana

---

## FAZA 8 — FUNKCJE DODATKOWE

### Zadanie 8.1 — Rzutnik Kości
- Modal lub strona `/rzutnik`
- Przyciski: k4, k6, k8, k10, k12, k20
- Historia rzutów w sesji
- **Test:** kliknij k20 — losowa liczba 1-20

### Zadanie 8.2 — Eksport PDF
- `src/domains/character/actions/exportPdf.ts`
- Użyj biblioteki `@react-pdf/renderer` lub `puppeteer`
- **Test:** kliknij "Eksportuj PDF" — pobiera się plik

### Zadanie 8.3 — Edycja postaci
- Przycisk "Edytuj Postać" na karcie → wróć do kreatora z wypełnionymi danymi
- **Test:** edytuj imię, zapisz — zmiana widoczna na karcie

### Zadanie 8.4 — Usuwanie postaci
- "..." menu na karcie w dashboardzie → Usuń
- Potwierdzenie przed usunięciem
- **Test:** usuń postać, sprawdź że znika z listy

---

## KOLEJNOŚĆ REALIZACJI (sugerowana dzienna)

### Dzień 1
- [ ] 2.1 Rozszerz model Character
- ✅ 2.2–2.6 Dane D&D w `src/data/dnd/` (gotowe)
- [ ] 2.7 Seed testowego użytkownika (opcjonalny)
- [ ] 3.1 Shared Navbar
- [ ] 3.2 Sidebar

### Dzień 2
- [ ] 3.3 Dashboard layout
- [ ] 4.1 Server Action getCharacters
- [ ] 4.2 CharacterCard komponent
- [ ] 4.3 Strona Moje Postacie
- [ ] 4.4 Szybkie Akcje

### Dzień 3
- [ ] 5.1 Stepper komponent
- [ ] 5.2 Wizard layout + routing
- [ ] 5.3 Wizard store (Zustand)
- [ ] 5.4 Panel podglądu postaci
- [ ] 6.1 Krok 1: Koncept

### Dzień 4
- [ ] 6.2–6.3 Krok 2: Rasa
- [ ] 6.4–6.5 Krok 3: Klasa

### Dzień 5
- [ ] 6.6–6.9 Krok 4: Cechy (wszystkie 3 metody + panel)

### Dzień 6
- [ ] 6.10–6.11 Krok 5: Tło
- [ ] 6.12 Krok 6: Ekwipunek

### Dzień 7
- [ ] 6.13 Krok 7: Magia
- [ ] 6.14–6.15 Krok 8: Gotowe + zapis do bazy

### Dzień 8
- [ ] 7.1–7.4 Karta postaci (cały widok)

### Dzień 9
- [ ] 7.5–7.6 Zapis HP + notatek
- [ ] 8.1 Rzutnik kości
- [ ] 8.4 Usuwanie postaci

### Dzień 10
- [ ] 8.2 Eksport PDF
- [ ] 8.3 Edycja postaci
- [ ] Testy end-to-end całego flow

---

## FAZA 0 — TESTY E2E (Playwright)

> Testy pisane przyrostowo — po każdym ukończonym zadaniu.
> Uruchomienie: `npx playwright test` (wymaga działającego `npm run dev`)
> Konto testowe: `test@kroniki.pl` / `Test1234!`

### Etap T1 — Setup + Auth + Dashboard ✅ (do zrobienia po instalacji)
- ✅ T1.0 Instalacja Playwright + konfiguracja + helper `loginAs()`
- ✅ T1.1 `tests/auth/login.spec.ts` — logowanie: poprawne / błędne hasło / pusty formularz
- ✅ T1.2 `tests/auth/register.spec.ts` — rejestracja: nowy user / email zajęty
- ✅ T1.3 `tests/dashboard/dashboard.spec.ts` — dashboard: widoczne karty postaci, sidebar, szybkie akcje
- ✅ T1.4 `tests/dashboard/auth-guard.spec.ts` — redirect na `/logowanie` bez sesji

### Etap T2 — Kreator kroki 1–2
- ✅ T2.1 `tests/kreator/koncept.spec.ts` — formularz konceptu: walidacja imienia, alignment, dalej
- ✅ T2.2 `tests/kreator/rasa.spec.ts` — wybór rasy, panel szczegółów, podrasa, dalej

### Etap T3 — Kreator kroki 3–4 (po implementacji)
- ✅ T3.1 `tests/kreator/klasa.spec.ts`
- ✅ T3.2 `tests/kreator/cechy.spec.ts`

### Etap T4 — Kreator kroki 5–8 + zapis (po implementacji)
- ✅ T4.1 `tests/kreator/tlo.spec.ts`
- ✅ T4.2 `tests/kreator/ekwipunek.spec.ts`
- [ ] T4.3–T4.4 magia / gotowe + zapis do bazy

### Etap T5 — Karta postaci (po implementacji)
- [ ] T5.1 render karty, zmiana HP, notatki

---

## PYTANIA DO USTALENIA

1. ✅ **Czary** — zaimplementowane dla pełnych 8 klas magicznych (Bard, Cleric, Druid, Paladin, Ranger, Sorcerer, Warlock, Wizard)
2. **Rzut kośćmi na cechy** — czy wyniki mają być zapisywane serwerowo czy tylko kliencko?
3. **Obrazek postaci** — czy będzie możliwość uploadu zdjęcia/avatara?
4. **Wielojęzyczność** — tylko polski, na stałe?
5. **Poziomy > 1** — kreator tworzy postać na poz. 1, czy planujemy level-up flow?
