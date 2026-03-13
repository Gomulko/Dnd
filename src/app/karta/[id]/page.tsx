import { notFound, redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth";
import { getCharacter } from "@/domains/character/actions/getCharacter";
import CharacterSheet from "@/domains/character/components/CharacterSheet";
import Navbar from "@/shared/ui/Navbar";
import { LastVisitedTracker } from "@/shared/ui/LastVisitedTracker";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function KartaPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/logowanie");

  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "#0f0e17" }}>
      <LastVisitedTracker id={character.id} name={character.name} />
      <Navbar />
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px" }}>
        <CharacterSheet character={character} />
      </main>
    </div>
  );
}
