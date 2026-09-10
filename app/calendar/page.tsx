import { getApprovedEvents } from "./actions";
import CalendarClient from "./calendar-client";

// Admin approvals happen via a plain client-side update with no
// revalidatePath trigger, so this must render fresh every request rather
// than serve a build-time-static snapshot.
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  let events: Awaited<ReturnType<typeof getApprovedEvents>> = [];
  try {
    events = await getApprovedEvents();
  } catch {
    // Supabase not yet configured — page still renders with empty state
  }
  return <CalendarClient initialEvents={events} />;
}
