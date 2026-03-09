Zarządzaj bazą danych. Argument: $ARGUMENTS

Dostępne operacje — wykonaj tę która pasuje do argumentu:

**push** — zsynchronizuj schemat z bazą (dev):
- Uruchom `npx prisma db push`
- Następnie `npx prisma generate`

**studio** — otwórz Prisma Studio:
- Uruchom `npx prisma studio`
- Poinformuj że panel będzie dostępny na http://localhost:5555

**reset** — zresetuj bazę (UWAGA: usuwa wszystkie dane):
- Zapytaj użytkownika o potwierdzenie przed wykonaniem
- Uruchom `npx prisma db push --force-reset`

**generate** — wygeneruj klienta Prisma po zmianie schematu:
- Uruchom `npx prisma generate`

**status** — pokaż stan bazy:
- Uruchom `npx prisma db pull` w trybie dry-run
- Pokaż aktualny schemat z `prisma/schema.prisma`

Jeśli nie podano argumentu — pokaż listę dostępnych operacji.
