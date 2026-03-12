const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const FONT_DISPLAY = "var(--font-display), Georgia, serif";
const FONT_UI = "var(--font-ui), Helvetica, sans-serif";

const LAST_UPDATED = "2026-03-12";

export const metadata = {
  title: "Regulamin — Kroniki Przygód",
};

export default function RegulamiPage() {
  return (
    <div style={{ background: "#d8d8d8", minHeight: "100vh", padding: "48px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Nagłówek */}
        <div style={{ marginBottom: 48 }}>
          <a
            href="/"
            style={{
              fontFamily: FONT_UI, fontSize: 11, color: MID,
              textTransform: "uppercase", letterSpacing: "2px",
              textDecoration: "none", display: "inline-block", marginBottom: 32,
            }}
          >
            ← Kroniki Przygód
          </a>
          <div style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 12 }}>
            Dokument prawny
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 48, fontWeight: 400, fontStyle: "italic", color: BLACK, margin: "0 0 16px" }}>
            Regulamin
          </h1>
          <div style={{ width: 60, height: 1.5, background: BLACK, marginBottom: 16 }} />
          <p style={{ fontFamily: FONT_UI, fontSize: 14, color: MID }}>
            Ostatnia aktualizacja: {LAST_UPDATED}
          </p>
        </div>

        {/* Treść */}
        <div style={{ background: "#ffffff", border: "1.5px solid #0a0a0a", padding: "48px 56px" }}>
          <Section title="§1 Postanowienia ogólne">
            <P>
              Niniejszy Regulamin określa zasady korzystania z serwisu internetowego <strong>Kroniki Przygód</strong>,
              dostępnego pod adresem <strong>https://dnd-phi-two.vercel.app</strong> (dalej: „Serwis").
            </P>
            <P>
              Usługodawcą jest <strong>Rafał Gomułka</strong>, kontakt: rafa.gomu1994@gmail.com (dalej: „Usługodawca").
            </P>
            <P>
              Serwis jest bezpłatną aplikacją hobbystyczną, nieposiadającą charakteru komercyjnego,
              służącą do tworzenia i zarządzania kartami postaci do gry fabularnej Dungeons &amp; Dragons 5e.
            </P>
            <P>
              Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu.
            </P>
          </Section>

          <Section title="§2 Wymagania techniczne">
            <P>Do korzystania z Serwisu niezbędne są:</P>
            <ul style={{ fontFamily: FONT_UI, fontSize: 15, color: MID, lineHeight: 1.8, paddingLeft: 20, margin: "12px 0" }}>
              <li>urządzenie z dostępem do sieci Internet,</li>
              <li>aktualna przeglądarka internetowa (Chrome, Firefox, Safari, Edge),</li>
              <li>włączona obsługa JavaScript i plików cookie sesyjnych.</li>
            </ul>
          </Section>

          <Section title="§3 Rejestracja i konto użytkownika">
            <P>
              Korzystanie z funkcji Serwisu wymaga założenia konta. Rejestracja polega na podaniu
              nazwy użytkownika i hasła.
            </P>
            <P>
              Użytkownik zobowiązuje się do podania prawdziwych danych, zachowania hasła w
              poufności oraz nieudostępniania konta osobom trzecim.
            </P>
            <P>
              Usługodawca zastrzega prawo do usunięcia konta, które narusza postanowienia
              niniejszego Regulaminu, bez wcześniejszego powiadomienia.
            </P>
          </Section>

          <Section title="§4 Zasady korzystania z Serwisu">
            <P>Użytkownik zobowiązuje się do:</P>
            <ul style={{ fontFamily: FONT_UI, fontSize: 15, color: MID, lineHeight: 1.8, paddingLeft: 20, margin: "12px 0" }}>
              <li>korzystania z Serwisu zgodnie z obowiązującym prawem i dobrymi obyczajami,</li>
              <li>niepodejmowania działań mogących zakłócić działanie Serwisu,</li>
              <li>nieumieszczania treści obraźliwych, niezgodnych z prawem lub naruszających prawa osób trzecich,</li>
              <li>nieużywania Serwisu do celów komercyjnych bez zgody Usługodawcy.</li>
            </ul>
          </Section>

          <Section title="§5 Własność intelektualna">
            <P>
              Serwis korzysta z treści udostępnionych na licencji <strong>Creative Commons Attribution 4.0 (CC-BY-4.0)</strong>{" "}
              w ramach <strong>Systems Reference Document 5.2.1 (SRD)</strong> firmy Wizards of the Coast LLC.
              Kroniki Przygód nie są oficjalnym produktem Wizards of the Coast.
            </P>
            <P>
              Kod źródłowy Serwisu, grafiki i inne elementy opracowane przez Usługodawcę stanowią jego własność.
            </P>
          </Section>

          <Section title="§6 Ograniczenie odpowiedzialności">
            <P>
              Serwis jest udostępniany w stanie „takim, jaki jest" (as-is), bez gwarancji dostępności,
              poprawności działania ani nieprzerwanej pracy.
            </P>
            <P>
              Usługodawca nie ponosi odpowiedzialności za utratę danych spowodowaną awarią systemu,
              błędami oprogramowania ani działaniem osób trzecich.
            </P>
            <P>
              Zaleca się regularne eksportowanie kart postaci do formatu PDF jako kopii zapasowej.
            </P>
          </Section>

          <Section title="§7 Reklamacje">
            <P>
              Reklamacje dotyczące działania Serwisu można składać drogą emailową na adres:{" "}
              <strong>rafa.gomu1994@gmail.com</strong>.
            </P>
            <P>
              Usługodawca rozpatruje reklamacje w terminie 14 dni od daty otrzymania.
            </P>
          </Section>

          <Section title="§8 Zmiana Regulaminu">
            <P>
              Usługodawca zastrzega prawo do zmiany Regulaminu. O istotnych zmianach użytkownicy
              zostaną poinformowani poprzez komunikat w Serwisie z co najmniej 7-dniowym
              wyprzedzeniem.
            </P>
            <P>
              Dalsze korzystanie z Serwisu po wejściu zmian w życie oznacza ich akceptację.
            </P>
          </Section>

          <Section title="§9 Postanowienia końcowe" last>
            <P>
              W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa
              polskiego, w szczególności Kodeksu Cywilnego oraz ustawy z dnia 18 lipca 2002 r.
              o świadczeniu usług drogą elektroniczną.
            </P>
            <P>
              Regulamin obowiązuje od dnia {LAST_UPDATED}.
            </P>
          </Section>
        </div>

        {/* Footer link */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <a
            href="/polityka-prywatnosci"
            style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, textTransform: "uppercase", letterSpacing: "2px", textDecoration: "none" }}
          >
            Polityka Prywatności →
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, last = false }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: last ? 0 : 40, paddingBottom: last ? 0 : 40, borderBottom: last ? "none" : `1px solid ${LIGHT}` }}>
      <h2 style={{
        fontFamily: FONT_UI, fontSize: 11, fontWeight: 900,
        letterSpacing: "3px", textTransform: "uppercase",
        color: BLACK, marginBottom: 16, paddingBottom: 6,
        borderBottom: `1.5px solid ${BLACK}`,
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: FONT_UI, fontSize: 15, color: MID, lineHeight: 1.8, margin: "0 0 12px" }}>
      {children}
    </p>
  );
}
