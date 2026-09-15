import { createSupabaseClient } from "@/lib/supabase";
import type { DBEvent } from "./types";

export async function getApprovedEvents(): Promise<DBEvent[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .order("event_date", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as DBEvent[];
}
