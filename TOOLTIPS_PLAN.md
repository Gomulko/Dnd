# Plan: Tooltips w Kreatorze Postaci

## Cel
Dodać tooltopy do każdego nieoczywistego elementu w kreatorze — gracz bez znajomości D&D 5e ma rozumieć co robi i dlaczego.

---

## STAGE 1 — Generyczny komponent `<Tooltip>` ✅ DO ZROBIENIA

**Plik:** `src/shared/ui/Tooltip.tsx`

### Wymagania
- `"use client"` — używa `useState` + `useRef`
- Pozycjonowanie: portal (`document.body`) żeby nie uciekał za `overflow: hidden`
- Pozycja domyślna: `top`, opcjonalnie `bottom | left | right`
- Opóźnienie pokazania: 300ms (żeby nie migał przy przejeżdżaniu)
- Design: editorial B&W (BLACK bg, WHITE text, Barlow font, 0 border-radius)
- Max-width: 280px, padding: 10px 14px
- Strzałka (triangle) wskazująca na element
- API:

```tsx
<Tooltip content="Tekst lub JSX" position="top">
  <span>element</span>
</Tooltip>
```

### Checklist implementacji
- [ ] Komponent Tooltip.tsx w shared/ui
- [ ] Hook useTooltip z pozycjonowaniem przez getBoundingClientRect
- [ ] Portal przez createPortal(ReactDOM)
- [ ] Animacja: opacity 0→1, transform translateY(4px→0)
- [ ] Eksport przez src/shared/ui/index.ts (jeśli istnieje)

---

## STAGE 2 — Mapa elementów → treści tooltipów (na podstawie rules.txt)

### Krok 1 — Cechy (CechyForm) — PRIORYTET WYSOKI
Najbardziej skomplikowany krok, gracze najczęściej tu się gubią.

| Element | Tooltip |
|---------|---------|
| Tab "Standardowy Zestaw" | Dostajesz gotowy zestaw liczb: 15, 14, 13, 12, 10, 8. Przypisujesz je do cech jak chcesz. Prosta i zbalansowana opcja. |
| Tab "Zakup Punktów" | Masz 27 punktów. Każda cecha startuje na 8. Wyższe wartości kosztują więcej punktów (14→15 kosztuje 2 zamiast 1). Zakres: 8–15 przed bonusami rasowymi. |
| Tab "Rzut Kośćmi" | Rzucasz 4k6 i odrzucasz najniższy wynik — 6 razy. Możesz dostać bardzo wysokie lub bardzo niskie cechy. Najlosowsza opcja. |
| SIŁ (Siła) | Określa obrażenia w walce wręcz, udźwig i próby fizyczne jak wspinaczka. Kluczowa dla wojowników i barbarzyńców. |
| ZRE (Zręczność) | Wpływa na pancerz (AC), inicjatywę, ataki dystansowe i skradanie. Kluczowa dla łotrzyków i łuczników. |
| KON (Kondycja) | Każdy +1 modyfikatora = +1 HP na poziom. Wpływa na rzuty obronne przeciw truciznom i chorobom. Ważna dla każdej klasy. |
| INT (Inteligencja) | Określa moc zaklęć czarodziejów i wiedźminów. Wpływa na Arkana, Historię, Naturę, Religię, Dociekliwość. |
| MĄD (Mądrość) | Określa moc zaklęć kleryków i druidów. Wpływa na Percepcję (najczęstszy rzut w grze!) i Wgląd. |
| CHA (Charyzma) | Określa moc zaklęć bardów, czarnoksiężników i paladynów. Wpływa na Perswazję, Oszustwo i Zastraszanie. |
| "Max HP" w podsumowaniu | Maksymalne punkty życia na 1. poziomie = maksymalna wartość kości trafień klasy + modyfikator Kondycji. Np. wojownik (k10) z KON 16 (+3) ma 13 HP. |
| "AC" w podsumowaniu | Klasa Pancerza — ile musi wyrzucić wróg żeby cię trafić. Baza: 10 + modyfikator Zręczności (bez pancerza). Pancerz to zmienia. |
| "Inicjatywa" w podsumowaniu | Kolejność w walce. Wyższa = działasz wcześniej. Równa modyfikatorowi Zręczności. |
| "Premia do Biegłości" w podsumowaniu | +2 na 1. poziomie. Dodajesz do rzutów gdzie masz biegłość: ataki, umiejętności, rzuty obronne klasy. |
| "DC Zaklęć" w podsumowaniu | Trudność rzutu obronnego przeciw twoim zaklęciom. Wzór: 8 + premia biegłości + modyfikator atrybutu rzucania. |

### Krok 2 — Klasa (KlasaForm) — PRIORYTET WYSOKI

| Element | Tooltip |
|---------|---------|
| Rola: DAMAGE | Zadaje dużo obrażeń. Skupia się na eliminowaniu wrogów. Zwykle kruchy — strzeż się. |
| Rola: TANK | Wytrzymały, wchodzi w pierwszą linię. Skupia ogień na sobie i chroni sojuszników. |
| Rola: SUPPORT | Leczy i wzmacnia sojuszników. Niezbędny w trudnych walkach. |
| Rola: KONTROLA | Ogranicza wrogów zaklęciami i efektami. Nie zadaje dużo obrażeń, ale zmienia przebieg walki. |
| Rola: HYBRID | Łączy dwie role. Elastyczny, ale rzadko najlepszy w jednej kategorii. |
| Kość Trafień (k6/k8/k10/k12) | Kość rzucana przy zdobyciu każdego poziomu — wynik + modyfikator KON = zdobyte HP. Na 1. poziomie zawsze maksimum. |
| ★ Synergia z rasą | Ta klasa szczególnie dobrze współpracuje z wybraną przez ciebie rasą — bonusy rasowe trafiają w kluczowe cechy klasy. |
| Trudność (kropki) | Ocena złożoności klasy w rozgrywce. Jedna kropka = prosta mechanicznie. Trzy = wymaga doświadczenia z systemem. |
| Rzuty Obronne | Dwie cechy, w których masz biegłość do rzutów obronnych. Ataki często zmuszają do rzutu obronnego — biegłość dodaje premię. |
| Trening Pancerza | Jakie typy pancerza możesz nosić. Ciężki pancerz = wysoki AC, ale wymaga treningu i wysokiej Siły. |

### Krok 3 — Rasa (RasaForm) — PRIORYTET ŚREDNI

| Element | Tooltip |
|---------|---------|
| Szybkość (np. 30 stóp) | Ile stóp możesz przejść w jednej turze walki (ok. 9 metrów). Większość ras ma 30. Krasnoludy: 25, Elfowie Leśni: 35. |
| Rozmiar: Średni | Rasy Średniego rozmiaru mogą używać każdej broni. Gra nie nakłada ograniczeń ekwipunku. |
| Rozmiar: Mały | Małe rasy (Niziołki, Gnomy) mają trudności z ciężką bronią — wymagają dwóch rąk do broni przeznaczonej dla Średnich. |
| PHB badge | Player's Handbook — oficjalna, podstawowa podręcznikowa rasa D&D 5e (System Reference Document 5.2.1). |
| Bonusy cech (+X) | Stały bonus dodawany do cechy — niezależnie od wybranej przez ciebie wartości. Np. Krasnolud: +2 KON zawsze. |
| Podrasę | Specjalizacja w ramach rasy. Daje dodatkowe cechy, bonusy i czasem zaklęcia. Wybierana raz, na stałe. |

### Krok 4 — Tło (TloForm) — PRIORYTET ŚREDNI

| Element | Tooltip |
|---------|---------|
| Cechy Charakteru | Krótkie zdania opisujące zachowanie postaci. Brak mechanicznego efektu — budują klimat i pomagają odgrywać postać. |
| Ideał | Przekonanie lub wartość którą postać wyznaje. Może wpływać na interakcje z frakcjami w grze MG. |
| Więź | Osoba, miejsce lub przedmiot wyjątkowo ważny dla postaci. MG może to wykorzystać w fabule. |
| Wada | Słabość lub mroczna cecha charakteru. Dobra wada czyni postać ludzką i ciekawszą do odgrywania. |
| Cecha Specjalna (✦) | Unikalna umiejętność fabularna tła — np. Żołnierz ma stopień wojskowy, Przestępca ma kontakty w półświatku. MG decyduje jak to wykorzystać. |
| Biegłości tła | Umiejętności, w których masz automatyczną biegłość przez to tło. Dodają premię do biegłości do rzutów. |

### Krok 5 — Magia (MagiaForm) — PRIORYTET WYSOKI

| Element | Tooltip |
|---------|---------|
| Cantripy | Zaklęcia znane na pamięć — możesz ich używać do woli, bez slotów. Np. Ognisty Pocisk, Boski Płomień. Zawsze dostępne. |
| Zaklęcia Poz. 1 | Potężniejsze zaklęcia wymagające slotu zaklęć. Masz ograniczoną liczbę slotów na dzień — odnawiają się po długim odpoczynku. |
| Szkoła: Abjuracja | Zaklęcia ochronne: bariery, odpędzanie magii, odporności. |
| Szkoła: Wywoływanie | Przywołuje stworzenia lub obiekty z innego miejsca lub wymiaru. |
| Szkoła: Wróżbiarstwo | Przepowiada przyszłość i ujawnia ukryte informacje. |
| Szkoła: Oczarowanie | Wpływa na umysły, usypia, fascynuje lub rozkazuje. |
| Szkoła: Ewokacja | Tworzy energię — ogień, błyskawice, lód. Najbardziej ofensywna szkoła. |
| Szkoła: Iluzja | Tworzy fałszywe obrazy, dźwięki i wrażenia. Zmyla wrogów. |
| Szkoła: Nekromancja | Manipuluje życiem i śmiercią. Wysysa energię życiową lub ożywia umarłych. |
| Szkoła: Transmutacja | Zmienia właściwości istot i obiektów. Uniwersalna szkoła wsparcia. |
| Znacznik "Konc." | Wymaga Koncentracji — możesz utrzymywać tylko jedno takie zaklęcie na raz. Obrażenia mogą je przerwać (rzut KON DC 10). |
| Znacznik "Rytuał" | Można rzucić jako rytuał (10 min dłużej) bez zużywania slotu zaklęcia. Idealne do zaklęć użytkowych. |
| DC Zaklęć | Liczba którą wróg musi wyrzucić żeby oprzeć się zaklęciu. Im wyższe — tym trudniej im uciec. |
| Bonus Ataku | Dodawany do rzutu ataku zaklęciami wymagającymi trafienia (np. Ognisty Pocisk). |

### Krok 6 — Ekwipunek (EkwipunekForm) — PRIORYTET NISKI

| Element | Tooltip |
|---------|---------|
| Pakiet startowy | Gotowy zestaw ekwipunku dostosowany do klasy. Szybka opcja dla początkujących — wszystko co potrzebne na start. |
| Złoto do wydania | Alternatywa: dostajesz złoto i sam kupujesz sprzęt. Daje więcej kontroli, ale wymaga znajomości cen. |
| AC w panelu bojowym | Klasa Pancerza z wybranym ekwipunkiem. Zależy od rodzaju pancerza i modyfikatora Zręczności. |
| Premia Biegłości +2 | Stały bonus na poziomach 1–4. Dodawany do ataków bronią z biegłością, umiejętności i rzutów obronnych klasy. |

### Krok 7 — Koncept (KonceptForm) — PRIORYTET NISKI

| Element | Tooltip |
|---------|---------|
| Postawa: LG (Praworządny Dobry) | Honorowy obrońca. Żyje według kodeksu i czyni dobro w ramach prawa i ładu. Np. Rycerz. |
| Postawa: NG (Neutralny Dobry) | Czyni dobro jak może, bez przywiązania do reguł ani chaosu. Np. Wędrowny Uzdrowiciel. |
| Postawa: CG (Chaotyczny Dobry) | Wolny duch idący za sercem. Czyni dobro po swojemu, niezależnie od zasad. Np. Robin Hood. |
| Postawa: LN (Praworządny Neutralny) | Przestrzega prawa i porządku ponad wszystko. Dobro i zło są drugorzędne. Np. Sędzia. |
| Postawa: TN (Prawdziwa Neutralność) | Stara się zachować balans. Nie angażuje się po żadnej stronie. Np. Druid. |
| Postawa: CN (Chaotyczny Neutralny) | Kieruje się własnym impulsem. Nie zły, ale nieprzewidywalny. Np. Kłopotliwy łotrzyk. |
| Postawa: LE (Praworządny Zły) | Tyran. Używa prawa i struktury do własnych celów. Np. Skorumpowany Inkwizytor. |
| Postawa: NE (Neutralny Zły) | Robi co chce dla własnego zysku bez skrupułów. Np. Najemnik gotowy na wszystko. |
| Postawa: CE (Chaotyczny Zły) | Niszczy i sieje chaos dla samego chaosu. Najtrudniejszy w drużynie. Np. Demon. |

---

## STAGE 3 — Implementacja tooltipów w każdym kroku

Kolejność implementacji (priorytet → złożoność):

1. **CechyForm** — tooltopy przy każdej cesze, zakładkach metod, podsumowaniu statystyk
2. **KlasaForm** — role, kość trafień, synergy star, trudność, rzuty obronne
3. **MagiaForm** — szkoły, cantripy vs zaklęcia, znaczniki Konc./Rytuał, statystyki magii
4. **RasaForm** — rozmiar, szybkość, PHB badge, bonusy cech
5. **TloForm** — cechy charakteru, ideał, wada, więź, cecha specjalna
6. **EkwipunekForm** — pakiet vs złoto, AC, premia biegłości
7. **KonceptForm** — 9 postaw moralnych

### Wzorzec implementacji (per krok)
```tsx
import Tooltip from "@/shared/ui/Tooltip";

// Przed:
<span>SIŁ</span>

// Po:
<Tooltip content="Określa obrażenia w walce wręcz, udźwig i próby fizyczne...">
  <span>SIŁ</span>
</Tooltip>
```

### Checklist Stage 3
- [ ] CechyForm — cechy + zakładki + podsumowanie
- [ ] KlasaForm — role + kość + synergia + trudność
- [ ] MagiaForm — szkoły + typy + statystyki
- [ ] RasaForm — rozmiar + szybkość + PHB + bonusy
- [ ] TloForm — cechy + ideał + wada + więź + special
- [ ] EkwipunekForm — pakiet + gold + AC
- [ ] KonceptForm — 9 postaw

---

## Pliki do modyfikacji

| Plik | Akcja |
|------|-------|
| `src/shared/ui/Tooltip.tsx` | NOWY — generyczny komponent |
| `src/domains/character/components/CechyForm.tsx` | Modyfikacja |
| `src/domains/character/components/KlasaForm.tsx` | Modyfikacja |
| `src/domains/character/components/MagiaForm.tsx` | Modyfikacja |
| `src/domains/character/components/RasaForm.tsx` | Modyfikacja |
| `src/domains/character/components/TloForm.tsx` | Modyfikacja |
| `src/domains/character/components/EkwipunekForm.tsx` | Modyfikacja |
| `src/domains/character/components/KonceptForm.tsx` | Modyfikacja |
