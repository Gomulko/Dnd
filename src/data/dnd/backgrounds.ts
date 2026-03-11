/**
 * ŹRÓDŁO PRAWDY — Tła Postaci D&D
 *
 * SRD 5.2.1 zawiera tylko 4 tła: Acolyte, Criminal, Sage, Soldier
 * Pozostałe 8 (oznaczone PHB) pochodzi z Player's Handbook i są
 * używane w projekcie zgodnie z widokami Figma.
 *
 * UWAGA SRD 5.2.1: Tła dają bonusy do statystyk (+2/+1 lub +1/+1/+1)
 * do 3 wymienionych cech. W projekcie stosujemy tę mechanikę.
 */

import type { SkillKey } from "./classes";
import type { StatKey } from "./races";

export interface PersonalityOption {
  id: string;
  text: string;
}

export interface Background {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  abilityScoreOptions: StatKey[]; // 3 cechy — gracz daje +2/+1 lub +1/+1/+1
  skillProficiencies: SkillKey[];
  toolProficiency: string;
  languages: number;              // ile języków do wyboru
  equipmentA: string[];           // Pakiet A
  equipmentGold: number;          // alternatywnie: X sz. złota
  specialFeature: {
    name: string;
    description: string;
  };
  personalityTraits: PersonalityOption[];
  ideals: PersonalityOption[];
  bonds: PersonalityOption[];
    flaws: PersonalityOption[];
  source: "SRD" | "PHB";
  icon: string;
}

export const BACKGROUNDS: Background[] = [
  {
    id: "acolyte",
    name: "Akolita",
    nameEn: "Acolyte",
    description: "Służyłeś w świątyni jako kapłan lub sługa bogów",
    abilityScoreOptions: ["int", "wis", "cha"],
    skillProficiencies: ["insight", "religion"],
    toolProficiency: "Przybory kaligraficzne",
    languages: 2,
    equipmentA: [
      "Przybory kaligraficzne",
      "Modlitewnik lub symbole święte (książka)",
      "Symbol święty",
      "Pergamin ×10 arkuszy",
      "Szata kapłańska",
    ],
    equipmentGold: 8,
    specialFeature: {
      name: "Schronienie Wiernych",
      description:
        "Możesz liczyć na wsparcie świątyni twojej wiary. Kapłani i inni wyznawcy zapewnią ci i twoim towarzyszom bezpłatne leczenie i schronienie. Odzwierciedla to twój status jako człowieka Bogów.",
    },
    personalityTraits: [
      { id: "pt1", text: "Wielbię pewne bóstwo i regularnie się do niego odwołuję w rozmowie." },
      { id: "pt2", text: "Jestem tolerancyjny (lub nietolerancyjny) dla innych wyznań i szanuję oddanie innym bóstwom." },
      { id: "pt3", text: "Mogę znaleźć wspólny język nawet z najbardziej wrogą osobą." },
      { id: "pt4", text: "Chronię tych, którzy nie są w stanie chronić siebie samych." },
    ],
    ideals: [
      { id: "i1", text: "Wiara. Ufam, że moje bóstwo prowadzi moje działania. (Praworządny)" },
      { id: "i2", text: "Tradycja. Stare obyczaje, rytuały i modlitwy muszą być zachowane. (Praworządny)" },
      { id: "i3", text: "Dobroczynność. Staram się pomóc potrzebującym. (Dobry)" },
      { id: "i4", text: "Moc. Poszukuję mocy, by rozszerzyć wpływy swojej wiary. (Zły)" },
    ],
    bonds: [
      { id: "b1", text: "Poświęcę wszystko, by odzyskać starożytne relikwie mojej wiary zagrabione przez bezecnych grabieżców." },
      { id: "b2", text: "Pewnego dnia wrócę do świątyni i udowodnię, że jestem godny jej służby." },
      { id: "b3", text: "Winien jestem swoje życie kapłanowi, który zaopiekował się mną, gdy byłem chory." },
      { id: "b4", text: "Wszystko, co robię, czynię dla zwykłego ludu." },
    ],
    flaws: [
      { id: "f1", text: "Jestem nieprzejednany w przekonaniu, że poglądy mojej świątyni są zawsze słuszne." },
      { id: "f2", text: "Ufam w los i bóstwo zbyt mocno, rzadko działając z własnej inicjatywy." },
      { id: "f3", text: "Potępiam heretyków i nieugięcie przekonuję innych do mojej wiary." },
      { id: "f4", text: "Jestem nieelastyczny w swoim myśleniu." },
    ],
    source: "SRD",
    icon: "✝",
  },
  {
    id: "criminal",
    name: "Kryminalista",
    nameEn: "Criminal",
    description: "Miałeś kontakty z półświatkiem przestępczym",
    abilityScoreOptions: ["dex", "con", "int"],
    skillProficiencies: ["sleightOfHand", "stealth"],
    toolProficiency: "Narzędzia złodziejskie",
    languages: 0,
    equipmentA: [
      "2× Sztylet",
      "Narzędzia złodziejskie",
      "Łom",
      "2× Sakiewka",
      "Strój podróżny z kapturem",
    ],
    equipmentGold: 16,
    specialFeature: {
      name: "Kontakt Kryminalny",
      description:
        "Masz niezawodny kontakt z siecią przestępczą. Możesz przez niego przekazywać i otrzymywać informacje ponad rozległym obszarem — miastem, krajem, a nawet kontynentem.",
    },
    personalityTraits: [
      { id: "pt1", text: "Zawsze mam plan na wypadek, gdy sprawy idą źle." },
      { id: "pt2", text: "Jestem zawsze spokojny, nieważne jak groźna jest sytuacja." },
      { id: "pt3", text: "Pierwszy poznam otoczenie, zanim wejdę do środka." },
      { id: "pt4", text: "Wolę zdobyć nowego sojusznika niż wroga." },
    ],
    ideals: [
      { id: "i1", text: "Honor. Nie kradnę od tych, którzy sami nie mogą sobie pozwolić na stratę. (Praworządny)" },
      { id: "i2", text: "Wolność. Łańcuchy i okowy krępują duszę. (Chaotyczny)" },
      { id: "i3", text: "Chciwość. Zawsze skupiam się na tym, ile mogę zgarnąć. (Zły)" },
      { id: "i4", text: "Przetrwanie. Robię to, co muszę, by przeżyć. (Neutralny)" },
    ],
    bonds: [
      { id: "b1", text: "Powinienem komuś wiele pieniędzy i muszę zaspokoić ten dług." },
      { id: "b2", text: "Próbuję odkupić grzechy przeszłości." },
      { id: "b3", text: "Skrywam coś cennego — informację lub przedmiot — przed wrogami." },
      { id: "b4", text: "Jestem winien swojemu mentorowi z półświatka i nie mogę go zdradzić." },
    ],
    flaws: [
      { id: "f1", text: "Kiedy widzę coś wartościowego, zawsze myślę o tym, jak to zdobyć." },
      { id: "f2", text: "Jeśli coś może pójść nie tak, spieprzam sprawę." },
      { id: "f3", text: "Lubię drogie przyjemności — dobre jedzenie, dobre wino, piękne ubrania." },
      { id: "f4", text: "Jestem zbyt chciwy złota i gotów zdradzić przyjaciół dla zysku." },
    ],
    source: "SRD",
    icon: "🗡",
  },
  {
    id: "sage",
    name: "Uczony",
    nameEn: "Sage",
    description: "Spędziłeś lata studiując starożytną wiedzę",
    abilityScoreOptions: ["con", "int", "wis"],
    skillProficiencies: ["arcana", "history"],
    toolProficiency: "Przybory kaligraficzne",
    languages: 2,
    equipmentA: [
      "Laska kwarcowa",
      "Przybory kaligraficzne",
      "Księga historii",
      "Pergamin (8 arkuszy)",
      "Szata",
    ],
    equipmentGold: 8,
    specialFeature: {
      name: "Badacz",
      description:
        "Gdy próbujesz zdobyć informacje, wiesz gdzie i od kogo można się tego dowiedzieć. Możesz nie znać odpowiedzi, ale wiesz, gdzie ją znaleźć: biblioteka, uczelnia, znany mędrzec lub inna dostępna osoba.",
    },
    personalityTraits: [
      { id: "pt1", text: "Myśląc o problemie, mówię głośno do siebie." },
      { id: "pt2", text: "Znam wiele faktów, ale nie rozumiem ludzi." },
      { id: "pt3", text: "Cierpliwie słucham innych, zanim wyrażę swoje zdanie." },
      { id: "pt4", text: "Lubię rozwiązywać zagadki i tajemnice." },
    ],
    ideals: [
      { id: "i1", text: "Wiedza. Droga do mocy i samodoskonalenia wiedzie przez wiedzę. (Neutralny)" },
      { id: "i2", text: "Piękno. Szukam piękna w eleganckim dowodzie, rzadkim rękopisie. (Dobry)" },
      { id: "i3", text: "Logika. Emocje nie mogą przeszkadzać w logicznym myśleniu. (Praworządny)" },
      { id: "i4", text: "Potęga. Wiedza to potęga, a potęga daje kontrolę. (Zły)" },
    ],
    bonds: [
      { id: "b1", text: "Szukam rzadkiego rękopisu, który może zmienić moje rozumienie świata." },
      { id: "b2", text: "Mam szczególnego przyjaciela — ucznia lub mentora — dla którego bym zrobił wszystko." },
      { id: "b3", text: "Muszę dowieść, że pewna kontrowersyjna teoria naukowa jest słuszna." },
      { id: "b4", text: "Wszystką wiedzę, którą zdobyłem, poświęcę ochronie świata." },
    ],
    flaws: [
      { id: "f1", text: "Łatwo mnie rozpraszają piękne obiekty, zawiłe tajemnice i naukowe pytania." },
      { id: "f2", text: "Mówię bez zastanowienia, co myślę, narażając siebie i innych." },
      { id: "f3", text: "Niecierpliwiłem się z tymi, którzy nie dorównują mi intelektualnie." },
      { id: "f4", text: "Jestem przekonany, że nikt nie może dorównać mojej wiedzy." },
    ],
    source: "SRD",
    icon: "📚",
  },
  {
    id: "soldier",
    name: "Żołnierz",
    nameEn: "Soldier",
    description: "Walczyłeś jako część zorganizowanej armii",
    abilityScoreOptions: ["str", "dex", "con"],
    skillProficiencies: ["athletics", "intimidation"],
    toolProficiency: "Jeden rodzaj gry hazardowej",
    languages: 0,
    equipmentA: [
      "Oszczep",
      "Krótki łuk",
      "20× Strzały",
      "Gra hazardowa (ten sam rodzaj co powyżej)",
      "Zestaw uzdrowiciela",
      "Kołczan",
      "Ubranie podróżne",
    ],
    equipmentGold: 14,
    specialFeature: {
      name: "Stopień Wojskowy",
      description:
        "Masz stopień wojskowy z poprzedniej kariery. Żołnierze lojalni wobec byłej organizacji wojskowej nadal rozpoznają twój autorytet. Możesz odwoływać się do tej rangi, by wpływać na nich.",
    },
    personalityTraits: [
      { id: "pt1", text: "Jestem zawsze uprzejmy i szanuję osoby nade mną." },
      { id: "pt2", text: "Przywykłem do trudnych warunków i walki — narzekanie nic nie daje." },
      { id: "pt3", text: "Wiem kiedy słuchać rozkazów, a kiedy działać samodzielnie." },
      { id: "pt4", text: "Nigdy nie zostawiam rannego towarzysza." },
    ],
    ideals: [
      { id: "i1", text: "Większe Dobro. Naszym zadaniem jest ochrona i służba ludziom. (Dobry)" },
      { id: "i2", text: "Odpowiedzialność. Robię to, co muszę i przestrzegam poleceń. (Praworządny)" },
      { id: "i3", text: "Naród. Moja wioska, miasto i kraj — to są moi ludzie. (Każdy)" },
      { id: "i4", text: "Siła. Jeśli chcę rządzić, muszę udowodnić siłę w walce. (Zły)" },
    ],
    bonds: [
      { id: "b1", text: "Walczę za tych, którzy nie mogą walczyć sami." },
      { id: "b2", text: "Ktoś ocalił mi życie na polu walki. Do dziś mu to winien." },
      { id: "b3", text: "Moim honorem jest towarzysz broni, który zginął, gdy zawiodłem." },
      { id: "b4", text: "Muszę udowodnić, że jestem lepszym żołnierzem niż mój rywal." },
    ],
    flaws: [
      { id: "f1", text: "Potwór zabił kogoś bliskiego. Nie mogę zapanować nad sobą w jego obecności." },
      { id: "f2", text: "Gardzę słabością — u siebie i innych." },
      { id: "f3", text: "Mam trudność z okazywaniem emocji i bliskości." },
      { id: "f4", text: "Rozkaz to rozkaz — nawet jeśli jest nieetyczny." },
    ],
    source: "SRD",
    icon: "⚔",
  },
  // ---- PHB Tła (poza SRD) ----
  {
    id: "folk-hero",
    name: "Ludowy Bohater",
    nameEn: "Folk Hero",
    description: "Wywodzisz się z ludu i bronisz słabych przed tyranią",
    abilityScoreOptions: ["con", "wis", "cha"],
    skillProficiencies: ["animalHandling", "survival"],
    toolProficiency: "Narzędzia rzemieślnicze (1 rodzaj), pojazdy lądowe",
    languages: 0,
    equipmentA: [
      "Narzędzia rzemieślnicze (1 rodzaj)",
      "Łopata",
      "Garnek żelazny",
      "Ubranie pospólstwa",
    ],
    equipmentGold: 10,
    specialFeature: {
      name: "Określający Zdarzenie",
      description:
        "Pospólstwo cię popiera i schroni cię przed prawem lub tymi, którzy cię szukają, choć ryzykują własnym zdrowiem.",
    },
    personalityTraits: [
      { id: "pt1", text: "Osądzam ludzi na podstawie ich czynów, nie słów." },
      { id: "pt2", text: "Myślę, że każdy zasługuje na drugą szansę." },
      { id: "pt3", text: "Pomagam potrzebującym bez względu na koszty." },
      { id: "pt4", text: "Jestem uczciwy do bólu — kłamstwo mnie boli." },
    ],
    ideals: [
      { id: "i1", text: "Szacunek. Ludzie zasługują na godne traktowanie. (Dobry)" },
      { id: "i2", text: "Wolność. Tyrania to wróg wszelkiego dobra. (Chaotyczny)" },
      { id: "i3", text: "Obowiązek. Odpowiedzialność za innych to ciężar, który niosę z dumą. (Praworządny)" },
      { id: "i4", text: "Siła Ludu. Jednostki tworzą zbiorowość. (Każdy)" },
    ],
    bonds: [
      { id: "b1", text: "Tyran zrujnował moją wioskę. Szukam zemsty." },
      { id: "b2", text: "Ochronię wioskę, w której dorastałem." },
      { id: "b3", text: "Mój mentror pomógł mi stać się tym, czym jestem dziś." },
      { id: "b4", text: "Niosę ze sobą narzędzie rzemieślnicze po ojcu — symbol tego, skąd pochodzę." },
    ],
    flaws: [
      { id: "f1", text: "Zbyt pewny siebie, patrzę na trudne wyzwania bez ostrożności." },
      { id: "f2", text: "Nigdy nie ufam szlachcie ani bogatym — zawsze mają ukryte motywacje." },
      { id: "f3", text: "Mam trudność z okazywaniem słabości komukolwiek." },
      { id: "f4", text: "Dając się ponieść emocjom, działam pochopnie i bez planu." },
    ],
    source: "PHB",
    icon: "🌾",
  },
  {
    id: "noble",
    name: "Szlachcic",
    nameEn: "Noble",
    description: "Urodzony w przywilejach i otoczony bogactwem",
    abilityScoreOptions: ["str", "int", "cha"],
    skillProficiencies: ["history", "persuasion"],
    toolProficiency: "Jeden rodzaj gry hazardowej",
    languages: 1,
    equipmentA: [
      "Szlacheckie stroje",
      "Sygnet",
      "Rodowód (zwój genealogii)",
    ],
    equipmentGold: 25,
    specialFeature: {
      name: "Przywilej Urodzenia",
      description:
        "Twoje towarzystwo jest nieocenione dla innych szlachciców. Jesteś zapraszany do ekskluzywnych wydarzeń i możesz uzyskać audiencję u lokalnych władców.",
    },
    personalityTraits: [
      { id: "pt1", text: "Tworzę szczere przyjaźnie tylko z trudnością — kto mi ufa?" },
      { id: "pt2", text: "Wiem, jak to wyglądać i mówić przekonująco o sprawach, o których nic nie wiem." },
      { id: "pt3", text: "Jestem dumny ze swojej rodziny i bronię jej honoru." },
      { id: "pt4", text: "Rozkoszuję się dobrym jedzeniem, winem i towarzystwem." },
    ],
    ideals: [
      { id: "i1", text: "Obowiązek. Muszę dbać o dobro tych, którym służę. (Praworządny)" },
      { id: "i2", text: "Władza. Muszę udowodnić swoją wartość przez czyny. (Każdy)" },
      { id: "i3", text: "Noblesse Oblige. Uprzywilejowani mają obowiązek wobec reszty. (Dobry)" },
      { id: "i4", text: "Rodzina. Krew jest grubsza niż woda. (Każdy)" },
    ],
    bonds: [
      { id: "b1", text: "Stanę przed rodzicami i udowodnię swoją wartość." },
      { id: "b2", text: "Muszę chronić tytuł i majątki rodziny." },
      { id: "b3", text: "Dawny przyjaciel potrzebuje mojej pomocy — pomagam mu bez zastanowienia." },
      { id: "b4", text: "Sygnet mojego rodu to coś więcej niż biżuteria — to obowiązek, który noszę na palcu." },
    ],
    flaws: [
      { id: "f1", text: "Ukrywam skandal, który może zniszczyć moją rodzinę." },
      { id: "f2", text: "Często patrzę z góry na tych bez urodzenia czy bogactwa." },
      { id: "f3", text: "Chętnie chwalę się błahymi osiągnięciami." },
      { id: "f4", text: "Nie potrafię zaakceptować porażki — wolę kłamać niż przyznać się do błędu." },
    ],
    source: "PHB",
    icon: "👑",
  },
  {
    id: "outlander",
    name: "Wędrowiec",
    nameEn: "Outlander",
    description: "Wychowałeś się w dziczy, z dala od cywilizacji",
    abilityScoreOptions: ["str", "con", "wis"],
    skillProficiencies: ["athletics", "survival"],
    toolProficiency: "Jeden rodzaj instrumentu muzycznego",
    languages: 1,
    equipmentA: [
      "Kij",
      "Pułapki na myśliwych ×2",
      "Trofeum zwierząt",
      "Strój podróżny",
    ],
    equipmentGold: 10,
    specialFeature: {
      name: "Wędrowiec",
      description:
        "Doskonale znasz dzicz. Możesz znaleźć jedzenie i wodę dla siebie i do 5 innych osób każdego dnia, o ile teren oferuje przynajmniej tę ilość.",
    },
    personalityTraits: [
      { id: "pt1", text: "Jestem człowiekiem czynu — najpierw działam, potem myślę." },
      { id: "pt2", text: "Mam wrodzony sens kierunku i rzadko gubię się." },
      { id: "pt3", text: "Czuję się nieswojo wśród tłumów i wolę otwartą przestrzeń." },
      { id: "pt4", text: "Traktuję stworzenia z szacunkiem — są częścią świata jak i ja." },
    ],
    ideals: [
      { id: "i1", text: "Zmiana. Życie jest jak strumień — ciągle w ruchu. (Chaotyczny)" },
      { id: "i2", text: "Natura. Świat natury jest ważniejszy niż cywilizacja. (Neutralny)" },
      { id: "i3", text: "Chwała. Muszę zdobyć sławę i honor. (Każdy)" },
      { id: "i4", text: "Przeżycie. Muszę przetrwać za wszelką cenę. (Zły)" },
    ],
    bonds: [
      { id: "b1", text: "Mój klan jest dla mnie wszystkim — nawet jeśli teraz od niego wędruję." },
      { id: "b2", text: "Moja ziemia jest zagrożona. Wrócę i ją ochranie." },
      { id: "b3", text: "Szukam pradawnego stworzenia lub miejsca wspomnianego w legendach ludu." },
      { id: "b4", text: "Duch mego przodka nawiedza mnie w snach i prowadzi moją rękę w walce." },
    ],
    flaws: [
      { id: "f1", text: "Łatwo mnie sprowokować — nie znoszę pogardy wobec dziczy." },
      { id: "f2", text: "Nie umiem zachowywać się przy dworze — moje maniery są prymitywne." },
      { id: "f3", text: "Nie rozumiem pieniędzy i często płacę za dużo lub za mało." },
      { id: "f4", text: "Wolę działać sam — praca w grupie to dla mnie zbędny ciężar." },
    ],
    source: "PHB",
    icon: "🏕",
  },
  {
    id: "charlatan",
    name: "Oszust",
    nameEn: "Charlatan",
    description: "Mistrz fałszywej tożsamości i manipulacji",
    abilityScoreOptions: ["dex", "con", "cha"],
    skillProficiencies: ["deception", "sleightOfHand"],
    toolProficiency: "Fałszywe dokumenty, zestaw do przebierania",
    languages: 0,
    equipmentA: [
      "Zestaw do przebierania",
      "Narzędzia oszusta (fałszywe dokumenty)",
      "Ubrania klas wyższych",
    ],
    equipmentGold: 15,
    specialFeature: {
      name: "Fałszywa Tożsamość",
      description:
        "Stworzyłeś drugą tożsamość, w tym dokumenty, znajomości i przebrania. Możesz wcielać się w tę osobę. Możesz też fałszować dokumenty, o ile znasz oryginał.",
    },
    personalityTraits: [
      { id: "pt1", text: "Flattery to moje narzędzie do uzyskiwania tego, czego chcę." },
      { id: "pt2", text: "Nie mogę powstrzymać się od kłamstw, nawet gdy nie jest to konieczne." },
      { id: "pt3", text: "Jestem zbyt ciekawski na własne dobro — wnikam w sprawy innych." },
      { id: "pt4", text: "Wiem, jak wyglądać na ważnego, nawet gdy nim nie jestem." },
    ],
    ideals: [
      { id: "i1", text: "Niezależność. Sam ustalam swoje reguły. (Chaotyczny)" },
      { id: "i2", text: "Sprawiedliwość. Okradam bogatych, którzy wyzyskują ubogich. (Dobry)" },
      { id: "i3", text: "Chciwość. Zawsze szukam nowych okazji do zarobku. (Zły)" },
      { id: "i4", text: "Rozrywka. Uwielbiam obserwować, jak naiwni wpadają w moje pułapki. (Chaotyczny)" },
    ],
    bonds: [
      { id: "b1", text: "Złapałem bogatego kupca na oszustwie. On mnie za to nienawidzi." },
      { id: "b2", text: "Muszę chronić kogoś bliskiego przed konsekwencjami moich dawnych działań." },
      { id: "b3", text: "Mam dług wdzięczności wobec osoby, która mi zaufała mimo wiedzy o moich kłamstwach." },
      { id: "b4", text: "Moja fałszywa tożsamość nabrała dla mnie prawdziwego znaczenia — bronię jej jak własnej." },
    ],
    flaws: [
      { id: "f1", text: "Nie mogę odmówić żadnej okazji hazardowej, nawet gdy wiem, że to głupota." },
      { id: "f2", text: "Jestem niegrzeczny i arogancki — przekonany, że wszyscy są ode mnie głupsi." },
      { id: "f3", text: "Nienawidzę widoku krwi i mdleję na jej widok." },
      { id: "f4", text: "Kłamię nawet gdy prawda byłaby lepsza — nałóg silniejszy niż rozum." },
    ],
    source: "PHB",
    icon: "🃏",
  },
  {
    id: "entertainer",
    name: "Artysta",
    nameEn: "Entertainer",
    description: "Aktor, muzyk lub cyrkowiec znany ze swoich występów",
    abilityScoreOptions: ["str", "dex", "cha"],
    skillProficiencies: ["acrobatics", "performance"],
    toolProficiency: "Jeden rodzaj instrumentu muzycznego, zestaw do przebierania",
    languages: 0,
    equipmentA: [
      "Instrument muzyczny",
      "Przychylny list od patrona",
      "Kostium sceniczny",
    ],
    equipmentGold: 15,
    specialFeature: {
      name: "Z Dala od Domu",
      description:
        "Możesz zawsze znaleźć miejsce do występu i tym samym dach nad głową. Twoja publika zapewni ci i twojemu zespołowi noclegi i skromne wyżywienie w zamian za rozrywkę.",
    },
    personalityTraits: [
      { id: "pt1", text: "Znasz mnie z widzenia — jestem popularny wśród artystów." },
      { id: "pt2", text: "Lubię, gdy na mnie patrzą — jestem stworzony do sceny." },
      { id: "pt3", text: "Naśladuję zachowania i mowy innych, by rozśmieszyć tłum." },
      { id: "pt4", text: "Sny i romantyzm sprawiają, że jestem idealny do nastrojowych historii." },
    ],
    ideals: [
      { id: "i1", text: "Piękno. Gdy gram muzykę lub tańczę, cały świat staje się piękniejszy. (Dobry)" },
      { id: "i2", text: "Tradycja. Stare opowieści muszą być zachowane dla przyszłości. (Praworządny)" },
      { id: "i3", text: "Kreatywność. Świat potrzebuje nowych idei i oryginalności. (Chaotyczny)" },
      { id: "i4", text: "Sława. Pragnę być sławny — nic poza tym mnie nie satysfakcjonuje. (Każdy)" },
    ],
    bonds: [
      { id: "b1", text: "Prowadzę swoje dawne towarzystwo artystyczne i bronię go przed kłopotami." },
      { id: "b2", text: "Instrument muzyczny, który posiadam, to rodzinna pamiątka i skarb." },
      { id: "b3", text: "Ktoś ukradł moją sztukę. Szukam złodzieja i zemsty." },
      { id: "b4", text: "Widownia pewnego magicznego spektaklu zmieniła moje życie — szukam jego twórcy." },
    ],
    flaws: [
      { id: "f1", text: "Robię wszystko dla tłumu — nawet coś głupiego lub niebezpiecznego." },
      { id: "f2", text: "Jestem zazdrosny o innych artystów i nie mogę tego ukryć." },
      { id: "f3", text: "Po sukcesie zawsze upijam się do nieprzytomności." },
      { id: "f4", text: "Potrzebuję nieustannej uwagi — w ciszy czuję się niewidzialny i zaczynam panikować." },
    ],
    source: "PHB",
    icon: "🎭",
  },
  {
    id: "guild-artisan",
    name: "Rzemieślnik",
    nameEn: "Guild Artisan",
    description: "Wykwalifikowany twórca należący do cechu rzemieślniczego",
    abilityScoreOptions: ["str", "dex", "int"],
    skillProficiencies: ["insight", "persuasion"],
    toolProficiency: "Narzędzia rzemieślnicze (1 rodzaj)",
    languages: 1,
    equipmentA: [
      "Narzędzia rzemieślnicze (1 rodzaj)",
      "List polecający od cechu",
      "Strój mieszczański",
    ],
    equipmentGold: 15,
    specialFeature: {
      name: "Przynależność do Cechu",
      description:
        "Należysz do cechu rzemieślniczego. Cech zapewni ci noclegi i żywność gdy jesteś w potrzebie, a w razie aresztowania — prawną pomoc za rozsądną opłatą.",
    },
    personalityTraits: [
      { id: "pt1", text: "Przekonuję innych demonstrując doskonałość mojej pracy." },
      { id: "pt2", text: "Chętnie pomagam i uczę innych swojego rzemiosła." },
      { id: "pt3", text: "Jestem skrupulatny — zawsze robię to dokładnie lub wcale." },
      { id: "pt4", text: "Jestem dumny z mojej pracy i nie znoszę krytyki." },
    ],
    ideals: [
      { id: "i1", text: "Społeczność. Odpowiedzialność polega na trosce o sąsiadów. (Praworządny)" },
      { id: "i2", text: "Wolność. Każdy powinien móc swobodnie realizować swoje rzemiosło. (Chaotyczny)" },
      { id: "i3", text: "Chciwość. Rzemiosło to biznes, a biznes to pieniądze. (Zły)" },
      { id: "i4", text: "Solidność. Zbuduję coś, co przetrwa epoki. (Każdy)" },
    ],
    bonds: [
      { id: "b1", text: "Warsztat, gdzie się uczyłem to dla mnie dom — bronię go." },
      { id: "b2", text: "Sławny artyzm stworzony przez mego mistrza jest moim natchnieniem." },
      { id: "b3", text: "Narzędzia, które posiadam to pamiątka po zmarłym mentorze." },
      { id: "b4", text: "Arcydzieło, które tworzę, ma trafić do rąk kogoś, kto naprawdę na nie zasługuje." },
    ],
    flaws: [
      { id: "f1", text: "Nigdy nie wyzbywam się czegoś, co mogłoby mi kiedyś przydać." },
      { id: "f2", text: "Zachowuję się hojnie, choć nie stać mnie na rozrzutność." },
      { id: "f3", text: "Jeśli coś zaczne, kończę — nawet jeśli to głupota." },
      { id: "f4", text: "Nie znoszę, gdy ktoś dotyka moich narzędzi bez pozwolenia — tracę panowanie nad sobą." },
    ],
    source: "PHB",
    icon: "🔨",
  },
  {
    id: "hermit",
    name: "Pustelnik",
    nameEn: "Hermit",
    description: "Żyłeś w odosobnieniu — w celi, odległym klasztorze lub dziczy",
    abilityScoreOptions: ["con", "int", "wis"],
    skillProficiencies: ["medicine", "religion"],
    toolProficiency: "Zestaw zielarza",
    languages: 1,
    equipmentA: [
      "Pojemnik na zioła",
      "Koc z zimowego wyprawiania",
      "Zwój — wyniki twoich rozważań",
      "Strój pospólstwa",
    ],
    equipmentGold: 5,
    specialFeature: {
      name: "Odkrycie",
      description:
        "Twoje ciche odosobnienie przyniosło Ci unikalne odkrycie. Może to być wielka prawda o kosmosie, bogach, potężnych istotach z innych planów lub siłach natury.",
    },
    personalityTraits: [
      { id: "pt1", text: "Jestem spokojny niemal do granic możliwości i nie daję się sprowokować." },
      { id: "pt2", text: "Rzadko mówię, ale kiedy mówię, słuchają mnie wszyscy." },
      { id: "pt3", text: "Jestem naiwny w kwestiach takich jak flirt, plotki i moda." },
      { id: "pt4", text: "Oddaję się modlitwie i medytacji w każdej wolnej chwili." },
    ],
    ideals: [
      { id: "i1", text: "Większe Dobro. Moje dary są dla wszystkich, nie dla mnie. (Dobry)" },
      { id: "i2", text: "Logika. Emocje nie mogą zaciemniać naukowego myślenia. (Praworządny)" },
      { id: "i3", text: "Wolna Myśl. Pytam, szukam, eksperymentuję. (Chaotyczny)" },
      { id: "i4", text: "Samodoskonalenie. Celem odosobnienia jest wzmocnienie woli i ducha. (Każdy)" },
    ],
    bonds: [
      { id: "b1", text: "Wszedłem w odosobnienie, bo pokochałem kogoś, kto nie mógł mnie kochać." },
      { id: "b2", text: "Muszę chronić tajemnicę odkrytą w odosobnieniu." },
      { id: "b3", text: "Mój mentor wysłał mnie w świat — mam zadanie, które muszę wypełnić." },
      { id: "b4", text: "Mój zwój zapisany w ciszy pustelni zawiera prawdę, której świat jeszcze nie jest gotów przyjąć." },
    ],
    flaws: [
      { id: "f1", text: "Dogmatycznie wierzę w swoją religię lub filozofię." },
      { id: "f2", text: "Wolę mój własny kłopot niż kłopot innych — jestem egoistą." },
      { id: "f3", text: "Wyrażam pogardę dla tych, którzy nie podzielają moich ideałów." },
      { id: "f4", text: "Lata samotności sprawiły, że rozmowa z ludźmi jest dla mnie prawie niemożliwa." },
    ],
    source: "PHB",
    icon: "🏔",
  },
  {
    id: "sailor",
    name: "Marynarz",
    nameEn: "Sailor",
    description: "Pływałeś statkiem przez niebezpieczne morza",
    abilityScoreOptions: ["str", "dex", "wis"],
    skillProficiencies: ["athletics", "perception"],
    toolProficiency: "Instrumenty nawigacyjne, pojazdy (wodne)",
    languages: 0,
    equipmentA: [
      "Lina konopna (15 metrów)",
      "Talizman przynoszący szczęście",
      "Zwykłe ubrania",
    ],
    equipmentGold: 10,
    specialFeature: {
      name: "Passage Bezpieczny",
      description:
        "Gdy potrzebujesz, możesz zapewnić sobie i towarzyszom bezpieczne przejście na statku. Możesz to zrobić bezpłatnie pod warunkiem, że nie jesteś wrogiem kapitana.",
    },
    personalityTraits: [
      { id: "pt1", text: "Mam dla każdego opowieść z morza, choć nie zawsze odpowiada ona sytuacji." },
      { id: "pt2", text: "Jestem szorstki i bezpośredni — nie lubię owijać w bawełnę." },
      { id: "pt3", text: "Uwielbiam burzę — w środku niej czuję się wolny." },
      { id: "pt4", text: "Ciężka praca to nic — na morzu jest zawsze coś do zrobienia." },
    ],
    ideals: [
      { id: "i1", text: "Szacunek. Wszyscy zasługują na jednakowe traktowanie. (Dobry)" },
      { id: "i2", text: "Wolność. Morze to wolność — żadnych kajdan. (Chaotyczny)" },
      { id: "i3", text: "Opanowanie. Kapitan mówi — robimy. (Praworządny)" },
      { id: "i4", text: "Przygoda. Morze jest wielkie — jest tam wiele skarbów. (Każdy)" },
    ],
    bonds: [
      { id: "b1", text: "Zostałem skrzywdzony przez piratów. Mszczę się na każdym z nich." },
      { id: "b2", text: "Mój statek jest jak dom. Chcę go odzyskać od tych, którzy go przejęli." },
      { id: "b3", text: "Mam ukryty skarb gdzieś na morzu. Kiedyś go znajdę." },
      { id: "b4", text: "Towarzysz, który utonął podczas sztormu, uratował mi życie. Nigdy o nim nie zapomnę." },
    ],
    flaws: [
      { id: "f1", text: "Kłamię bez mrugnięcia okiem i nie widzę w tym problemu." },
      { id: "f2", text: "Piję za dużo alkoholu w porcie i potem tego żałuję." },
      { id: "f3", text: "Chętnie ryzykuję własne życie dla adrenaliny." },
      { id: "f4", text: "Mam na lądzie kilka długów i osób, które woleliby mnie nigdy więcej nie widzieć." },
    ],
    source: "PHB",
    icon: "⚓",
  },
  {
    id: "urchin",
    name: "Sierota",
    nameEn: "Urchin",
    description: "Wychowałeś się sam na ulicach miasta, walcząc o przeżycie każdego dnia",
    abilityScoreOptions: ["dex", "wis", "cha"],
    skillProficiencies: ["sleightOfHand", "stealth"],
    toolProficiency: "Narzędzia złodziejskie, pojazdy lądowe",
    languages: 0,
    equipmentA: [
      "Mały nóż",
      "Mapa miasta, w którym dorastałeś",
      "Pamiątka po rodzicach",
      "Ubranie pospólstwa",
    ],
    equipmentGold: 10,
    specialFeature: {
      name: "Tajniki Miasta",
      description:
        "Znasz tajne przejścia, zaułki i kryjówki w miastach. Możesz przemieszczać się przez duże miasto dwa razy szybciej niż normalnie, a twoje bezpieczne kryjówki są trudne do wykrycia.",
    },
    personalityTraits: [
      { id: "pt1", text: "Jestem czujny jak zając — zawsze wiem, kto wchodzi do pomieszczenia." },
      { id: "pt2", text: "Mam grubą skórę — życie nauczyło mnie nie przejmować się słowami." },
      { id: "pt3", text: "Widzę w biednych ludziach siebie — zawsze staram im się pomóc." },
      { id: "pt4", text: "Nie ufam nikomu, dopóki nie udowodni mi swojej wartości." },
    ],
    ideals: [
      { id: "i1", text: "Wspólnota. Uliczni nędzarze dbają o siebie nawzajem. (Dobry)" },
      { id: "i2", text: "Zmiana. Bogaci mają za dużo, biedni za mało. Trzeba to zmienić. (Chaotyczny)" },
      { id: "i3", text: "Bezpieczeństwo. Wszystko, co robię, robię dla spokoju jutrzejszego dnia. (Neutralny)" },
      { id: "i4", text: "Przetrwanie. Nie ma miejsca na sentymenty, gdy żołądek jest pusty. (Każdy)" },
    ],
    bonds: [
      { id: "b1", text: "Ktoś zaopiekował się mną, gdy byłem dzieckiem. Spłacę ten dług." },
      { id: "b2", text: "Moja paczka ulicznych dzieciaków — to jedyna rodzina, jaką miałem." },
      { id: "b3", text: "Pamiątka znaleziona na ciele martwych rodziców to jedyna wskazówka mojego pochodzenia." },
      { id: "b4", text: "Pewien kupiec wyrzucił mnie z pracy bez powodu. Nie zapomnę tej krzywdy." },
    ],
    flaws: [
      { id: "f1", text: "Kradnę drobnostki nawet wtedy, gdy mnie na to stać — stary nawyk." },
      { id: "f2", text: "Podejrzewam każdą uprzejmość o ukryty motyw." },
      { id: "f3", text: "Nie umiem usiedzieć w miejscu — zawsze muszę mieć drogę ucieczki." },
      { id: "f4", text: "Czuję się nieswojo w towarzystwie zamożnych ludzi i staram się to ukryć kiepskim aktorstwem." },
    ],
    source: "PHB",
    icon: "🏚",
  },
];

export function getBackgroundById(id: string): Background | undefined {
  return BACKGROUNDS.find((b) => b.id === id);
}
