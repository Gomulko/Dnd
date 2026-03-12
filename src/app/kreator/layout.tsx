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
    <div style={{ minHeight: "100vh", background: "#d8d8d8" }}>
      <Navbar />

      <div
        style={{
          background: "#ffffff",
          borderBottom: "1.5px solid #0a0a0a",
          padding: "20px 0 16px",
        }}
      >
        <StepperWrapper />
      </div>

      <main style={{ margin: "0 auto", padding: "40px 24px" }}>
        {children}
      </main>
    </div>
  );
}
