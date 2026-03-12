import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/shared/ui/Navbar";
import Sidebar from "@/shared/ui/Sidebar";

export default async function RzutnikLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/logowanie");

  return (
    <div style={{ minHeight: "100vh", background: "#d8d8d8" }}>
      <Navbar />
      <div style={{ display: "flex", position: "relative" }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}
