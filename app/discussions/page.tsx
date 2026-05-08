import { getQuestions, type DbQuestion } from "./actions";
import DiscussionsClient from "./discussions-client";

export default async function DiscussionsPage() {
  let questions: DbQuestion[] = [];
  try {
    questions = await getQuestions();
  } catch (err) {
    console.error("[DiscussionsPage] getQuestions failed:", err);
  }
  return <DiscussionsClient initialQuestions={questions} />;
}
