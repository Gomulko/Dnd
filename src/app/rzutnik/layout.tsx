import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/shared/ui/Navbar";
import Sidebar from "@/shared/ui/Sidebar";

export default async function RzutnikLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/logowanie");

  return (
    <div style={{ minHeight: "100vh", background: "#0f0e17" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}
