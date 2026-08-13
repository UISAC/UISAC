"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../components/auth-provider";
import type { DBEvent } from "../calendar/page";

type Tab = "pending" | "approved" | "rejected";

export default function AdminPage() {
  const { user, isAdminUser, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("pending");
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

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
    await supabase.from("events").update({ status }).eq("id", id);
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
                <p className="my-2 text-[15px] text-foreground/75">
                  {event.copy}
                </p>
                <div className="flex flex-wrap gap-4 text-[13px] text-foreground/65">
                  <span>
                    {event.month} {event.day}
                  </span>
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
            </article>
          ))
        )}
      </div>
    </section>
  );
}
