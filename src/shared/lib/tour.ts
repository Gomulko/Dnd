import type { DriveStep } from "driver.js";

// ── Stepper (wspólny krok intro) ──────────────────────────────────────────────

const STEPPER_STEP: DriveStep = {
  element: "#wizard-stepper",
  popover: {
    title: "Kreator Postaci — 8 kroków",
    description:
      "Ten pasek pokazuje postęp tworzenia postaci. Ukończone kroki oznaczone są ptaszkiem — możesz do nich wracać w dowolnym momencie.",
    side: "bottom",
    align: "start",
  },
};

// ── Kroki per strona kreatora ─────────────────────────────────────────────────

const STEPPER_STEP_GUEST: DriveStep = {
  element: "#wizard-stepper",
  popover: {
    title: "Kreator Gościa — 8 kroków",
    description:
      "Ten pasek pokazuje postęp tworzenia postaci w trybie gościa. Ukończone kroki oznaczone są ptaszkiem. Na końcu możesz pobrać kartę jako PDF lub założyć konto i zapisać postać na stałe.",
    side: "bottom",
    align: "start",
  },
};

export const WIZARD_TOUR_STEPS: Record<string, DriveStep[]> = {
  // ── Kreator zalogowany ────────────────────────────────────────────────────
  "/kreator/koncept": [
    STEPPER_STEP,
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 1 — Koncept",
        description:
          "Wpisz imię, wybierz płeć, wiek, wzrost, wagę i alignment postaci. Opisz jej wygląd. To podstawowe dane — możesz je później edytować.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator/rasa": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 2 — Rasa",
        description:
          "Wybierz rasę — każda daje premie do cech, specjalne zdolności i języki. Po wyborze rasy po prawej zobaczysz jej szczegóły i bonusy.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator/klasa": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 3 — Klasa",
        description:
          "Klasa określa rolę w walce i dostępne zdolności. Wybierz klasę, potem podklasę i umiejętności klasowe — tyle ile podaje limit.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator/cechy": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 4 — Cechy",
        description:
          "Rozdaj wartości cech (Siła, Zręczność, Kondycja, Intelekt, Mądrość, Charyzma). Możesz użyć standardowego zestawu, zakupu punktów lub rzutu kośćmi.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator/tlo": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 5 — Tło",
        description:
          "Tło to historia postaci przed przygodami — daje biegłości w umiejętnościach, języki i unikalną cechę fabularną. Wybierz też cechy osobowości, ideał, więź i wadę.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator/ekwipunek": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 6 — Ekwipunek",
        description:
          "Wybierz startowy ekwipunek z gotowych pakietów albo weź złoto i kup własny. Możesz też dodać ataki — broń z premią i kośćmi obrażeń.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator/magia": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 7 — Magia",
        description:
          "Jeśli Twoja klasa rzuca zaklęcia, tutaj wybierasz sztuczki (cantrips, używane dowolnie) i zaklęcia 1. poziomu. Jeśli klasa nie ma magii — ten krok jest automatycznie pominięty.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator/gotowe": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 8 — Gotowe!",
        description:
          "Podsumowanie Twojej postaci. Sprawdź wszystkie dane, a gdy wszystko się zgadza — kliknij Zapisz. Postać pojawi się na dashboardzie gotowa do gry!",
        side: "right",
        align: "start",
      },
    },
  ],

  // ── Kreator gościa ────────────────────────────────────────────────────────
  "/kreator-goscia/koncept": [
    STEPPER_STEP_GUEST,
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 1 — Koncept (Tryb Gościa)",
        description:
          "Wpisz imię, wybierz płeć, wiek i alignment. Twoje dane nie są jeszcze zapisywane na serwerze — dopóki nie założysz konta, postać żyje tylko w tej przeglądarce.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator-goscia/rasa": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 2 — Rasa",
        description:
          "Wybierz rasę — każda daje premie do cech, specjalne zdolności i języki. Po wyborze rasy po prawej zobaczysz jej szczegóły i bonusy.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator-goscia/klasa": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 3 — Klasa",
        description:
          "Klasa określa rolę w walce i dostępne zdolności. Wybierz klasę, potem podklasę i umiejętności klasowe — tyle ile podaje limit.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator-goscia/cechy": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 4 — Cechy",
        description:
          "Rozdaj wartości cech (Siła, Zręczność, Kondycja, Intelekt, Mądrość, Charyzma). Możesz użyć standardowego zestawu, zakupu punktów lub rzutu kośćmi.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator-goscia/tlo": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 5 — Tło",
        description:
          "Tło to historia postaci przed przygodami — daje biegłości w umiejętnościach, języki i unikalną cechę fabularną. Wybierz też cechy osobowości, ideał, więź i wadę.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator-goscia/ekwipunek": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 6 — Ekwipunek",
        description:
          "Wybierz startowy ekwipunek z gotowych pakietów albo weź złoto i kup własny. Możesz też dodać ataki — broń z premią i kośćmi obrażeń.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator-goscia/magia": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 7 — Magia",
        description:
          "Jeśli Twoja klasa rzuca zaklęcia, tutaj wybierasz sztuczki (cantrips, używane dowolnie) i zaklęcia 1. poziomu. Jeśli klasa nie ma magii — ten krok jest automatycznie pominięty.",
        side: "right",
        align: "start",
      },
    },
  ],
  "/kreator-goscia/gotowe": [
    {
      element: ".wizard-card",
      popover: {
        title: "Krok 8 — Gotowe!",
        description:
          "Twoja postać jest gotowa! Możesz pobrać kartę jako PDF lub założyć konto i zapisać postać na stałe — dane zostaną automatycznie przeniesione po rejestracji.",
        side: "right",
        align: "start",
      },
    },
  ],
};

export const DASHBOARD_TOUR_STEPS: DriveStep[] = [
  {
    element: "#tour-header",
    popover: {
      title: "Witaj w Kronikach Przygód!",
      description:
        "To Twój panel gracza — tutaj znajdziesz wszystkie swoje postacie i szybki dostęp do najważniejszych funkcji.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-characters",
    popover: {
      title: "Twoje Postacie",
      description:
        "Gotowe postacie wyświetlają się tutaj. Kliknij kartę postaci aby otworzyć jej pełną kartę — HP, statystyki, ekwipunek, czary.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-add",
    popover: {
      title: "Nowa Postać",
      description:
        "Stwórz nową postać w 8-krokowym kreatorze. Wybierzesz rasę, klasę, cechy, tło i ekwipunek — kreator przeprowadzi Cię przez wszystko.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "#tour-quick-actions",
    popover: {
      title: "Szybkie Akcje",
      description:
        "Kontynuuj ostatnią sesję, stwórz nową postać lub otwórz rzutnik kości — wszystko w jednym kliknięciu.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "#tour-sidebar-characters",
    popover: {
      title: "Nawigacja",
      description:
        "Sidebar daje szybki dostęp do panelu postaci, kreatora i rzutnika kości z każdego miejsca w aplikacji.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-sidebar-dice",
    popover: {
      title: "Rzutnik Kości",
      description:
        "Rzucaj kośćmi k4, k6, k8, k10, k12, k20 i k100. Historia rzutów z całej sesji jest zapisywana automatycznie.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tour-help",
    popover: {
      title: "Ten przycisk",
      description:
        'Kliknij "?" w dowolnym momencie aby ponownie uruchomić ten przewodnik. Powodzenia na przygodzie!',
      side: "left",
      align: "end",
    },
  },
];
