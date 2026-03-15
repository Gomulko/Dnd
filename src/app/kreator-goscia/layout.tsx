import GuestNavbar from "@/shared/ui/GuestNavbar";
import GuestStepperWrapper from "@/shared/ui/GuestStepperWrapper";
import { WizardTourButton } from "@/shared/ui/WizardTourButton";

type Props = {
  children: React.ReactNode;
};

export default function KreatorGosciaLayout({ children }: Props) {
  return (
    <div style={{ minHeight: "100vh", background: "#d8d8d8" }}>
      <GuestNavbar />

      {/* Baner trybu gościa */}
      <div
        style={{
          background: "#0a0a0a",
          color: "#ffffff",
          padding: "8px 32px",
          fontFamily: "var(--font-ui), 'Barlow', sans-serif",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "2.5px",
          textAlign: "center",
        }}
      >
        TRYB GOŚCIA — dane nie zostaną zapisane na stałe
      </div>

      <div
        style={{
          background: "#ffffff",
          borderBottom: "1.5px solid #0a0a0a",
          padding: "12px 32px 16px",
        }}
      >
        <GuestStepperWrapper />
      </div>

      <main className="kreator-main" style={{ margin: "0 auto", padding: "40px 24px" }}>
        {children}
      </main>

      <WizardTourButton />
    </div>
  );
}
