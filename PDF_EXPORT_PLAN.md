# Plan: Eksport PDF z interaktywną kartą postaci

## Cel
Zastąpić obecny eksport (react-pdf generujący od zera) wypełnianiem
istniejącego polskiego arkusza D&D 5e (`DnD-PL-karta-postaci-edit.pdf`)
za pomocą `pdf-lib`. Widok `/karta/[id]` pozostaje bez zmian.

---

## Krok 1 — Przenieść PDF do `public/` ✅ DO ZROBIENIA
`DnD-PL-karta-postaci-edit.pdf` → `public/character-sheet-template.pdf`
Vercel serwuje `public/` statycznie, API route odczytuje go przez `fs`.

---

## Krok 2 — Mapa pól PDF (153 TextFieldy Text1–Text153)

### Strona 1 — Nagłówek (y > 700)
| Pole | Dane |
|------|------|
| Text1  | Imię postaci |
| Text2  | Klasa + Poziom |
| Text4  | Tło |
| Text5  | Gracz (username) |
| Text6  | Rasa |
| Text7  | Doświadczenie |
| Text8  | Postawa moralna |

### Strona 1 — Cechy (lewa kolumna, duże pola)
| Pole | Dane |
|------|------|
| Text9  | Siła (wartość) |
| Text10 | Zręczność |
| Text11 | Kondycja |
| Text12 | Intelekt |
| Text13 | Mądrość |
| Text14 | Charyzma |

### Strona 1 — Modyfikatory cech (małe pola x≈85)
| Pole | Dane |
|------|------|
| Text3   | mod SIŁ |
| Text125 | mod ZRE |
| Text126 | mod KON |
| Text127 | mod INT |
| Text128 | mod MĄD |
| Text129 | mod CHA |

### Strona 1 — Walka (środek, y≈609–641)
| Pole | Dane |
|------|------|
| Text15 | Premia Biegłości |
| Text16 | Inspiracja (★ lub puste) |
| Text17 | Inicjatywa |
| Text18 | Klasa Pancerza |
| Text19 | Prędkość |
| Text20 | Pasywna Percepcja |
| Text21 | Max HP |
| Text22 | Aktualne HP |
| Text47 | Tymczasowe HP |
| Text48 | Hit Dice (np. 1k10) |

### Strona 1 — Rzuty Obronne (Text23–28, x≈148, y:602–538)
| Pole | Dane |
|------|------|
| Text23 | Rzut obronny SIŁ |
| Text24 | Rzut obronny ZRE |
| Text25 | Rzut obronny KON |
| Text26 | Rzut obronny INT |
| Text27 | Rzut obronny MĄD |
| Text28 | Rzut obronny CHA |

### Strona 1 — Umiejętności (Text29–46, x≈148, y:492–272)
Kolejność zgodna z SRD (alfabetycznie po polsku):
| Pole | Umiejętność | Cecha |
|------|-------------|-------|
| Text29 | Akrobatyka | ZRE |
| Text30 | Obsługa Zwierząt | MĄD |
| Text31 | Arkana | INT |
| Text32 | Atletyka | SIŁ |
| Text33 | Podstęp | CHA |
| Text34 | Historia | INT |
| Text35 | Wnikliwość | MĄD |
| Text36 | Zastraszanie | CHA |
| Text37 | Poszukiwanie | INT |
| Text38 | Medycyna | MĄD |
| Text39 | Natura | INT |
| Text40 | Percepcja | MĄD |
| Text41 | Występy | CHA |
| Text42 | Perswazja | CHA |
| Text43 | Religia | INT |
| Text44 | Zręczność Rąk | ZRE |
| Text45 | Ukrywanie | ZRE |
| Text46 | Przetrwanie | MĄD |

### Strona 1 — Biegłości (małe checkboxy x≈137)
Text130–135: proficiency w rzutach obronnych (SIŁ–CHA) → "●" lub ""
Text136–153: proficiency w umiejętnościach → "●" lub ""

### Strona 1 — Ataki (3 wiersze, x≈255–415)
| Pole | Dane |
|------|------|
| Text49 | Broń 1 — nazwa |
| Text50 | Broń 1 — premia ataku |
| Text51 | Broń 1 — obrażenia |
| Text52 | Broń 2 — nazwa |
| Text54 | Broń 2 — premia ataku |
| Text56 | Broń 2 — obrażenia |
| Text53 | Broń 3 — nazwa |
| Text55 | Broń 3 — premia ataku |
| Text57 | Broń 3 — obrażenia |

### Strona 1 — Cechy Osobowości (prawa kolumna, x≈439)
| Pole | Dane |
|------|------|
| Text58 | Cechy Charakteru |
| Text59 | Ideały |
| Text60 | Więzi |
| Text61 | Wady |
| Text62 | Historia postaci (backstory) |
| Text63 | Rysy i Cechy (features) |
| Text64 | Biegłości i Języki |

### Strona 2 — Dodatkowe informacje
| Pole | Dane |
|------|------|
| Text71 | Imię postaci |
| Text72 | Klasa + Poziom |
| Text73 | Tło |
| Text74 | Gracz |
| Text75 | Rasa |
| Text76 | Doświadczenie |
| Text77 | Postawa |
| Text78 | Opis wyglądu |
| Text79 | Historia / Notatki |
| Text84 | Sojusznicy i Organizacje |
| Text85 | Skarby i Ekwipunek |

### Strona 3 — Magia
| Pole | Dane |
|------|------|
| Text86 | Klasa rzucającego |
| Text87 | Atrybut rzucania |
| Text88 | ST Czarów |
| Text89 | Bonus Ataku Czarów |
| Text90 | Cantripy (lista) |
| Text99 | Zaklęcia 1. poz. (lista) |
| Text93–117 | Kolejne poziomy zaklęć |

---

## Krok 3 — Nowe API route `/api/export-pdf/[id]/route.ts`

```ts
// Pseudokod
const templateBytes = fs.readFileSync('public/character-sheet-template.pdf')
const pdfDoc = await PDFDocument.load(templateBytes)
const form = pdfDoc.getForm()

// Wypełnij pola
set(form, 'Text1', character.name)
set(form, 'Text2', `${cls.name} ${character.level}`)
// ...

// Flatten (opcjonalne — zamroź pola) lub zostaw interaktywne
// const pdfBytes = await pdfDoc.save({ updateFieldAppearances: true })
```

### Strategia wypełniania
- Tekst: `form.getTextField('TextN').setText(value)`
- Checkboxy proficiency: `"●"` gdy biegły, `""` gdy nie
- Inspiracja: `"★"` gdy aktywna
- Modyfikatory: zawsze ze znakiem (`+3`, `-1`)

---

## Krok 4 — Usunąć `@react-pdf/renderer`
- Usunąć `src/domains/character/pdf/CharacterPdfDocument.tsx`
- Usunąć z `next.config` `serverExternalPackages`
- `npm uninstall @react-pdf/renderer`

---

## Kolejność realizacji
1. Przenieść PDF → `public/`
2. Napisać nowe API route z pdf-lib
3. Przetestować lokalnie (otworzyć wygenerowany PDF)
4. Zweryfikować mapowanie pól (korygować jeśli coś nie pasuje)
5. Usunąć stary kod react-pdf
