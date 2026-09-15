export type DBEvent = {
  id: string;
  title: string;
  copy: string;
  /** ISO date, e.g. "2026-01-17". */
  event_date: string;
  time: string;
  place: string;
  type: string;
  banner_url: string | null;
  status: "pending" | "approved" | "rejected";
  user_id: string | null;
  user_email: string | null;
  created_at: string;
};

/** Parsed as local time; a bare "YYYY-MM-DD" would otherwise be read as UTC
 *  and show the previous day for anyone west of Greenwich. */
export function parseEventDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatEventMonth(isoDate: string): string {
  return parseEventDate(isoDate)
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
}

export function formatEventDay(isoDate: string): string {
  return String(parseEventDate(isoDate).getDate());
}

export function formatEventFull(isoDate: string): string {
  return parseEventDate(isoDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function isPastEvent(isoDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseEventDate(isoDate) < today;
}
