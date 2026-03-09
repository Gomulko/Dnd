/**
 * Prisma Seed — konto testowe + 3 gotowe postacie
 *
 * Uruchom: npx prisma db seed
 * Login:   test@kroniki.pl / Test1234!
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seedowanie bazy danych...");

  // ── 1. Konto testowe ────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("Test1234!", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@kroniki.pl" },
    update: {},
    create: {
      email: "test@kroniki.pl",
      name: "Tester",
      password: passwordHash,
    },
  });

  console.log(`✅ Użytkownik: ${user.email}`);

  // ── 2. Postać 1 — Kleryk ────────────────────────────────────────────────
  const kleryk = await prisma.character.upsert({
    where: { id: "seed-char-kleryk" },
    update: {},
    create: {
      id: "seed-char-kleryk",
      userId: user.id,
      isComplete: true,

      // Koncept
      name: "Aldric Swietlisty",
      gender: "mezczyzna",
      age: 34,
      height: 178,
      alignment: "LG",
      description:
        "Dawny żołnierz, który po przeżyciu masakry w Dolinie Srebrnych Łez złożył przysięgę służby Pelor. Nosi na szyi medal poległych towarzyszy.",

      // Rasa
      race: "human",
      subrace: undefined,

      // Klasa
      class: "cleric",
      subclass: "life",
      level: 3,
      skills: JSON.stringify(["medicine", "religion", "insight", "persuasion"]),

      // Cechy
      strength: 14,
      dexterity: 10,
      constitution: 15,
      intelligence: 12,
      wisdom: 17,
      charisma: 13,

      // Tło
      background: "soldier",
      personalityTraits: JSON.stringify([
        "Zawsze pomagam rannym, nawet wrogom.",
        "Mówię wprost, bez owijania w bawełnę.",
      ]),
      ideals: JSON.stringify(["Życie każdej istoty jest święte."]),
      bonds: JSON.stringify(["Moja drużyna jest moją nową rodziną."]),
      flaws: JSON.stringify([
        "Mam problem z autorytetami, które stawiają dobro polityki nad dobro ludzi.",
      ]),
      languages: JSON.stringify(["wspólny", "niebiański"]),
      backstory:
        "Aldric służył przez 10 lat jako żołnierz zanim widok zbyt wielu bezsensownych śmierci skłonił go do porzucenia miecza za lekarskie narzędzia. Teraz wędruje, lecząc ciało i duszę.",

      // Ekwipunek
      equipment: JSON.stringify([
        { name: "Kolczuga", qty: 1, weight: 20 },
        { name: "Tarcza", qty: 1, weight: 3 },
        { name: "Buzdygan", qty: 1, weight: 2 },
        { name: "Święty symbol (Pelor)", qty: 1, weight: 0 },
        { name: "Zwój modlitewny", qty: 1, weight: 0 },
        { name: "Racje żywnościowe", qty: 5, weight: 5 },
      ]),
      gold: 45,

      // Magia
      cantrips: JSON.stringify(["sacred-flame", "guidance", "spare-the-dying"]),
      spells: JSON.stringify([
        "bless",
        "cure-wounds",
        "healing-word",
        "shield-of-faith",
        "guiding-bolt",
        "sanctuary",
      ]),

      // Stan
      currentHp: 28,
      tempHp: 0,
      deathSaves: JSON.stringify({ successes: 0, failures: 0 }),
      sessionNotes: "Drużyna jest w Karczmie Srebrnego Gryfa. Jutro wyruszamy do ruin Arythalu.",
    },
  });

  console.log(`✅ Postać: ${kleryk.name} (${kleryk.class} poz.${kleryk.level})`);

  // ── 3. Postać 2 — Łotrzyk ───────────────────────────────────────────────
  const lotrzyk = await prisma.character.upsert({
    where: { id: "seed-char-lotrzyk" },
    update: {},
    create: {
      id: "seed-char-lotrzyk",
      userId: user.id,
      isComplete: true,

      // Koncept
      name: "Mira Cienioszeptka",
      gender: "kobieta",
      age: 22,
      height: 162,
      alignment: "CN",
      description:
        "Pół-elfka wychowana w slumsach Miasteczka Czarnego Dymu. Przeżyła dzięki zwinnym palcom i jeszcze zwinniejszemu językowi.",

      // Rasa
      race: "half-elf",
      subrace: undefined,

      // Klasa
      class: "rogue",
      subclass: "thief",
      level: 4,
      skills: JSON.stringify([
        "stealth",
        "sleight-of-hand",
        "deception",
        "perception",
        "acrobatics",
        "thieves-tools",
      ]),

      // Cechy
      strength: 9,
      dexterity: 18,
      constitution: 13,
      intelligence: 14,
      wisdom: 12,
      charisma: 16,

      // Tło
      background: "criminal",
      personalityTraits: JSON.stringify([
        "Zawsze mam plan ucieczki.",
        "Jestem niesłychanie spokojna nawet w najbardziej napiętych sytuacjach.",
      ]),
      ideals: JSON.stringify(["Wolność — nikt nie ma prawa mi mówić co robić."]),
      bonds: JSON.stringify(["Winnam dług życia staremu złodziejowi, który mnie uratował."]),
      flaws: JSON.stringify(["Gdy widzę cenny przedmiot, ręce same go sięgają."]),
      languages: JSON.stringify(["wspólny", "elficki", "thieves-cant"]),
      backstory:
        "Mira nie pamięta rodziców. Gildia Cieni wychowała ją na mistrzynię włamań. Teraz pracuje na własny rachunek — co bywa zarówno bardziej opłacalne, jak i niebezpieczne.",

      // Ekwipunek
      equipment: JSON.stringify([
        { name: "Skórzana zbroja", qty: 1, weight: 5 },
        { name: "Sztylet", qty: 2, weight: 1 },
        { name: "Krótki miecz", qty: 1, weight: 2 },
        { name: "Wytrychy", qty: 1, weight: 0 },
        { name: "Lina (15m)", qty: 1, weight: 2 },
        { name: "Ciemny płaszcz", qty: 1, weight: 0 },
        { name: "Fałszywy dokument tożsamości", qty: 1, weight: 0 },
      ]),
      gold: 112,

      // Magia — brak (łotrzyk nie rzuca czarów)
      cantrips: JSON.stringify([]),
      spells: JSON.stringify([]),

      // Stan
      currentHp: 21,
      tempHp: 0,
      deathSaves: JSON.stringify({ successes: 0, failures: 0 }),
      sessionNotes: "",
    },
  });

  console.log(`✅ Postać: ${lotrzyk.name} (${lotrzyk.class} poz.${lotrzyk.level})`);

  // ── 4. Postać 3 — Czarodziej (niedokończona) ────────────────────────────
  const czarodziej = await prisma.character.upsert({
    where: { id: "seed-char-czarodziej" },
    update: {},
    create: {
      id: "seed-char-czarodziej",
      userId: user.id,
      isComplete: false, // ← w trakcie tworzenia

      // Koncept
      name: "Zephyros",
      gender: "mezczyzna",
      age: 19,
      height: 170,
      alignment: "NG",
      description: "Młody uczeń Akademii Magicznej z Solhaven.",

      // Rasa
      race: "high-elf",
      subrace: "high",

      // Klasa — kreator zatrzymał się tutaj
      class: "wizard",
      subclass: undefined,
      level: 1,
      skills: JSON.stringify([]),

      // Cechy
      strength: 8,
      dexterity: 14,
      constitution: 12,
      intelligence: 17,
      wisdom: 13,
      charisma: 10,

      // Tło — jeszcze nie wybrane
      background: undefined,
      personalityTraits: JSON.stringify([]),
      ideals: JSON.stringify([]),
      bonds: JSON.stringify([]),
      flaws: JSON.stringify([]),
      languages: JSON.stringify(["wspólny", "elficki"]),

      // Ekwipunek — startowy
      equipment: JSON.stringify([
        { name: "Różdżka", qty: 1, weight: 0 },
        { name: "Księga czarów", qty: 1, weight: 1.5 },
        { name: "Szaty maga", qty: 1, weight: 0 },
      ]),
      gold: 10,

      // Magia
      cantrips: JSON.stringify(["fire-bolt", "mage-hand", "light"]),
      spells: JSON.stringify([]),

      // Stan
      currentHp: 8,
      tempHp: 0,
      deathSaves: JSON.stringify({ successes: 0, failures: 0 }),
    },
  });

  console.log(`✅ Postać: ${czarodziej.name} (${czarodziej.class} poz.${czarodziej.level}, niedokończona)`);

  console.log("\n🎲 Seed zakończony!");
  console.log("   Login:  test@kroniki.pl");
  console.log("   Hasło:  Test1234!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
