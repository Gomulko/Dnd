# Plan Testów — Kroniki Przygód

> Źródło prawdy mechanik: `rules/rules.txt` — SRD 5.2.1 (CC-BY-4.0)
> Źródło prawdy danych: `src/data/dnd/` (races, classes, backgrounds, spells)

---

## Stos testowy

| Typ | Framework | Status |
|-----|-----------|--------|
| E2E (przepływ użytkownika) | Playwright | ✅ 184 testy gotowe |
| Jednostkowe (mechaniki gry) | **Vitest** | ❌ do dodania |
| Komponentowe (render/snapshot) | **Vitest + React Testing Library** | ❌ do dodania |
| Integralność danych D&D | **Vitest** | ❌ do dodania |

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

---

## BLOK 1 — Jednostkowe: Mechaniki Gry (Vitest)

> Plik: `tests/unit/mechanics.test.ts`

Wszystkie obliczenia muszą zgadzać się z SRD 5.2.1.

### 1.1 Modyfikator cechy
**SRD (s.6):** `modifier = floor((score − 10) / 2)`

```
Tabela z podręcznika:
  1     → −5
  2–3   → −4
  4–5   → −3
  6–7   → −2
  8–9   → −1
  10–11 →  0
  12–13 → +1
  14–15 → +2
  16–17 → +3
  18–19 → +4
  20–21 → +5
```

Przypadki testowe:
- `mod(1)`  = −5
- `mod(7)`  = −2
- `mod(8)`  = −1
- `mod(9)`  = −1
- `mod(10)` =  0
- `mod(11)` =  0
- `mod(13)` = +1
- `mod(15)` = +2
- `mod(17)` = +3
- `mod(20)` = +5
- `mod(30)` = +10 (max wartość cechy np. smok)

### 1.2 Bonus Biegłości wg poziomu
**SRD (Character Advancement table):**

```
Level  1–4  → +2
Level  5–8  → +3
Level  9–12 → +4
Level 13–16 → +5
Level 17–20 → +6
```

Przypadki testowe:
- `profBonus(1)` = 2, `profBonus(4)` = 2
- `profBonus(5)` = 3, `profBonus(8)` = 3
- `profBonus(9)` = 4, `profBonus(12)` = 4
- `profBonus(13)` = 5, `profBonus(16)` = 5
- `profBonus(17)` = 6, `profBonus(20)` = 6

### 1.3 Punkty Życia (HP)
**SRD:** Level 1 = Hit Die max + CON mod. Kolejne poziomy (fixed): +floor(HitDie/2)+1+CON mod

Przypadki testowe:
- Wojownik (d10), KON 14 (+2), poziom 1 → HP = **12**
- Wojownik (d10), KON 14 (+2), poziom 2 → HP = 12 + (5+1+2) = **20**
- Wojownik (d10), KON 14 (+2), poziom 5 → HP = 12 + 4×8 = **44**
- Kleryk (d8), KON 12 (+1), poziom 1 → HP = **9**
- Kleryk (d8), KON 12 (+1), poziom 3 → HP = 9 + 2×6 = **21**
- Czarodziej (d6), KON 10 (+0), poziom 1 → HP = **6**
- Czarodziej (d6), KON 8 (−1), poziom 1 → HP = max(1, 6−1) = **5**
- Czarodziej (d6), KON 8 (−1), poziom 2 → HP = 5 + max(1, 3+1−1) = **8**
- Barbarzyńca (d12), KON 16 (+3), poziom 1 → HP = **15**

### 1.4 Klasa Pancerza (bez zbroi)
**SRD:** `AC = 10 + DEX modifier`

Przypadki testowe:
- DEX 10 (+0) → AC = 10
- DEX 14 (+2) → AC = 12
- DEX 16 (+3) → AC = 13
- DEX 8 (−1)  → AC =  9

### 1.5 Inicjatywa
**SRD:** `Initiative = DEX modifier`

Przypadki testowe:
- DEX 10 (+0) → Initiative =  0
- DEX 14 (+2) → Initiative = +2
- DEX 8 (−1)  → Initiative = −1

### 1.6 Bierna Percepcja
**SRD (s.22):** `Passive Perception = 10 + Perception check modifier`
Jeśli biegły w Percepcji: `= 10 + WIS mod + Proficiency Bonus`

Przypadki testowe:
- WIS 14 (+2), biegły w Percepcji, poziom 1 (PB +2) → PP = **14**
- WIS 14 (+2), nie biegły → PP = **12**
- WIS 10 (+0), biegły, poziom 5 (PB +3) → PP = **13**

### 1.7 Trudność Rzutu Obronnego (Spell Save DC)
**SRD (s.23):** `Spell save DC = 8 + spellcasting ability modifier + Proficiency Bonus`

Przypadki testowe:
- Kleryk, MĄD 17 (+3), poziom 1 (PB +2) → DC = **13**
- Kleryk, MĄD 17 (+3), poziom 5 (PB +3) → DC = **14**
- Czarodziej, INT 16 (+3), poziom 1 (PB +2) → DC = **13**
- Czarownik, CHA 14 (+2), poziom 9 (PB +4) → DC = **14**
- Bard, CHA 20 (+5), poziom 17 (PB +6) → DC = **19**

### 1.8 Bonus Ataku Czarami
**SRD (s.23):** `Spell attack bonus = spellcasting ability modifier + Proficiency Bonus`

Przypadki testowe:
- Kleryk, MĄD 17 (+3), poziom 1 (PB +2) → bonus = **+5**
- Czarodziej, INT 18 (+4), poziom 5 (PB +3) → bonus = **+7**

### 1.9 Rzuty Obronne (Saving Throws)
**SRD:** proficient = `ability mod + PB`, nie biegły = `ability mod`

Przypadki testowe:
- Kleryk (proficiency: MĄD, CHA): MĄD 17 (+3), poziom 1 → rzut MĄD = **+5**, rzut SIŁ = **+0** (bez prof)
- Wojownik (proficiency: SIŁ, KON): SIŁ 18 (+4), poziom 1 → rzut SIŁ = **+6**

### 1.10 Umiejętności (Skills)
**SRD:** proficient = `ability mod + PB`, nie biegły = `ability mod`

Przypadki testowe:
- Atletyka (SIŁ), biegły, SIŁ 16 (+3), poziom 1 (PB +2) → **+5**
- Skrytobójstwo (ZRR), biegły, ZRR 14 (+2), poziom 5 (PB +3) → **+5**
- Percepcja (MĄD), nie biegły, MĄD 12 (+1) → **+1**

---

## BLOK 2 — Integralność Danych D&D (Vitest)

> Plik: `tests/unit/dnd-data.test.ts`

### 2.1 Rasy (`races.ts`)
- Liczba ras = **11** (9 SRD + 2 PHB)
- Każda rasa ma wymagane pola: `id`, `name`, `speed`, `statBonuses`, `traits`
- Prędkości zgodne z SRD:
  - Człowiek, Elf, Drakonid, Tiefling, Goliath, Ork, Półelf, Półork → 30 stóp
  - Krasnolud, Niziołek, Gnom → 25 stóp
- Bonusy zgodne z SRD:
  - Człowiek → +1 do WSZYSTKICH 6 cech
  - Krasnolud → +2 KON (podstawa; podrasy: Górski +2 SIŁ, Wzgórzowy +1 MĄD)
  - Elf → +2 ZRR (podstawa; podrasy: Wysoki +1 INT, Leśny +1 MĄD, Drow +1 CHA)
  - Niziołek → +2 ZRR (podrasy: Lekkonogi +1 CHA, Rubaszny +1 KON)
  - Gnom → +2 INT (podrasy: Leśny +1 ZRR, Kamienny +1 KON)
  - Drakonid → +2 SIŁ, +1 CHA
  - Tiefling → +2 CHA, +1 INT
  - Goliath → +2 SIŁ, +1 KON
  - Ork → +2 SIŁ, +1 KON
  - Półelf → +2 CHA
  - Półork → +2 SIŁ, +1 KON
- Każda rasa z podrasami: Krasnolud (2), Elf (3), Niziołek (2), Gnom (2)
- Rasy bez podras: Człowiek, Drakonid, Tiefling, Goliath, Ork, Półelf, Półork

### 2.2 Klasy (`classes.ts`)
- Liczba klas = **12**
- Hit Die zgodne z SRD:
  - Barbarzyńca → d12
  - Wojownik, Paladyn, Łowca → d10
  - Bard, Kleryk, Druid, Mnich, Łotrzyk, Warlock → d8
  - Czarownik, Czarodziej → d6
- Rzuty obronne (Saving Throws) zgodne z SRD:
  - Barbarzyńca → SIŁ, KON
  - Bard → ZRR, CHA
  - Kleryk → MĄD, CHA
  - Druid → INT, MĄD
  - Wojownik → SIŁ, KON
  - Mnich → SIŁ, ZRR
  - Paladyn → MĄD, CHA
  - Łowca → SIŁ, ZRR
  - Łotrzyk → ZRR, INT
  - Czarownik → KON, CHA
  - Warlock → MĄD, CHA
  - Czarodziej → INT, MĄD
- Klasy magiczne mają `spellcasting: true` i `spellcastingAbility` ustawione:
  - Kleryk, Druid, Paladyn, Łowca → "wis"
  - Bard, Warlock, Czarownik → "cha"
  - Czarodziej → "int"
- Klasy niemagiczne (`spellcasting: false`): Barbarzyńca, Wojownik, Mnich, Łotrzyk
- Każda klasa ma conajmniej 1 podklasę

### 2.3 Tła (`backgrounds.ts`)
- Liczba teł = **12** (4 SRD + 8 PHB)
- Każde tło ma: `id`, `name`, `skills`, `personalityTraits[]`, `ideals[]`, `bonds[]`, `flaws[]`
- Minimum 4 cechy charakteru, 4 ideały, 4 więzi, 4 wady w każdym tle
- Umiejętności zgodne z planem (przykłady):
  - Akolita → Wnikliwość, Religia
  - Żołnierz → Atletyka, Zastraszanie
  - Uczony → Arcana, Historia

### 2.4 Czary (`spells.ts`)
- Cantripy: minimum 3 cantrips dla każdej klasy magicznej
- Zaklęcia poz. 1: minimum 2 zaklęcia dla każdej klasy magicznej
- Każdy czar ma: `id`, `name`, `namePl`, `school`, `level`, `classes[]`
- Kleric cantrips zawierają: `guidance`, `sacred-flame`, `light`
- Wizard cantrips zawierają: `fire-bolt`, `mage-hand`
- Brak duplikatów ID czarów

---

## BLOK 3 — Komponentowe (Vitest + React Testing Library)

> Pliki: `tests/components/[ComponentName].test.tsx`
> Setup: `tests/components/setup.ts` — importuje `@testing-library/jest-dom`

### 3.1 `CharacterCard` — `tests/components/CharacterCard.test.tsx`
- Renderuje imię postaci
- Renderuje rasę i klasę (np. "Elf · Kleryk")
- Renderuje poziom (np. "POZ. 1")
- Pasek HP: kolor zielony gdy HP > 60%, żółty 30–60%, czerwony < 30%
  - HP 10/10 (100%) → kolor `#52c97a`
  - HP 5/10 (50%) → kolor `#e8c97a`
  - HP 2/10 (20%) → kolor `#e05252`
- Inicjały w avatarze (np. "Aldric Świetlisty" → "AL")
- Przycisk "Graj →" dla ukończonej postaci
- Przycisk "Dokończ →" dla szkicu (`isComplete: false`)
- Kliknięcie "···" otwiera dropdown z "Usuń postać"
- Badge "SZKIC" gdy `isComplete: false`
- Badge klasy i rasy widoczne

### 3.2 `CharacterSheet` — `tests/components/CharacterSheet.test.tsx`
- Renderuje imię postaci w nagłówku
- Renderuje poprawny modyfikator cechy w kółku (SIŁ 18 → "+4")
- Renderuje poprawne HP (kleryk d8, KON 12, poziom 1 → HP = 9)
- Renderuje poprawną AC (DEX 14 → AC = 12)
- Renderuje poprawny bonus biegłości (poziom 1 → "+2")
- Renderuje poprawny Spell DC (kleryk, MĄD 17, poziom 1 → DC = 13)
- Sekcja "Edytuj Postać" i "Eksportuj PDF" widoczna
- Rzuty obronne z biegłością są podkreślone/oznaczone

### 3.3 `DiceRoller` — `tests/components/DiceRoller.test.tsx`
- Renderuje 7 przycisków kości (k4, k6, k8, k10, k12, k20, k100)
- Licznik kości startuje na 1
- Kliknięcie k6 → wynik w zakresie 1–6
- Kliknięcie k20 → wynik w zakresie 1–20
- 2k6 → wynik w zakresie 2–12
- Licznik nie spada poniżej 1
- Licznik nie przekracza 20
- Historia zaczyna się pusta
- Po rzucie historia ma 1 wpis
- Wyczyszczenie historii usuwa wpisy

### 3.4 `Stepper` — `tests/components/Stepper.test.tsx`
- Renderuje 8 kroków
- Aktywny krok (currentStep=1) → krok 1 podświetlony złotem
- Ukończone kroki (currentStep=3) → kroki 1 i 2 mają "✓"
- Przyszłe kroki → szare
- Etykiety: Koncept, Rasa, Klasa, Cechy, Tło, Ekwipunek, Magia, Gotowe

### 3.5 `CharacterPreview` — `tests/components/CharacterPreview.test.tsx`
- Renderuje inicjały z imienia
- Renderuje rasę i klasę gdy wybrane
- Renderuje "—" gdy brak danych
- Alignment wyświetlany w formie skrótu (np. "LG")

---

## BLOK 4 — Walidacja Formularzy Kreatora (Vitest)

> Plik: `tests/unit/wizard-validation.test.ts`

### 4.1 Standard Array
- Tablica zawiera dokładnie: [15, 14, 13, 12, 10, 8]
- Każda wartość użyta dokładnie raz (brak duplikatów)
- Nie można przypisać tej samej wartości do dwóch cech
- Po przypisaniu wszystkich 6 → formularz odblokowany

### 4.2 Point Buy
- Startowy budżet = 27 punktów
- Koszty zgodne z SRD:
  - score 8 → koszt 0
  - score 9 → koszt 1
  - score 10 → koszt 2
  - score 11 → koszt 3
  - score 12 → koszt 4
  - score 13 → koszt 5
  - score 14 → koszt 7
  - score 15 → koszt 9
- Minimalna wartość cechy = 8
- Maksymalna wartość cechy = 15
- Nie można przekroczyć budżetu 27
- Zmiana jednej cechy przelicza pozostały budżet

### 4.3 Walidacja Schematu Zod (`createCharacterSchema`)
- Imię < 2 znaki → błąd
- Imię > 100 znaków → błąd
- Nieznany alignment → błąd
- Wartość cechy < 1 lub > 30 → błąd
- Gold < 0 → błąd
- Nieznana płeć → błąd
- Kompletne dane → sukces

---

## BLOK 5 — Rozszerzone E2E: Weryfikacja Kalkulacji (Playwright)

> Folder: `tests/e2e-mechanics/`
> Testy tworzą postać z konkretnymi wartościami i weryfikują obliczenia na karcie.

### 5.1 `tests/e2e-mechanics/hp-calculation.spec.ts`
Tworzy Kleryk (d8), KON 13 (+1), poziom 1:
- HP na karcie = **9** (8 + 1)

Tworzy Wojownik (d10), KON 16 (+3), poziom 1:
- HP na karcie = **13** (10 + 3)

Tworzy Czarodziej (d6), KON 10 (+0), poziom 1:
- HP na karcie = **6** (6 + 0)

### 5.2 `tests/e2e-mechanics/ac-initiative.spec.ts`
Tworzy postać z ZRR 16 (+3):
- AC na karcie = **13**
- Inicjatywa na karcie = **+3**

Tworzy postać z ZRR 8 (−1):
- AC na karcie = **9**
- Inicjatywa na karcie = **−1**

### 5.3 `tests/e2e-mechanics/spell-dc.spec.ts`
Tworzy Kleryk, MĄD 17 (+3), poziom 1 (PB +2):
- Spell DC na karcie = **13**
- Spell Attack na karcie = **+5**

Tworzy Czarodziej, INT 20 (+5), poziom 1 (PB +2):
- Spell DC = **15**
- Spell Attack = **+7**

### 5.4 `tests/e2e-mechanics/proficiency-bonus.spec.ts`
Tworzy postać poziom 1:
- PB na karcie = **+2**

(W przyszłości, gdy będzie level-up): poziom 5 → PB = **+3**

### 5.5 `tests/e2e-mechanics/skill-modifiers.spec.ts`
Tworzy Kleryk z biegłością w Wnikliwości i Religii (MĄD 17):
- Wnikliwość (MĄD, biegły): **+5** (mod +3 + PB +2)
- Religia (INT, biegły): zależy od INT wartości postaci
- Percepcja (MĄD, nie biegły): **+3** (tylko mod)

---

## BLOK 6 — Server Actions (Vitest + MSW lub bezpośrednie wywołanie)

> Plik: `tests/unit/server-actions.test.ts`
> Wymaga mock bazy danych (np. `vitest-mock-extended` lub in-memory SQLite)

### 6.1 `createCharacter`
- Zwraca `{ error }` gdy brak sesji
- Zwraca `{ error }` przy nieprawidłowych danych Zod
- Zwraca `{ characterId }` przy poprawnych danych
- Tworzy postać z `isComplete: true`

### 6.2 `updateCharacter`
- Zwraca `{ error }` gdy `userId` nie pasuje (brak dostępu)
- Aktualizuje imię, nie zeruje HP/sessionNotes
- Zwraca `{ characterId }` przy sukcesie

### 6.3 `deleteCharacter`
- Zwraca `{ error }` gdy postać należy do innego usera
- Usuwa postać z bazy
- Zwraca `{ success: true }` przy sukcesie

### 6.4 `updateCharacterHp`
- Clampuje HP do zakresu −99..999
- Aktualizuje `currentHp` w bazie
- Nie modyfikuje innych pól

---

## Kolejność implementacji

### Iteracja 1 — Setup + Mechaniki Gry (najwyższy priorytet)
1. Zainstaluj Vitest + RTL
2. Wyodrębnij funkcje kalkulacji do `src/shared/lib/dnd-mechanics.ts`
3. ✅ BLOK 1 — Testy mechanik (30+ przypadków)
4. ✅ BLOK 2 — Integralność danych D&D (20+ przypadków)

### Iteracja 2 — Komponenty
5. ✅ BLOK 3 — CharacterCard (10 testów)
6. ✅ BLOK 3 — CharacterSheet (8 testów)
7. ✅ BLOK 3 — DiceRoller (9 testów)
8. ✅ BLOK 3 — Stepper + CharacterPreview (7 testów)

### Iteracja 3 — Walidacja + Actions
9. ✅ BLOK 4 — Walidacja kreatora (15 testów)
10. ✅ BLOK 6 — Server Actions z mock DB

### Iteracja 4 — E2E Mechaniki
11. ✅ BLOK 5 — HP/AC/Spell DC na żywej stronie (15 testów)

---

## Szacunkowe pokrycie po ukończeniu

| Blok | Testy | Priorytet |
|------|-------|-----------|
| E2E — istniejące | 184 ✅ | — |
| Unit — mechaniki gry | ~35 | 🔴 Krytyczny |
| Unit — dane D&D | ~25 | 🔴 Krytyczny |
| Komponenty | ~40 | 🟡 Wysoki |
| Walidacja formularzy | ~20 | 🟡 Wysoki |
| Server Actions | ~15 | 🟠 Średni |
| E2E — kalkulacje | ~20 | 🟡 Wysoki |
| **Łącznie** | **~339** | |

---

## Refaktoryzacja wymagana przed testami

Wszystkie funkcje kalkulacji są zduplikowane w komponentach:
- `mod(score)` — w CharacterSheet, CharacterCard, GotoweForm, CharacterPdfDocument
- `profBonus(level)` — w CharacterSheet
- `maxHp(hitDie, level, conMod)` — w CharacterSheet, CharacterCard

**Wymagane:** wyodrębnić do `src/shared/lib/dnd-mechanics.ts` i zaimportować z jednego miejsca.
Wtedy testy jednostkowe testują jedną implementację — nie 4 kopie.
