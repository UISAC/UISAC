import { supabase, createSupabaseClient } from "@/lib/supabase";
import type { DBEvent } from "./types";

export const BANNER_BUCKET = "event-banners";

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

/** The caller's own submissions, whatever their status. Relies on the
 *  "Users can view their own submissions" policy, so it only ever returns
 *  events belonging to the signed-in user. */
export async function getMyEvents(userId: string): Promise<DBEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .order("event_date", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as DBEvent[];
}

/** Banner files live under the uploader's own folder, so the object path can
 *  be recovered from the public URL in order to delete it. */
function bannerPathFromUrl(url: string): string | null {
  const marker = `/object/public/${BANNER_BUCKET}/`;
  const at = url.indexOf(marker);
  return at === -1 ? null : url.slice(at + marker.length);
}

export async function deleteBanner(bannerUrl: string | null): Promise<void> {
  if (!bannerUrl) return;
  const path = bannerPathFromUrl(bannerUrl);
  if (!path) return;
  // A failure here leaves an orphaned file but must not block the caller.
  await supabase.storage.from(BANNER_BUCKET).remove([path]);
}

export async function deleteEvent(event: DBEvent): Promise<void> {
  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", event.id)
    .select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) {
    throw new Error("You can only delete your own events.");
  }
  await deleteBanner(event.banner_url);
}
