"use server";

import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type DbReply = {
  id: string;
  question_id: string;
  text: string;
  created_at: string;
  edited_at: string | null;
};

export type DbQuestion = {
  id: string;
  text: string;
  upvotes: number;
  created_at: string;
  edited_at: string | null;
  replies: DbReply[];
};

/** Which posts belong to the caller. The author column is not readable through
 *  the API, so ownership comes back from a security definer function instead. */
export type MyDiscussionIds = { questions: string[]; replies: string[] };

// Columns must be listed explicitly: SELECT on these tables is granted per
// column so the author stays hidden, which means `select("*")` is rejected.
const QUESTION_COLUMNS =
  "id, text, upvotes, created_at, edited_at, replies(id, question_id, text, created_at, edited_at)";

export async function getQuestions(): Promise<DbQuestion[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("questions")
    .select(QUESTION_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as DbQuestion[];
}

export async function getMyDiscussionIds(
  accessToken: string,
): Promise<MyDiscussionIds> {
  const supabase = createSupabaseClient(accessToken);
  const { data, error } = await supabase.rpc("my_discussion_ids");
  if (error) throw new Error(error.message);
  return (data ?? { questions: [], replies: [] }) as MyDiscussionIds;
}

export async function createQuestion(
  text: string,
  accessToken: string,
): Promise<DbQuestion> {
  const supabase = createSupabaseClient(accessToken);
  const { data, error } = await supabase
    .from("questions")
    .insert({ text })
    .select("id, text, upvotes, created_at, edited_at")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/discussions");
  return { ...(data as unknown as DbQuestion), replies: [] };
}

export async function createReply(
  questionId: string,
  text: string,
  accessToken: string,
): Promise<DbReply> {
  const supabase = createSupabaseClient(accessToken);
  const { data, error } = await supabase
    .from("replies")
    .insert({ question_id: questionId, text })
    .select("id, question_id, text, created_at, edited_at")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/discussions");
  return data as unknown as DbReply;
}

// RLS decides who may edit or delete. If the caller owns neither, the write
// matches no rows and Supabase reports no error, so these check the returned
// rows and surface a refusal rather than silently appearing to succeed.

export async function updateQuestion(
  questionId: string,
  text: string,
  accessToken: string,
): Promise<DbQuestion> {
  const supabase = createSupabaseClient(accessToken);
  const { data, error } = await supabase
    .from("questions")
    .update({ text, edited_at: new Date().toISOString() })
    .eq("id", questionId)
    .select("id, text, upvotes, created_at, edited_at");
  if (error) throw new Error(error.message);
  if (!data?.length)
    throw new Error(
      "Questions can only be edited by their author within 5 minutes of posting.",
    );
  revalidatePath("/discussions");
  return { ...(data[0] as unknown as DbQuestion), replies: [] };
}

export async function deleteQuestion(
  questionId: string,
  accessToken: string,
): Promise<void> {
  const supabase = createSupabaseClient(accessToken);
  const { data, error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId)
    .select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error("You can only delete your own question.");
  revalidatePath("/discussions");
}

export async function updateReply(
  replyId: string,
  text: string,
  accessToken: string,
): Promise<DbReply> {
  const supabase = createSupabaseClient(accessToken);
  const { data, error } = await supabase
    .from("replies")
    .update({ text, edited_at: new Date().toISOString() })
    .eq("id", replyId)
    .select("id, question_id, text, created_at, edited_at");
  if (error) throw new Error(error.message);
  if (!data?.length)
    throw new Error(
      "Replies can only be edited by their author within 5 minutes of posting.",
    );
  revalidatePath("/discussions");
  return data[0] as unknown as DbReply;
}

export async function deleteReply(
  replyId: string,
  accessToken: string,
): Promise<void> {
  const supabase = createSupabaseClient(accessToken);
  const { data, error } = await supabase
    .from("replies")
    .delete()
    .eq("id", replyId)
    .select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error("You can only delete your own reply.");
  revalidatePath("/discussions");
}

export async function adjustUpvote(
  questionId: string,
  delta: 1 | -1,
  accessToken: string,
): Promise<void> {
  const supabase = createSupabaseClient(accessToken);
  const { error } = await supabase.rpc("increment_upvotes", {
    question_id: questionId,
    delta,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/discussions");
}
