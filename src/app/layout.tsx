import type { Metadata } from "next";
import { DM_Serif_Display, DM_Serif_Text, Barlow } from "next/font/google";
import "./globals.css";

// Krok 1.1 — Nowe czcionki zgodne z karta-postaci.html
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
  style: ["normal", "italic"],
});

const dmSerifText = DM_Serif_Text({
  subsets: ["latin"],
  variable: "--font-text",
  weight: ["400"],
  style: ["normal", "italic"],
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["300", "400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Kroniki Przygód — Kreator Postaci D&D",
  description: "Twórz i zarządzaj postaciami D&D 5e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${dmSerifDisplay.variable} ${dmSerifText.variable} ${barlow.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
