/**
 * ŹRÓDŁO PRAWDY — Rasy D&D
 *
 * Źródło: SRD 5.2.1 (rules/rules.txt) + PHB dla oznaczonych
 *
 * WAŻNA UWAGA — SRD 5.2.1 vs stare zasady:
 * W SRD 5.2.1 rasy NIE dają bonusów do statystyk — bonusy
 * do statystyk pochodzą z TŁA postaci (background).
 * W PROJEKCIE używamy STARYCH bonusów rasowych (widoki Figmy)
 * dla lepszego UX kreatora. Oznaczone jako statBonuses.
 *
 * Rasy w SRD 5.2.1: Dragonborn, Dwarf, Elf, Gnome, Goliath,
 *                    Halfling, Human, Orc, Tiefling
 * Rasy z PHB (NIE w SRD): Half-Elf (Półelf), Half-Orc (Półork)
 */

export type StatKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface RacialTrait {
  name: string;
  nameEn: string;
  description: string;
  source: "SRD" | "PHB";
}

export interface Subrace {
  id: string;
  name: string;
  nameEn: string;
  statBonuses: Partial<Record<StatKey, number>>;
  traits: RacialTrait[];
}

export interface Race {
  id: string;
  name: string;           // Polski
  nameEn: string;         // Angielski (SRD)
  description: string;
  size: "Small" | "Medium";
  speed: number;          // stóp
  statBonuses: Partial<Record<StatKey, number>>;  // stare zasady dla UX
  subraces: Subrace[];
  traits: RacialTrait[];
  languages: string[];
  source: "SRD" | "PHB";
  icon: string;           // emoji
  roleplayHint: string;   // krótki opis do UI
}

export const RACES: Race[] = [
  {
    id: "human",
    name: "Człowiek",
    nameEn: "Human",
    description: "Wszechstronni i ambitni — panowie przeznaczenia",
    size: "Medium",
    speed: 30,
    statBonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    subraces: [],
    traits: [
      {
        name: "Zaradny",
        nameEn: "Resourceful",
        description: "Zyskujesz Bohaterską Inspirację po każdym długim odpoczynku.",
        source: "SRD",
      },
      {
        name: "Biegły",
        nameEn: "Skillful",
        description: "Zyskujesz biegłość w jednej umiejętności według wyboru.",
        source: "SRD",
      },
      {
        name: "Wszechstronny",
        nameEn: "Versatile",
        description: "Zyskujesz feat Pochodzenia według wyboru.",
        source: "SRD",
      },
    ],
    languages: ["Wspólny", "Jeden wg wyboru"],
    source: "SRD",
    icon: "🧑",
    roleplayHint: "+1 do wszystkich statystyk",
  },
  {
    id: "dwarf",
    name: "Krasnolud",
    nameEn: "Dwarf",
    description: "Nieugieci i wytrwali strażnicy gór",
    size: "Medium",
    speed: 25,
    statBonuses: { con: 2 },
    subraces: [
      {
        id: "hill-dwarf",
        name: "Wzgórzowy Krasnolud",
        nameEn: "Hill Dwarf",
        statBonuses: { wis: 1 },
        traits: [
          {
            name: "Krasnoludzka Wytrzymałość",
            nameEn: "Dwarven Toughness",
            description: "Twoje maksimum HP wzrasta o 1, i wzrasta o 1 za każdy poziom.",
            source: "PHB",
          },
        ],
      },
      {
        id: "mountain-dwarf",
        name: "Górski Krasnolud",
        nameEn: "Mountain Dwarf",
        statBonuses: { str: 2 },
        traits: [
          {
            name: "Trening Krasnoludzkiej Zbroi",
            nameEn: "Dwarven Armor Training",
            description: "Biegłość z lekką i średnią zbroją.",
            source: "PHB",
          },
        ],
      },
    ],
    traits: [
      {
        name: "Ciemnowidz",
        nameEn: "Darkvision",
        description: "Widzisz w ciemności do 120 stóp w skali szarości.",
        source: "SRD",
      },
      {
        name: "Krasnoludzkia Odporność",
        nameEn: "Dwarven Resilience",
        description: "Odporność na obrażenia od trucizny. Przewaga na rzuty obronne przeciwko Zatruciu.",
        source: "SRD",
      },
      {
        name: "Krasnoludzkia Wytrzymałość (SRD)",
        nameEn: "Stonecunning",
        description: "Jako bonus action zyskujesz Tremorsense 60 stóp na 10 minut (na kamiennej powierzchni). Liczba użyć = bonus biegłości. Odnawia się po długim odpoczynku.",
        source: "SRD",
      },
      {
        name: "Biegłość z Bronią Krasnoludów",
        nameEn: "Dwarven Combat Training",
        description: "Biegłość z toporem bojowym, ręcznym toporem, lekkim młotem i wojennym młotem.",
        source: "PHB",
      },
    ],
    languages: ["Wspólny", "Krasnoludzki"],
    source: "SRD",
    icon: "⛏",
    roleplayHint: "+2 KON",
  },
  {
    id: "elf",
    name: "Elf",
    nameEn: "Elf",
    description: "Gracka i wiekuista rasa lasów i magii",
    size: "Medium",
    speed: 30,
    statBonuses: { dex: 2 },
    subraces: [
      {
        id: "high-elf",
        name: "Wysoki Elf",
        nameEn: "High Elf",
        statBonuses: { int: 1 },
        traits: [
          {
            name: "Linia Elfów — Wysoki",
            nameEn: "Elven Lineage — High Elf",
            description: "Znasz cantrip Prestidigitation. Na poz. 3: Detect Magic. Na poz. 5: Misty Step. Zdolność czarowania: INT/MĄD/CHA (wybór).",
            source: "SRD",
          },
        ],
      },
      {
        id: "wood-elf",
        name: "Leśny Elf",
        nameEn: "Wood Elf",
        statBonuses: { wis: 1 },
        traits: [
          {
            name: "Linia Elfów — Leśny",
            nameEn: "Elven Lineage — Wood Elf",
            description: "Prędkość wzrasta do 35 stóp. Znasz cantrip Druidcraft. Na poz. 3: Longstrider. Na poz. 5: Pass without Trace.",
            source: "SRD",
          },
        ],
      },
      {
        id: "drow",
        name: "Drow",
        nameEn: "Drow",
        statBonuses: { cha: 1 },
        traits: [
          {
            name: "Linia Elfów — Drow",
            nameEn: "Elven Lineage — Drow",
            description: "Zasięg Ciemnowidza wzrasta do 120 stóp. Znasz cantrip Dancing Lights. Na poz. 3: Faerie Fire. Na poz. 5: Darkness.",
            source: "SRD",
          },
        ],
      },
    ],
    traits: [
      {
        name: "Ciemnowidz",
        nameEn: "Darkvision",
        description: "Widzisz w ciemności do 60 stóp w skali szarości.",
        source: "SRD",
      },
      {
        name: "Odporność na Czarowanie",
        nameEn: "Fey Ancestry",
        description: "Przewaga na rzuty obronne przeciwko Oczarowaniu.",
        source: "SRD",
      },
      {
        name: "Trans",
        nameEn: "Trance",
        description: "Nie potrzebujesz snu. Długi odpoczynek = 4 godziny transu, podczas którego zachowujesz świadomość. Zyskujesz biegłość w Wnikliwości, Percepcji lub Przetrwaniu.",
        source: "SRD",
      },
    ],
    languages: ["Wspólny", "Elficki"],
    source: "SRD",
    icon: "🌿",
    roleplayHint: "+2 ZRR",
  },
  {
    id: "halfling",
    name: "Niziołek",
    nameEn: "Halfling",
    description: "Weseli i szczęśliwi mieszkańcy wsi",
    size: "Small",
    speed: 30,
    statBonuses: { dex: 2 },
    subraces: [
      {
        id: "lightfoot",
        name: "Lekkonogi",
        nameEn: "Lightfoot",
        statBonuses: { cha: 1 },
        traits: [
          {
            name: "Skryty w Naturze",
            nameEn: "Naturally Stealthy",
            description: "Możesz używać akcji Chowanie się nawet zasłonięty tylko przez stworzenie większe od siebie.",
            source: "PHB",
          },
        ],
      },
      {
        id: "stout",
        name: "Rubaszny",
        nameEn: "Stout",
        statBonuses: { con: 1 },
        traits: [
          {
            name: "Odporność Rubasznego",
            nameEn: "Stout Resilience",
            description: "Odporność na obrażenia od trucizny. Przewaga na rzuty obronne przeciwko Zatruciu.",
            source: "PHB",
          },
        ],
      },
    ],
    traits: [
      {
        name: "Odważny",
        nameEn: "Brave",
        description: "Przewaga na rzuty obronne przeciwko Przestrachu.",
        source: "SRD",
      },
      {
        name: "Zwinność Niziołka",
        nameEn: "Halfling Nimbleness",
        description: "Możesz przechodzić przez przestrzeń każdego stworzenia większego od siebie.",
        source: "SRD",
      },
      {
        name: "Naturalne Szczęście",
        nameEn: "Lucky",
        description: "Gdy wyrzucisz 1 na k20 przy teście, przerzucaj kość i użyj nowego wyniku.",
        source: "SRD",
      },
    ],
    languages: ["Wspólny", "Niziołkowy"],
    source: "SRD",
    icon: "🍀",
    roleplayHint: "+2 ZRR",
  },
  {
    id: "half-elf",
    name: "Półelf",
    nameEn: "Half-Elf",
    description: "Dziedzice dwóch światów, pełni wdzięku",
    size: "Medium",
    speed: 30,
    statBonuses: { cha: 2, dex: 1, wis: 1 }, // +2 CHA, +1 do 2 wg wyboru
    subraces: [],
    traits: [
      {
        name: "Ciemnowidz",
        nameEn: "Darkvision",
        description: "Widzisz w ciemności do 60 stóp w skali szarości.",
        source: "PHB",
      },
      {
        name: "Odporność na Czarowanie",
        nameEn: "Fey Ancestry",
        description: "Przewaga na rzuty obronne przeciwko Oczarowaniu.",
        source: "PHB",
      },
      {
        name: "Wszechstronność",
        nameEn: "Skill Versatility",
        description: "Zyskujesz biegłość w 2 umiejętnościach według wyboru.",
        source: "PHB",
      },
    ],
    languages: ["Wspólny", "Elficki", "Jeden wg wyboru"],
    source: "PHB",
    icon: "✨",
    roleplayHint: "+2 CHA, +1 do 2 wg wyboru",
  },
  {
    id: "half-orc",
    name: "Półork",
    nameEn: "Half-Orc",
    description: "Potężni i zdeterminowani wojownicy",
    size: "Medium",
    speed: 30,
    statBonuses: { str: 2, con: 1 },
    subraces: [],
    traits: [
      {
        name: "Ciemnowidz",
        nameEn: "Darkvision",
        description: "Widzisz w ciemności do 60 stóp w skali szarości.",
        source: "PHB",
      },
      {
        name: "Groźny",
        nameEn: "Menacing",
        description: "Zyskujesz biegłość w umiejętności Zastraszanie.",
        source: "PHB",
      },
      {
        name: "Nieustępliwy",
        nameEn: "Relentless Endurance",
        description: "Gdy HP spada do 0 ale nie giniesz — zamiast tego HP = 1. Raz na długi odpoczynek.",
        source: "PHB",
      },
      {
        name: "Atak z Kością Kości",
        nameEn: "Savage Attacks",
        description: "Przy trafieniu krytycznym ataku bronią melee, rzucaj jedną dodatkową kością obrażeń.",
        source: "PHB",
      },
    ],
    languages: ["Wspólny", "Orkowy"],
    source: "PHB",
    icon: "⚔",
    roleplayHint: "+2 SIŁ, +1 KON",
  },
  {
    id: "gnome",
    name: "Gnom",
    nameEn: "Gnome",
    description: "Genialni wynalazcy i miłośnicy magii",
    size: "Small",
    speed: 30,
    statBonuses: { int: 2 },
    subraces: [
      {
        id: "forest-gnome",
        name: "Leśny Gnom",
        nameEn: "Forest Gnome",
        statBonuses: { dex: 1 },
        traits: [
          {
            name: "Linia Gnomów — Leśny",
            nameEn: "Gnomish Lineage — Forest",
            description: "Znasz cantrip Minor Illusion i Speak with Animals. Zdolność czarowania: INT/MĄD/CHA.",
            source: "SRD",
          },
        ],
      },
      {
        id: "rock-gnome",
        name: "Kamienny Gnom",
        nameEn: "Rock Gnome",
        statBonuses: { con: 1 },
        traits: [
          {
            name: "Linia Gnomów — Kamienny",
            nameEn: "Gnomish Lineage — Rock",
            description: "Znasz cantrips Prestidigitation i Mending. Możesz tworzyć małe urządzenia mechaniczne.",
            source: "SRD",
          },
        ],
      },
    ],
    traits: [
      {
        name: "Ciemnowidz",
        nameEn: "Darkvision",
        description: "Widzisz w ciemności do 60 stóp w skali szarości.",
        source: "SRD",
      },
      {
        name: "Przebiegłość Gnoma",
        nameEn: "Gnomish Cunning",
        description: "Przewaga na rzuty obronne INT, MĄD i CHA przeciwko magii.",
        source: "SRD",
      },
    ],
    languages: ["Wspólny", "Gnomski"],
    source: "SRD",
    icon: "⚙",
    roleplayHint: "+2 INT",
  },
  {
    id: "dragonborn",
    name: "Dragonborn",
    nameEn: "Dragonborn",
    description: "Dumni potomkowie smoków z ognistym oddechem",
    size: "Medium",
    speed: 30,
    statBonuses: { str: 2, cha: 1 },
    subraces: [],
    traits: [
      {
        name: "Smocze Dziedzictwo",
        nameEn: "Draconic Ancestry",
        description: "Wybierz typ smoka (Czarny/Niebieski/Mosiężny/Brązowy/Miedziany/Złoty/Zielony/Czerwony/Srebrny/Biały). Określa typ obrażeń oddechu i odporność.",
        source: "SRD",
      },
      {
        name: "Oddech",
        nameEn: "Breath Weapon",
        description: "Akcja: stożek 15 stóp lub linia 30×5 stóp. ST na ZRR (DC 8 + mod KON + bonus biegłości). Obrażenia: 1k10 (rośnie na poz. 5/11/17). Liczba użyć = bonus biegłości.",
        source: "SRD",
      },
      {
        name: "Odporność na Obrażenia",
        nameEn: "Damage Resistance",
        description: "Odporność na typ obrażeń Smoczego Dziedzictwa.",
        source: "SRD",
      },
      {
        name: "Smoczki Lot",
        nameEn: "Draconic Flight",
        description: "Od poz. 5: bonus action, skrzydła na 10 minut, prędkość lotu = prędkość. Raz na długi odpoczynek.",
        source: "SRD",
      },
    ],
    languages: ["Wspólny", "Smoczy"],
    source: "SRD",
    icon: "🐉",
    roleplayHint: "+2 SIŁ, +1 CHA",
  },
  {
    id: "goliath",
    name: "Goliath",
    nameEn: "Goliath",
    description: "Potomkowie gigantów, urodzeni na szczytach gór",
    size: "Medium",
    speed: 35,
    statBonuses: { str: 2, con: 1 },
    subraces: [],
    traits: [
      {
        name: "Budowa Atletyczna",
        nameEn: "Giant Ancestry",
        description: "Wybierz jedną z 6 zdolności gigantów: np. Kamienne Kopnięcie (przesuń stworzenie), Burzliwy Cios (knockback) lub inne. Liczba użyć = bonus biegłości.",
        source: "SRD",
      },
      {
        name: "Duże Ciało",
        nameEn: "Large Form",
        description: "Od poz. 5: bonus action, rośniesz do rozmiaru Dużego na 10 minut. Raz na długi odpoczynek.",
        source: "SRD",
      },
      {
        name: "Potężna Budowa",
        nameEn: "Powerful Build",
        description: "Liczysz się jako rozmiar Duży przy określaniu nośności.",
        source: "SRD",
      },
    ],
    languages: ["Wspólny", "Giant"],
    source: "SRD",
    icon: "🏔",
    roleplayHint: "+2 SIŁ, +1 KON",
  },
  {
    id: "orc",
    name: "Ork",
    nameEn: "Orc",
    description: "Dzicy i potężni wojownicy stepów",
    size: "Medium",
    speed: 30,
    statBonuses: { str: 2, con: 1 },
    subraces: [],
    traits: [
      {
        name: "Ciemnowidz",
        nameEn: "Darkvision",
        description: "Widzisz w ciemności do 120 stóp w skali szarości.",
        source: "SRD",
      },
      {
        name: "Agresja",
        nameEn: "Adrenaline Rush",
        description: "Bonus action: zyskujesz tymczasowe HP równe bonus biegłości i możesz poruszyć się do połowy prędkości. Liczba użyć = bonus biegłości. Odnawia się po długim odpoczynku.",
        source: "SRD",
      },
      {
        name: "Potężny Atak",
        nameEn: "Powerful Build",
        description: "Liczysz się jako rozmiar Duży przy określaniu nośności.",
        source: "SRD",
      },
      {
        name: "Relentless Endurance",
        nameEn: "Relentless Endurance",
        description: "Gdy HP spada do 0 ale nie giniesz — zamiast tego HP = 1. Raz na długi odpoczynek.",
        source: "SRD",
      },
    ],
    languages: ["Wspólny", "Orkowy"],
    source: "SRD",
    icon: "💀",
    roleplayHint: "+2 SIŁ, +1 KON",
  },
  {
    id: "tiefling",
    name: "Tiefling",
    nameEn: "Tiefling",
    description: "Infernalne dziedzictwo w ludzkim ciele",
    size: "Medium",
    speed: 30,
    statBonuses: { int: 1, cha: 2 },
    subraces: [
      {
        id: "abyssal",
        name: "Otchłański",
        nameEn: "Abyssal Legacy",
        statBonuses: {},
        traits: [
          {
            name: "Dziedzictwo Otchłańskie",
            nameEn: "Abyssal Legacy",
            description: "Odporność na obrażenia od trucizny. Cantrip: Poison Spray. Poz. 3: Ray of Sickness. Poz. 5: Hold Person.",
            source: "SRD",
          },
        ],
      },
      {
        id: "chthonic",
        name: "Chtoniczny",
        nameEn: "Chthonic Legacy",
        statBonuses: {},
        traits: [
          {
            name: "Dziedzictwo Chtoniczne",
            nameEn: "Chthonic Legacy",
            description: "Odporność na obrażenia nekrotyczne. Cantrip: Chill Touch. Poz. 3: False Life. Poz. 5: Ray of Enfeeblement.",
            source: "SRD",
          },
        ],
      },
      {
        id: "infernal",
        name: "Piekielny",
        nameEn: "Infernal Legacy",
        statBonuses: {},
        traits: [
          {
            name: "Dziedzictwo Piekielne",
            nameEn: "Infernal Legacy",
            description: "Odporność na obrażenia od ognia. Cantrip: Fire Bolt. Poz. 3: Hellish Rebuke. Poz. 5: Darkness.",
            source: "SRD",
          },
        ],
      },
    ],
    traits: [
      {
        name: "Ciemnowidz",
        nameEn: "Darkvision",
        description: "Widzisz w ciemności do 60 stóp w skali szarości.",
        source: "SRD",
      },
    ],
    languages: ["Wspólny", "Piekielny"],
    source: "SRD",
    icon: "😈",
    roleplayHint: "+2 CHA, +1 INT",
  },
];

export function getRaceById(id: string): Race | undefined {
  return RACES.find((r) => r.id === id);
}

export function getSubraceById(raceId: string, subraceId: string): Subrace | undefined {
  return getRaceById(raceId)?.subraces.find((s) => s.id === subraceId);
}
