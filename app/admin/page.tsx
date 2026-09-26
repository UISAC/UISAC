"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../components/auth-provider";
import { deleteEvent } from "../calendar/actions";
import { formatEventFull, type DBEvent } from "../calendar/types";

const SubmitEventModal = dynamic(
  () => import("../calendar/submit-event-modal"),
  { ssr: false },
);

type Tab = "pending" | "approved" | "rejected";

export default function AdminPage() {
  const { user, isAdminUser, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("pending");
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<DBEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function removeEvent(event: DBEvent) {
    setUpdating(event.id);
    setError(null);
    const previous = events;
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
    try {
      await deleteEvent(event);
    } catch (e) {
      setEvents(previous);
      setError(e instanceof Error ? e.message : "Could not delete that event.");
    }
    setUpdating(null);
  }

  async function fetchEvents(status: Tab) {
    setLoadingEvents(true);
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
    setEvents(data ?? []);
    setLoadingEvents(false);
  }

  useEffect(() => {
    if (isAdminUser) fetchEvents(tab);
  }, [tab, isAdminUser]);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setUpdating(id);
    setError(null);
    // Asking for the row back matters. RLS refuses a write in two different
    // ways: a failed with-check raises, but a failed using-clause just matches
    // no rows and reports success. Ignoring both is what made an admin missing
    // from is_admin() look like an Approve button that did nothing at all.
    const { data, error } = await supabase
      .from("events")
      .update({ status })
      .eq("id", id)
      .select("id");
    if (error) {
      setError(error.message);
    } else if (!data?.length) {
      setError(
        "The database refused that change. Your account is probably missing " +
          "from the is_admin() function in Supabase.",
      );
    }
    setUpdating(null);
    fetchEvents(tab);
  }

  if (authLoading) {
    return (
      <section className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4e2a84] border-t-transparent" />
      </section>
    );
  }

  if (!user || !isAdminUser) {
    return (
      <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4">
        <div className="max-w-md rounded-[2rem] bg-card p-10 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#f4eefa]">
            <span className="h-6 w-6 rounded-full border-2 border-[#4e2a84]" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Access denied
          </h1>
          <p className="mt-2 text-foreground/72">
            This page is restricted to UISAC administrators.
          </p>
          <a
            href="/"
            className="mt-6 inline-block rounded-full bg-[#4e2a84] px-7 py-3 font-bold text-[#fffdf8] no-underline"
          >
            Go home
          </a>
        </div>
      </section>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <section className="mx-auto max-w-300 px-5 py-14 lg:px-8">
      <h1 className="mb-2 text-4xl font-extrabold text-foreground">
        Event approvals
      </h1>
      <p className="mb-8 text-foreground/68">
        Review and approve community-submitted events.
      </p>

      <div className="mb-8 inline-flex gap-1 rounded-full bg-secondary p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "rounded-full px-5.5 py-2.5 text-[15px] font-bold transition",
              tab === t.key
                ? "bg-[#4e2a84] text-[#fffdf8]"
                : "text-foreground/60 hover:text-foreground",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-5 rounded-2xl bg-[#fdece5] px-5 py-4 text-[15px] font-bold text-[#b0402a]">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {loadingEvents ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4e2a84] border-t-transparent" />
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-[1.75rem] bg-secondary py-20 text-center">
            <p className="font-bold text-foreground/65">No {tab} events.</p>
          </div>
        ) : (
          events.map((event) => (
            <article
              key={event.id}
              className="flex flex-wrap justify-between gap-5 rounded-[1.5rem] bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="min-w-65 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-extrabold text-foreground">
                    {event.title}
                  </h2>
                  <span className="rounded-full bg-[#f4eefa] px-2.5 py-1 text-xs font-bold text-[#3f216d]">
                    {event.type}
                  </span>
                </div>
                {event.banner_url && (
                  <img
                    src={event.banner_url}
                    alt=""
                    loading="lazy"
                    className="my-2 max-h-40 w-full max-w-100 rounded-[12px] object-cover"
                  />
                )}
                <p className="my-2 text-[15px] text-foreground/75">
                  {event.copy}
                </p>
                <div className="flex flex-wrap gap-4 text-[13px] text-foreground/65">
                  <span>{formatEventFull(event.event_date)}</span>
                  <span>{event.time}</span>
                  <span>{event.place}</span>
                </div>
                {event.user_email && (
                  <p className="mt-2 text-xs text-foreground/55">
                    Submitted by {event.user_email}
                  </p>
                )}
              </div>

              {tab === "pending" && (
                <div className="flex shrink-0 gap-2.5 self-start">
                  <button
                    disabled={updating === event.id}
                    onClick={() => updateStatus(event.id, "rejected")}
                    className="rounded-full bg-[#fdece5] px-4.5 py-2.5 text-sm font-bold text-[#b0402a] transition hover:bg-[#fadcd1] disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    disabled={updating === event.id}
                    onClick={() => updateStatus(event.id, "approved")}
                    className="rounded-full bg-[#eaf5ee] px-4.5 py-2.5 text-sm font-bold text-[#2c7a4b] transition hover:bg-[#d8ecdf] disabled:opacity-50"
                  >
                    {updating === event.id ? "Saving…" : "Approve"}
                  </button>
                </div>
              )}

              {tab === "approved" && (
                <button
                  disabled={updating === event.id}
                  onClick={() => updateStatus(event.id, "rejected")}
                  className="shrink-0 self-start rounded-full bg-[#fdece5] px-4.5 py-2.5 text-sm font-bold text-[#b0402a] transition hover:bg-[#fadcd1] disabled:opacity-50"
                >
                  Revoke
                </button>
              )}

              {tab === "rejected" && (
                <button
                  disabled={updating === event.id}
                  onClick={() => updateStatus(event.id, "approved")}
                  className="shrink-0 self-start rounded-full bg-[#eaf5ee] px-4.5 py-2.5 text-sm font-bold text-[#2c7a4b] transition hover:bg-[#d8ecdf] disabled:opacity-50"
                >
                  Approve
                </button>
              )}

              <div className="flex w-full gap-2 border-t border-divider-thin pt-3">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-bold text-foreground/60 transition hover:bg-foreground/5 hover:text-foreground"
                >
                  <Pencil size={13} strokeWidth={2.5} />
                  Edit
                </button>
                <button
                  onClick={() => removeEvent(event)}
                  disabled={updating === event.id}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-bold text-[#b0402a]/75 transition hover:bg-[#b0402a]/8 hover:text-[#b0402a] disabled:opacity-40"
                >
                  <Trash2 size={13} strokeWidth={2.5} />
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {editingEvent && (
        <SubmitEventModal
          event={editingEvent}
          asAdmin
          onClose={() => setEditingEvent(null)}
          onSubmitted={() => {
            setEditingEvent(null);
            fetchEvents(tab);
          }}
        />
      )}
    </section>
  );
}
