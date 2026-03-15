const BLACK = "#0a0a0a";
const MID = "#555555";
const LIGHT = "#cccccc";
const FONT_DISPLAY = "var(--font-display), Georgia, serif";
const FONT_UI = "var(--font-ui), Helvetica, sans-serif";

const LAST_UPDATED = "2026-03-15";

export const metadata = {
  title: "Polityka Prywatności — Kroniki Przygód",
};

export default function PolitykaPrywatnosci() {
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
            Polityka Prywatności
          </h1>
          <div style={{ width: 60, height: 1.5, background: BLACK, marginBottom: 16 }} />
          <p style={{ fontFamily: FONT_UI, fontSize: 14, color: MID }}>
            Ostatnia aktualizacja: {LAST_UPDATED}
          </p>
        </div>

        {/* Treść */}
        <div style={{ background: "#ffffff", border: "1.5px solid #0a0a0a", padding: "48px 56px" }}>

          <Section title="1. Administrator danych osobowych">
            <P>
              Administratorem Twoich danych osobowych jest <strong>Rafał Gomułka</strong>,{" "}
              kontakt e-mail: <strong>rafa.gomu1994@gmail.com</strong> (dalej: „Administrator").
            </P>
            <P>
              W sprawach dotyczących przetwarzania danych osobowych możesz skontaktować się
              bezpośrednio pod powyższym adresem email.
            </P>
          </Section>

          <Section title="2. Jakie dane zbieramy">
            <P>W ramach korzystania z Serwisu przetwarzamy następujące dane:</P>
            <ul style={{ fontFamily: FONT_UI, fontSize: 15, color: MID, lineHeight: 1.8, paddingLeft: 20, margin: "12px 0" }}>
              <li><strong style={{ color: BLACK }}>Nazwa użytkownika</strong> — podawana przy rejestracji,</li>
              <li><strong style={{ color: BLACK }}>Hasło</strong> — przechowywane wyłącznie w postaci zaszyfrowanej (bcrypt), Administrator nie ma dostępu do hasła w postaci jawnej,</li>
              <li><strong style={{ color: BLACK }}>Dane postaci D&D</strong> — imiona, statystyki, wyposażenie i inne informacje wpisywane przez użytkownika w kreatorze i karcie postaci,</li>
              <li><strong style={{ color: BLACK }}>Dane sesji</strong> — tokeny JWT przechowywane w ciasteczku sesyjnym (wygasają po zamknięciu przeglądarki lub wylogowaniu).</li>
            </ul>
            <P>
              Serwis <strong>nie zbiera</strong> adresów email, imion i nazwisk, danych płatniczych
              ani żadnych innych danych wrażliwych.
            </P>
          </Section>

          <Section title="3. Cel i podstawa prawna przetwarzania">
            <P>
              Twoje dane przetwarzamy wyłącznie w celu <strong>świadczenia usługi</strong> —
              umożliwienia logowania, tworzenia i przechowywania kart postaci.
            </P>
            <P>
              Podstawą prawną przetwarzania jest <strong>art. 6 ust. 1 lit. b RODO</strong> —
              przetwarzanie jest niezbędne do wykonania umowy (świadczenia usługi), której
              stroną jest użytkownik.
            </P>
          </Section>

          <Section title="4. Jak długo przechowujemy dane">
            <P>
              Dane konta (nazwa użytkownika, zaszyfrowane hasło) i powiązane karty postaci
              przechowujemy <strong>do momentu usunięcia konta</strong> przez użytkownika lub
              przez Administratora.
            </P>
            <P>
              Tokeny sesji wygasają automatycznie po wylogowaniu lub zamknięciu przeglądarki.
            </P>
          </Section>

          <Section title="5. Przekazywanie danych podmiotom trzecim">
            <P>
              W celu świadczenia usługi korzystamy z następujących podwykonawców, którym
              dane mogą być przekazywane:
            </P>
            <ul style={{ fontFamily: FONT_UI, fontSize: 15, color: MID, lineHeight: 1.8, paddingLeft: 20, margin: "12px 0" }}>
              <li>
                <strong style={{ color: BLACK }}>Vercel Inc.</strong> (USA) — hosting aplikacji.
                Dane mogą być przetwarzane na serwerach w USA na podstawie standardowych
                klauzul umownych (SCC) zgodnych z RODO.
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
                  style={{ color: MID, marginLeft: 6 }}>Polityka prywatności Vercel →</a>
              </li>
              <li style={{ marginTop: 8 }}>
                <strong style={{ color: BLACK }}>Neon Inc.</strong> (USA) — baza danych PostgreSQL.
                Dane przechowywane są na serwerach w USA na podstawie standardowych
                klauzul umownych (SCC).
                <a href="https://neon.tech/privacy" target="_blank" rel="noopener noreferrer"
                  style={{ color: MID, marginLeft: 6 }}>Polityka prywatności Neon →</a>
              </li>
              <li style={{ marginTop: 8 }}>
                <strong style={{ color: BLACK }}>Google LLC</strong> (USA) — usługa Google reCAPTCHA v3,
                stosowana w celu ochrony formularzy logowania i rejestracji przed botami i spamem.
                W trakcie weryfikacji Google może zbierać informacje o urządzeniu i zachowaniu
                użytkownika w celu oceny ryzyka (score). Podstawą przekazania danych jest
                nasz prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO) — bezpieczeństwo Serwisu.
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
                  style={{ color: MID, marginLeft: 6 }}>Polityka prywatności Google →</a>
                {" "}&amp;{" "}
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer"
                  style={{ color: MID }}>Warunki usługi Google →</a>
              </li>
            </ul>
            <P>
              Dane <strong>nie są</strong> przekazywane innym podmiotom, nie są sprzedawane
              ani wykorzystywane do celów marketingowych.
            </P>
          </Section>

          <Section title="6. Twoje prawa (RODO)">
            <P>Przysługują Ci następujące prawa:</P>
            <ul style={{ fontFamily: FONT_UI, fontSize: 15, color: MID, lineHeight: 1.8, paddingLeft: 20, margin: "12px 0" }}>
              <li><strong style={{ color: BLACK }}>Dostęp</strong> — możesz poprosić o informację, jakie dane o Tobie przechowujemy,</li>
              <li><strong style={{ color: BLACK }}>Sprostowanie</strong> — możesz poprosić o poprawienie nieprawidłowych danych,</li>
              <li><strong style={{ color: BLACK }}>Usunięcie</strong> — możesz zażądać usunięcia konta i wszystkich powiązanych danych,</li>
              <li><strong style={{ color: BLACK }}>Przenoszenie</strong> — możesz otrzymać swoje dane w formacie PDF (eksport kart postaci),</li>
              <li><strong style={{ color: BLACK }}>Sprzeciw</strong> — możesz wnieść sprzeciw wobec przetwarzania danych,</li>
              <li><strong style={{ color: BLACK }}>Skarga do organu nadzorczego</strong> — masz prawo złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa.</li>
            </ul>
            <P>
              Aby skorzystać z powyższych praw, skontaktuj się pod adresem:{" "}
              <strong>rafa.gomu1994@gmail.com</strong>. Odpowiemy w ciągu 30 dni.
            </P>
          </Section>

          <Section title="7. Pliki cookie i sesje">
            <P>
              Serwis używa następujących plików cookie:
            </P>
            <ul style={{ fontFamily: FONT_UI, fontSize: 15, color: MID, lineHeight: 1.8, paddingLeft: 20, margin: "12px 0" }}>
              <li>
                <strong style={{ color: BLACK }}>Ciasteczko sesyjne (authjs.session-token)</strong> —
                niezbędne do utrzymania zalogowania. Jest to ciasteczko techniczne, bez którego
                Serwis nie może działać. Wygasa po wylogowaniu lub zamknięciu sesji.
              </li>
              <li style={{ marginTop: 8 }}>
                <strong style={{ color: BLACK }}>Ciasteczka Google reCAPTCHA</strong> —
                ustawiane przez usługę Google reCAPTCHA v3, ładowaną na stronach logowania
                i rejestracji w celu ochrony przed botami. Google może ustawiać pliki cookie
                (m.in. <em>_GRECAPTCHA</em>) w celu oceny bezpieczeństwa. Działanie reCAPTCHA
                opiera się na naszym prawnie uzasadnionym interesie (bezpieczeństwo Serwisu).
              </li>
            </ul>
            <P>
              Serwis <strong>nie używa</strong> ciasteczek analitycznych ani reklamowych.
              Nie korzystamy z Google Analytics ani żadnych narzędzi śledzenia aktywności użytkowników.
            </P>
          </Section>

          <Section title="8. Bezpieczeństwo danych">
            <P>
              Hasła użytkowników są hashowane algorytmem <strong>bcrypt</strong> —
              nawet Administrator nie ma dostępu do haseł w postaci jawnej.
            </P>
            <P>
              Połączenie z Serwisem jest szyfrowane protokołem <strong>HTTPS/TLS</strong>.
            </P>
            <P>
              Mimo stosowania środków bezpieczeństwa, żaden system internetowy nie daje
              stuprocentowej gwarancji ochrony danych.
            </P>
          </Section>

          <Section title="9. Zmiany Polityki Prywatności" last>
            <P>
              Administrator zastrzega prawo do zmiany niniejszej Polityki. O istotnych zmianach
              użytkownicy zostaną poinformowani poprzez komunikat w Serwisie.
            </P>
            <P>
              Aktualna wersja Polityki jest zawsze dostępna pod adresem:{" "}
              <strong>https://dnd-phi-two.vercel.app/polityka-prywatnosci</strong>
            </P>
            <P>
              Polityka obowiązuje od dnia {LAST_UPDATED}.
            </P>
          </Section>
        </div>

        {/* Footer link */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <a
            href="/regulamin"
            style={{ fontFamily: FONT_UI, fontSize: 11, color: MID, textTransform: "uppercase", letterSpacing: "2px", textDecoration: "none" }}
          >
            ← Regulamin
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
