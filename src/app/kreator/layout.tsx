import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/shared/ui/Navbar";
import StepperWrapper from "@/shared/ui/StepperWrapper";

const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";

type Props = {
  children: React.ReactNode;
};

export default async function KreatorLayout({ children }: Props) {
  const session = await auth();
  if (!session) redirect("/logowanie");

  return (
    <div style={{ minHeight: "100vh", background: "#d8d8d8" }}>
      <Navbar />

      <div
        style={{
          background: "#ffffff",
          borderBottom: "1.5px solid #0a0a0a",
          padding: "12px 32px 16px",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: FONT_UI,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#555555",
            textDecoration: "none",
            marginBottom: 12,
          }}
        >
          ← Dashboard
        </Link>
        <StepperWrapper />
      </div>

      <main className="kreator-main" style={{ margin: "0 auto", padding: "40px 24px" }}>
        {children}
      </main>
    </div>
  );
}
