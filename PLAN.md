 Analiza zgodności z zasadami D&D 5e

  karta-postaci.html jest poprawna — odzwierciedla oficjalny formularz D&D 5e SRD:
  - ✅ 6 cech + modyfikatory
  - ✅ 18 umiejętności z atrybutem (Akrobatyka-ZRR, Atletyka-SIŁ itd.)
  - ✅ 6 rzutów obronnych z kropką biegłości
  - ✅ AC / Init / Speed / HP (max+current+temp) / Hit Dice / Death Saves
  - ✅ Tabela ataków (nazwa / premia ATK / obrażenia)
  - ✅ Sloty czarów poziomów 0–9 (Kom. + Użyte)
  - ✅ Bierna Percepcja (10 + mod Percepcji)
  - ✅ Inspiracja + Premia Biegłości
  - ✅ Osobowość 4-składnikowa
  - ✅ Historia / Wygląd / Sojusznicy / Majątek (strona 2)
  - ✅ DC Czarów / Bonus Ataku Czarem / Cecha Bazowa (strona 3)

  Co brakuje w naszej aplikacji względem HTML:

  ┌─────────────────────────────────────────────┬───────────────────┐
  │                  Brakujące                  │       Gdzie       │
  ├─────────────────────────────────────────────┼───────────────────┤
  │ Inspiracja (checkbox)                       │ Karta postaci, DB │
  ├─────────────────────────────────────────────┼───────────────────┤
  │ Punkty Doświadczenia                        │ DB schema         │
  ├─────────────────────────────────────────────┼───────────────────┤
  │ Pełna lista 18 umiejętności z kropkami      │ Karta             │
  ├─────────────────────────────────────────────┼───────────────────┤
  │ Bierna Percepcja (wyeksponowana)            │ Karta             │
  ├─────────────────────────────────────────────┼───────────────────┤
  │ Tabela ataków (broń / ATK / obrażenia)      │ Karta, DB         │
  ├─────────────────────────────────────────────┼───────────────────┤
  │ Sloty czarów poziomów 2–9                   │ Karta, PDF        │
  ├─────────────────────────────────────────────┼───────────────────┤
  │ Pozostałe kości życia                       │ Karta, DB         │
  ├─────────────────────────────────────────────┼───────────────────┤
  │ Wygląd fizyczny (waga, oczy, skóra, włosy)  │ DB                │
  ├─────────────────────────────────────────────┼───────────────────┤
  │ Sojusznicy i Organizacje                    │ DB                │
  ├─────────────────────────────────────────────┼───────────────────┤
  │ Majątek (poza złotem)                       │ DB                │
  ├─────────────────────────────────────────────┼───────────────────┤
  │ Korzyści i Zdolności (cechy rasowe/klasowe) │ Karta             │
  └─────────────────────────────────────────────┴───────────────────┘

  ---
  Plan redesignu — małe niezależne kroki

  FAZA 1 — Nowy Design System (fundament) ✅

  Krok 1.1 — Nowe czcionki ✅
  - Dodaj do app/layout.tsx Google Fonts: DM Serif Display, DM Serif Text, Barlow
  - Zdefiniuj CSS variables: --font-display, --font-text, --font-ui
  - Zastąp Cinzel → DM Serif Display, Inter → Barlow

  Krok 1.2 — Nowa paleta kolorów ✅
  - Zmień design system w CLAUDE.md i MEMORY.md
  - Nowe zmienne: --black: #0a0a0a, --dark: #1c1c1c, --mid: #555, --rule: #999, --light: #ccc, --white: #fff, --page:
  #d8d8d8
  - Stary dark theme → nowy light editorial (białe tło, czarne obramowania)

  Krok 1.3 — Globalne style bazowe ✅
  - app/globals.css: reset box-sizing, font-size: 12px base, body background #d8d8d8
  - Klasy pomocnicze: .label, .section-title, .sheet, .sheet-section

  ---
  FAZA 2 — Layout (Navbar + Sidebar) ✅

  Krok 2.1 — Navbar redesign ✅
  - Biały pasek, 1.5px solid #0a0a0a border-bottom
  - Logo: "Kroniki Przygód" w DM Serif Display 20px
  - Tag systemu: "Dungeons & Dragons · 5e" — Barlow 8px, letter-spacing 4px, uppercase
  - Usuń gradient złota → monochrome

  Krok 2.2 — Sidebar redesign ✅
  - Biały sidebar, 1.5px solid #0a0a0a border-right
  - Linki: Barlow 11px, uppercase, letter-spacing 2px
  - Aktywny link: solid #0a0a0a left border 3px, font-weight 900
  - Brak tła pod aktywnym — tylko kreska

  ---
  FAZA 3 — Dashboard ✅

  Krok 3.1 — CharacterCard redesign ✅
  - Biała karta z 1.5px solid #0a0a0a border, brak border-radius
  - Imię: DM Serif Display 22px italic
  - Rasa/Klasa/Poziom: Barlow 8px uppercase, letter-spacing 2px, kolor --mid
  - HP bar → prosta kreska 1px solid #0a0a0a, wypełnienie czarne (proporcjonalne)
  - Stats (AC/Init): małe komórki z border: 1.5px solid #0a0a0a, DM Serif Display dla liczby

  Krok 3.2 — Strona dashboard ✅
  - Tło #d8d8d8, karty w siatce na białym
  - Nagłówek: DM Serif Display duży, podtytuł Barlow uppercase

  ---
  FAZA 4 — Rozszerzenie bazy danych

  Krok 4.1 — Nowe pola w schemacie Prisma
  inspiration    Boolean  @default(false)
  experience     Int      @default(0)
  weight         Int?     // kg
  eyeColor       String?
  skinColor      String?
  hairColor      String?
  allies         String?  // textarea
  treasure       String?  // majątek poza złotem
  hitDiceUsed    Int      @default(0)
  attacks        Json     @default("[]")  // {name, atkBonus, damage}[]
  spellSlotsUsed Json     @default("{}")  // {1:0, 2:0, ...9:0}
  - npx prisma db push

  Krok 4.2 — Zaktualizuj Server Actions
  - createCharacter / updateCharacter — obsłuż nowe pola
  - updateCharacterHp — dodaj akcję updateInspiration
  - Nowa akcja: updateSpellSlots, updateAttacks, updateHitDiceUsed

  ---
  FAZA 5 — Karta Postaci (CharacterSheet)

  Krok 5.1 — Strona 1 Header
  - Layout: grid-template-columns: auto 1fr (title-block + fields)
  - Tytuł "Karta Postaci" — DM Serif Display 44px
  - Pola: Klasa/Poziom, Pochodzenie, Rasa, Charakter, PD — w siatce 3-kolumnowej
  - Inspiracja: checkbox z etykietą Barlow uppercase

  Krok 5.2 — Strona 1 Główna (3 kolumny)

  Kolumna A — Cechy:
  - 6 bloków z border: 1.5px solid #0a0a0a
  - Nazwa cechy: Barlow 7px uppercase
  - Wartość: DM Serif Display 26px, border-bottom: 1.5px solid #0a0a0a
  - Modyfikator: DM Serif Display 15px + napis "mod" Barlow

  Kolumna B — Rzuty i Umiejętności:
  - Inspiracja + Premia Biegłości w siatce 2-kolumnowej z obramowaniem
  - Rzuty Obronne: 6 wierszy (dot + wartość + nazwa)
  - Pełna lista 18 umiejętności z atrybutem w nawiasie kursywą
  - Bierna Percepcja w oddzielnym bloku z obramowaniem

  Kolumna C — Walka:
  - AC / Init / Speed: 3 komórki z border: 1.5px solid #0a0a0a
  - HP block: grid auto/1fr + 1fr/1fr (max / aktualny / tymczasowy / kość życia)
  - Death Saves: dots (3 success, 3 failure) — interaktywne
  - Tabela ataków: 3 kolumny (Nazwa / Premia ATK / Obrażenia/Typ)
  - Osobowość: 4 pola (Cechy / Ideały / Więzi / Słabości)

  Krok 5.3 — Strona 1 Dolna sekcja
  - 3 kolumny: Biegłości i Języki | Wyposażenie | Korzyści i Zdolności
  - Lined textarea (linie co 22px jak w HTML)

  Krok 5.4 — Strona 2 Historia (nowa zakładka/sekcja)
  - Pola fizyczne: Wiek / Wzrost / Waga / Oczy / Skóra / Włosy
  - Wygląd Postaci (lined textarea)
  - Sojusznicy i Organizacje
  - Majątek
  - Historia Postaci
  - Pozostałe Korzyści | Dodatkowe Notatki

  Krok 5.5 — Strona 3 Zaklęcia (nowa zakładka)
  - Stats: Klasa Użytkownika / Cecha Bazowa / ST vs Czarom / Premia Ataku
  - Spell grid 3-kolumnowy: poziomy 0-2 | 3-5 | 6-9
  - Każdy poziom: numer (DM Serif Display 26px) + Kom./Użyte inputs + lista czarów

  ---
  FAZA 6 — PDF Redesign (CharacterPdfDocument)

  Krok 6.1 — Strona 1 PDF
  - Odwzoruj dokładnie układ z HTML
  - Header: "Karta Postaci" duży + pola
  - 3-kolumnowy main body (proporcje jak HTML)
  - Czcionki w PDF: Helvetica (brak DM Serif w @react-pdf) — ale styl przez rozmiary/wagi
  - Czarno-białe (tło białe, obramowania #0a0a0a)

  Krok 6.2 — Strona 2 PDF (Historia)
  - Pola fizyczne
  - Sekcje z lined background (repeating-gradient)

  Krok 6.3 — Strona 3 PDF (Zaklęcia)
  - Spell grid pełny (poziomy 0–9)
  - Słoty Kom./Użyte

  ---
  FAZA 7 — Kreator (dostosowanie do nowego stylu)

  Krok 7.1 — Layout kreatora
  - Stepper: czarno-biały, active step = czarne kółko, ukończony = ✓ czarne
  - Tło: #d8d8d8, formularz na białym sheet

  Krok 7.2 — Formularze kroków 1–8
  - Inputy: border: none; border-bottom: 1.5px solid #0a0a0a (jak w HTML)
  - Labels: Barlow 7px uppercase, letter-spacing 2.5px
  - Selekcja (rasa/klasa): border: 1.5px solid #0a0a0a selected = wypełnione czarne tło, biały tekst
  - Brak gradientów, brak złota

  Krok 7.3 — Krok 4 Cechy (nowy wygląd)
  - Bloki cech z border: 1.5px solid #0a0a0a, DM Serif Display dla wartości
  - Point Buy: minimalistyczne +/- bez kolorów

  ---
  Kolejność realizacji (priorytetowa)

  Tydzień 1:
    1.1 Czcionki → 1.2 Paleta → 1.3 Global CSS
    2.1 Navbar → 2.2 Sidebar
    3.1 CharacterCard → 3.2 Dashboard

  Tydzień 2:
    4.1 DB schema → 4.2 Actions
    5.1-5.3 CharacterSheet strona 1 (główna karta)
    5.4 CharacterSheet strona 2 (historia)

  Tydzień 3:
    5.5 CharacterSheet strona 3 (zaklęcia)
    6.1-6.3 PDF redesign (3 strony)

  Tydzień 4:
    7.1-7.3 Kreator redesign
    Testy + bugfixes

  ---
  Łącznie ~25 kroków, każdy niezależnie testowalny. Od czego zaczynamy?