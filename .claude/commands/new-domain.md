Utwórz nową domenę DDD o nazwie: $ARGUMENTS

Wykonaj następujące kroki:

1. Utwórz strukturę folderów w `src/domains/$ARGUMENTS/`:
   - `actions/index.ts` — pusty eksport
   - `components/index.ts` — pusty eksport
   - `schemas/index.ts` — przykładowy Zod schema
   - `types/index.ts` — przykładowy typ TypeScript

2. W `schemas/index.ts` utwórz przykładowy schemat:
```ts
import { z } from "zod";

export const create$ARGUMENTSSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
});

export type Create$ARGUMENTSInput = z.infer<typeof create$ARGUMENTSSchema>;
```

3. W `types/index.ts` utwórz przykładowy typ bazowy domeny.

4. W `actions/index.ts` utwórz przykładowy Server Action z walidacją Zod i obsługą błędów.

5. Po utworzeniu plików uruchom `npx tsc --noEmit` i napraw ewentualne błędy.

6. Podsumuj co zostało utworzone i jakie następne kroki są potrzebne.
