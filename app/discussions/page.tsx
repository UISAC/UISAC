import { getQuestions, type DbQuestion } from "./actions";
import DiscussionsClient from "./discussions-client";

// Mutations revalidatePath already, but force-dynamic keeps this correct
// even if that ever drifts, and matches the always-fresh anonymous-Q&A UX.
export const dynamic = "force-dynamic";

export default async function DiscussionsPage() {
  let questions: DbQuestion[] = [];
  try {
    questions = await getQuestions();
  } catch {
    // Supabase not yet configured — page still renders with empty state
  }
  return <DiscussionsClient initialQuestions={questions} />;
}
