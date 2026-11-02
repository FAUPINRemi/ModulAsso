import { redirect } from "next/navigation";
import { homePath } from "@/lib/session";

// Le proxy fait déjà ce choix. Ici on le refait au cas où la page est servie sans lui.
export default async function Home() {
  redirect(await homePath());
}
