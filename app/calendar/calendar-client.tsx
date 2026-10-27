"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CalendarDays, ChevronDown, List, Pencil, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../components/auth-provider";
import { deleteEvent, getApprovedEvents, getMyEvents } from "./actions";
import EventCard from "./event-card";
import { formatEventFull, isPastEvent, type DBEvent } from "./types";

const SubmitEventModal = dynamic(() => import("./submit-event-modal"), {
  ssr: false,
});

// FullCalendar is a large dependency and the list view is the default, so it
// is only fetched once someone actually switches to the calendar.
const CalendarMonthView = dynamic(() => import("./calendar-month-view"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4e2a84] border-t-transparent" />
    </div>
  ),
});

const ROW_TAPE = ["bg-[#f6b93b]/80", "bg-[#ff7a5c]/80", "bg-[#4fb2c4]/80"];

const STATUS_TINTS: Record<string, string> = {
  pending: "bg-[#fef1de] text-[#7a5309]",
  approved: "bg-[#eaf5ee] text-[#1f5836]",
  rejected: "bg-[#fdece5] text-[#b0402a]",
};

type View = "list" | "calendar";

export default function CalendarClient({
  initialEvents,
}: {
  initialEvents: DBEvent[];
}) {
  const { user } = useAuth();
  const [events, setEvents] = useState<DBEvent[]>(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [myEvents, setMyEvents] = useState<DBEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<DBEvent | null>(null);
  const [view, setView] = useState<View>("list");

  async function refreshEvents() {
    try {
      setEvents(await getApprovedEvents());
    } catch {
      // leave the existing list in place if the refresh fails
    }
    await refreshMyEvents();
  }

  async function refreshMyEvents() {
    if (!user) return;
    try {
      setMyEvents(await getMyEvents(user.id));
    } catch {
      // the section just stays as it was
    }
  }

  // Submissions of any status, which is the only place a pending or rejected
  // event is visible to the person who submitted it.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getMyEvents(user.id)
      .then((rows) => {
        if (!cancelled) setMyEvents(rows);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function removeEvent(event: DBEvent) {
    const previous = myEvents;
    setMyEvents((prev) => prev.filter((e) => e.id !== event.id));
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
    try {
      await deleteEvent(event);
    } catch {
      setMyEvents(previous);
      await refreshEvents();
    }
  }

  const mySubmissions = user ? myEvents : [];

  // Events arrive oldest-first. Upcoming leads the page; past events are
  // tucked into a collapsed section, most recent first.
  const upcoming = events.filter((e) => !isPastEvent(e.event_date));
  const past = events.filter((e) => isPastEvent(e.event_date)).reverse();

  const views: { key: View; label: string; icon: typeof List }[] = [
    { key: "list", label: "List", icon: List },
    { key: "calendar", label: "Calendar", icon: CalendarDays },
  ];

  return (
    <section>
      <div className="mx-auto max-w-300 px-5 py-14 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="font-display mb-2.5 text-[2.2rem] font-bold tracking-tight text-foreground sm:text-[2.7rem]">
              Upcoming events
            </h1>
            <p className="text-lg text-foreground/68">
              Stay connected and involved with our community.
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#4e2a84] px-6.5 py-3.5 text-[15px] font-bold text-[#fffdf8] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <Plus size={17} strokeWidth={2.5} />
              Add Event
            </button>
          )}
        </div>

        <div
          role="tablist"
          aria-label="Event view"
          className="mb-8 inline-flex gap-1 rounded-full bg-secondary p-1"
        >
          {views.map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.key}
                role="tab"
                aria-selected={view === v.key}
                onClick={() => setView(v.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[15px] font-bold transition ${
                  view === v.key
                    ? "bg-[#4e2a84] text-[#fffdf8]"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <Icon size={16} strokeWidth={2.5} />
                {v.label}
              </button>
            );
          })}
        </div>

        {events.length === 0 ? (
          <div className="rounded-[2rem] bg-[#f4eefa] px-6 py-24 text-center shadow-[var(--shadow-soft)]">
            <p className="mb-2.5 text-lg font-extrabold text-foreground">
              No events yet
            </p>
            {user ? (
              <p className="text-[15px] text-foreground/65">
                Be the first to{" "}
                <button
                  onClick={() => setShowModal(true)}
                  className="font-bold text-[#4e2a84]"
                >
                  submit one
                </button>
                .
              </p>
            ) : (
              <p className="text-[15px] text-foreground/65">
                Be the first to submit one.{" "}
                <a href="/auth" className="font-bold">
                  sign in
                </a>{" "}
                to get started.
              </p>
            )}
          </div>
        ) : view === "calendar" ? (
          <CalendarMonthView events={events} />
        ) : (
          <>
            {upcoming.length === 0 ? (
              <div className="rounded-[2rem] bg-[#f4eefa] px-6 py-16 text-center shadow-[var(--shadow-soft)]">
                <p className="text-[15px] font-bold text-foreground/70">
                  Nothing coming up right now.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {upcoming.map((event, i) => (
                  <div key={event.id} className="relative">
                    <span
                      aria-hidden="true"
                      className={`tape absolute -top-3 left-10 ${ROW_TAPE[i % ROW_TAPE.length]}`}
                    />
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            )}

            {past.length > 0 && (
              // <details> gives the open/close behaviour and keyboard support
              // for free, and keeps the section collapsed on first paint.
              <details className="group mt-10 rounded-[1.5rem] border-[1.5px] border-border bg-card/60">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4.5 [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px] font-extrabold text-foreground">
                    Past events{" "}
                    <span className="font-bold text-foreground/55">
                      ({past.length})
                    </span>
                  </span>
                  <ChevronDown
                    size={18}
                    strokeWidth={2.5}
                    aria-hidden="true"
                    className="shrink-0 text-foreground/55 transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="flex flex-col gap-5 px-6 pt-1 pb-6">
                  {past.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </details>
            )}
          </>
        )}

        {!user && (
          <p className="mt-7 text-center text-sm text-foreground/65">
            <a href="/auth" className="font-bold">
              Sign in
            </a>{" "}
            to submit an event for approval.
          </p>
        )}

        {/* Guarded on user rather than cleared in the effect, so a sign-out
            never leaves the previous account's submissions on screen. */}
        {user && mySubmissions.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display mb-2 text-[1.5rem] font-bold text-foreground sm:text-[1.8rem]">
              Your submissions
            </h2>
            <p className="mb-6 text-[15px] text-foreground/68">
              Only you can see this. Editing an event sends it back for review,
              and an event can no longer be edited once its date has passed.
            </p>

            <div className="flex flex-col gap-3">
              {mySubmissions.map((event) => {
                // Mirrors the RLS policy: once the date has passed the row is
                // a record, so the control is hidden rather than left to fail
                // on save. Admins edit past events from /admin instead.
                const locked = isPastEvent(event.event_date);
                return (
                  <div
                    key={event.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border-[1.5px] border-border bg-card px-5 py-4 shadow-[var(--shadow-soft)]"
                  >
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                        STATUS_TINTS[event.status] ?? STATUS_TINTS.pending
                      }`}
                    >
                      {event.status}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-bold text-foreground">
                        {event.title}
                      </span>
                      <span className="block text-[13px] text-foreground/60">
                        {formatEventFull(event.event_date)}, {event.time}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {locked ? (
                        <span className="text-[13px] font-bold text-foreground/45">
                          Past &middot; locked
                        </span>
                      ) : (
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-border px-3.5 py-1.5 text-[13px] font-bold text-foreground transition hover:bg-foreground/5"
                        >
                          <Pencil size={13} strokeWidth={2.5} />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => removeEvent(event)}
                        className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#e3b3ab] px-3.5 py-1.5 text-[13px] font-bold text-[#b0402a] transition hover:bg-[#b0402a]/8"
                      >
                        <Trash2 size={13} strokeWidth={2.5} />
                        Delete
                      </button>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <SubmitEventModal
          onClose={() => setShowModal(false)}
          onSubmitted={() => {
            setShowModal(false);
            refreshEvents();
          }}
        />
      )}

      {editingEvent && (
        <SubmitEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSubmitted={() => {
            setEditingEvent(null);
            refreshEvents();
          }}
        />
      )}
    </section>
  );
}
