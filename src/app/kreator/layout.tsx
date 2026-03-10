import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/shared/ui/Navbar";
import StepperWrapper from "@/shared/ui/StepperWrapper";

type Props = {
  children: React.ReactNode;
};

export default async function KreatorLayout({ children }: Props) {
  const session = await auth();
  if (!session) redirect("/logowanie");

  return (
    <div style={{ minHeight: "100vh", background: "#0f0e17" }}>
      <Navbar />

      <div
        style={{
          background: "#1a1825",
          borderBottom: "1px solid #2e2b3d",
          padding: "20px 0 16px",
        }}
      >
        <StepperWrapper />
      </div>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {children}
      </main>
    </div>
  );
}
