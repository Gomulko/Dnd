# Kroniki Przygód — Plan wdrożenia na produkcję

> Dla osoby, która nigdy wcześniej nie deployowała aplikacji webowej.
> Szacowany czas: **45–60 minut**.

---

## Co się stanie po tym przewodniku?

Twoja aplikacja będzie dostępna pod adresem np. `kroniki-przygod.vercel.app` — każdy z internetu będzie mógł się zarejestrować i używać jej.

Użyjemy dwóch bezpłatnych usług:
- **Vercel** — hosting aplikacji Next.js (od twórców Next.js, darmowy tier w zupełności wystarczy)
- **Neon** — baza danych PostgreSQL w chmurze (darmowy tier: 0.5 GB, wystarczy na setki postaci)

---

## ~~Krok 1 — Przygotuj schemat bazy pod PostgreSQL~~ ✅ DONE

Aktualnie projekt używa SQLite (plik `dev.db`). Na produkcji potrzebujemy PostgreSQL.

### 1.1 Zmień provider w `prisma/schema.prisma`

Otwórz plik `prisma/schema.prisma` i zmień linię 6:

```prisma
// PRZED:
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// PO:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### 1.2 Sprawdź TypeScript i zacommituj zmianę

```bash
npx tsc --noEmit
git add prisma/schema.prisma
git commit -m "chore: switch db provider to postgresql for production"
git push
```

---

## ~~Krok 2 — Utwórz bazę danych na Neon~~ ✅ DONE

1. Wejdź na **https://neon.tech** i kliknij **Sign Up** (możesz użyć konta GitHub)
2. Po zalogowaniu kliknij **New Project**
3. Wypełnij:
   - **Project name**: `kroniki-przygod` (lub cokolwiek)
   - **Database name**: `kroniki` (lub zostaw domyślną)
   - **Region**: wybierz `eu-central-1` (Frankfurt) — najbliżej Polski
4. Kliknij **Create project**
5. Na stronie projektu kliknij **Connection string** → wybierz zakładkę **Prisma**
6. Zobaczysz dwa stringi — **skopiuj oba i zachowaj gdzieś** (np. w notatniku):
   ```
   DATABASE_URL="postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/kroniki?sslmode=require"
   DIRECT_URL="postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/kroniki?sslmode=require"
   ```
   > Uwaga: te stringi zawierają hasło — nie wrzucaj ich do kodu/GitHuba!

---

## Krok 3 — Utwórz konto na Vercel i połącz z GitHubem

1. Wejdź na **https://vercel.com** i kliknij **Sign Up**
2. Wybierz **Continue with GitHub** — zaloguj się kontem GitHub
3. Vercel poprosi o uprawnienia do repozytoriów → kliknij **Authorize Vercel**

---

## Krok 4 — Importuj projekt na Vercel

1. Na dashboardzie Vercel kliknij **Add New... → Project**
2. Znajdź repozytorium `Dnd` (lub jak je nazwałeś) i kliknij **Import**
3. Vercel automatycznie wykryje Next.js — **nic nie zmieniaj** w sekcji "Build & Output Settings"
4. Rozwiń sekcję **Environment Variables** i dodaj po kolei:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | (wklej DATABASE_URL z Neon) |
   | `DIRECT_URL` | (wklej DIRECT_URL z Neon) |
   | `NEXTAUTH_SECRET` | (wygeneruj poniżej) |
   | `NEXTAUTH_URL` | `https://TWOJA-NAZWA.vercel.app` (uzupełnisz po deploymencie — wróć tu) |

   **Jak wygenerować NEXTAUTH_SECRET?**
   Otwórz terminal i wpisz:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Skopiuj wynik (długi ciąg liter i cyfr) i wklej jako wartość `NEXTAUTH_SECRET`.

5. Kliknij **Deploy** i poczekaj ~2 minuty

---

## Krok 5 — Uzupełnij NEXTAUTH_URL po deploymencie

1. Po zakończeniu deploymentu Vercel pokaże Ci adres aplikacji, np. `kroniki-przygod-xxx.vercel.app`
2. Wróć do **Settings → Environment Variables** w projekcie na Vercel
3. Znajdź `NEXTAUTH_URL` i zmień wartość na `https://kroniki-przygod-xxx.vercel.app` (Twój rzeczywisty adres)
4. Kliknij **Save**
5. Przejdź do **Deployments** i kliknij **Redeploy** na ostatnim deploymencie (żeby załadować nową zmienną)

---

## ~~Krok 6 — Uruchom migrację bazy danych~~ ✅ DONE

Baza na Neon jest pusta — trzeba w niej stworzyć tabele.

W lokalnym terminalu (w folderze projektu):

```bash
# Tymczasowo ustaw DATABASE_URL na produkcyjną bazę Neon
# (tylko do uruchomienia migracji — potem usuń)

DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/kroniki?sslmode=require" \
DIRECT_URL="postgresql://user:password@ep-xxx.neon.tech/kroniki?sslmode=require" \
npx prisma db push
```

> Na Windows (PowerShell) składnia jest inna:
> ```powershell
> $env:DATABASE_URL="postgresql://..."
> $env:DIRECT_URL="postgresql://..."
> npx prisma db push
> ```

Powinieneś zobaczyć:
```
✔ Your database is now in sync with your Prisma schema.
```

---

## Krok 7 — Utwórz konto testowe w produkcyjnej bazie

Po migracji baza jest pusta (brak użytkowników). Zarejestruj pierwsze konto przez interfejs aplikacji:

1. Wejdź na `https://TWOJA-NAZWA.vercel.app/rejestracja`
2. Utwórz swoje konto
3. Gotowe — możesz logować się i używać aplikacji

> Jeśli chcesz mieć konto `test@kroniki.pl`, po prostu zarejestruj je przez formularz.

---

## Krok 8 — Sprawdź czy wszystko działa

Przejdź przez checklistę:

- [ ] `https://TWOJA-NAZWA.vercel.app` — strona ładuje się
- [ ] `/rejestracja` — można się zarejestrować
- [ ] `/logowanie` — można się zalogować
- [ ] `/dashboard` — widać dashboard (po zalogowaniu)
- [ ] Utwórz postać przez kreator — przechodzi wszystkie kroki
- [ ] Karta postaci — wyświetla się poprawnie
- [ ] `/rzutnik` — rzucanie kośćmi działa

---

## Krok 9 — Własna domena (opcjonalnie)

Jeśli chcesz adres `kronikiprzygod.pl` zamiast `xxx.vercel.app`:

1. Kup domenę na np. **domeny.pl**, **OVH** lub **Cloudflare Registrar**
2. W Vercel: **Settings → Domains → Add Domain**
3. Wpisz domenę i postępuj zgodnie z instrukcją (zmiana rekordów DNS u rejestratora)
4. Pamiętaj zaktualizować `NEXTAUTH_URL` na nową domenę i zrobić redeploy

---

## Automatyczny redeploy przy każdym `git push`

Vercel automatycznie przebuduje aplikację przy każdym `git push` na `master`. Nie musisz nic robić — zmiany w kodzie są od razu widoczne online po ~1 minucie.

---

## Zmienne środowiskowe — podsumowanie

| Zmienna | Gdzie wziąć | Przykład |
|---------|-------------|---------|
| `DATABASE_URL` | Neon → Connection string (Prisma) | `postgresql://user:pass@host/db?sslmode=require` |
| `DIRECT_URL` | Neon → Connection string (Prisma) | jak wyżej |
| `NEXTAUTH_SECRET` | Wygeneruj lokalnie (`node -e ...`) | `a1b2c3d4...` (64 znaki hex) |
| `NEXTAUTH_URL` | Twój adres Vercel | `https://kroniki.vercel.app` |

---

## Jeśli coś nie działa

**Build fail na Vercel** — sprawdź logi w zakładce "Build Logs". Najczęstszy błąd: brakująca zmienna środowiskowa.

**Error 500 po zalogowaniu** — sprawdź czy `NEXTAUTH_URL` jest ustawiony na właściwy adres (z `https://`).

**"Cannot connect to database"** — sprawdź czy `DATABASE_URL` jest poprawny i czy `npx prisma db push` przebiegło bez błędów.

**Strona pokazuje stary kod** — Vercel cache: kliknij **Redeploy** w zakładce Deployments.
