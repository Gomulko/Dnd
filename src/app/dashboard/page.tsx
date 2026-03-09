import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/shared/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/logowanie");

  return (
    <main className="min-h-screen bg-bg-primary">
      <nav className="h-16 border-b border-border flex items-center justify-between px-8">
        <span className="font-cinzel text-xl">
          <span className="text-accent-gold">⚔</span>{" "}
          <span className="text-text-primary">Kroniki Przygód</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-text-secondary text-sm">{session.user?.name}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/logowanie" });
            }}
          >
            <button type="submit" className="btn-ghost text-sm">
              Wyloguj
            </button>
          </form>
        </div>
      </nav>

      <div className="p-8">
        <h2 className="font-cinzel text-2xl text-text-primary mb-6">
          Witaj, {session.user?.name}!
        </h2>
        <p className="text-text-secondary">Dashboard gotowy. Tutaj pojawią się twoje postacie.</p>
      </div>
    </main>
  );
}
