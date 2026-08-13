"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../components/auth-provider";
import SubmitEventModal from "./submit-event-modal";

export type DBEvent = {
  id: string;
  title: string;
  copy: string;
  month: string;
  day: string;
  time: string;
  place: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  user_id: string | null;
  user_email: string | null;
  created_at: string;
};

const ROW_TAPE = ["bg-[#f6b93b]/80", "bg-[#ff7a5c]/80", "bg-[#4fb2c4]/80"];

const TYPE_TINTS: Record<string, string> = {
  Social: "bg-[#fef1de] text-[#7a5309]",
  Academic: "bg-[#f4eefa] text-[#3f216d]",
  Cultural: "bg-[#fff0eb] text-[#7a2d16]",
  Workshop: "bg-[#eaf6f8] text-[#0d4750]",
  Networking: "bg-[#eaf5ee] text-[#1f5836]",
  Other: "bg-[#f1e8d8] text-[#4a3c1f]",
};

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function fetchEvents() {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: true });
    setEvents(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <section>
      <div className="mx-auto max-w-300 px-5 py-14 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="mb-2.5 text-[2.6rem] font-extrabold tracking-tight text-foreground">
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4e2a84] border-t-transparent" />
          </div>
        ) : events.length === 0 ? (
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
                Be the first to submit one —{" "}
                <a href="/auth" className="font-bold">
                  sign in
                </a>{" "}
                to get started.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {events.map((event, i) => (
              <div
                key={event.id}
                className={`relative ${i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
              >
                <span
                  aria-hidden="true"
                  className={`tape absolute -top-3 left-10 ${
                    i % 2 === 0 ? "rotate-[-5deg]" : "rotate-[5deg]"
                  } ${ROW_TAPE[i % ROW_TAPE.length]}`}
                />
                <article className="grid grid-cols-1 items-start gap-6 rounded-[1.75rem] bg-card p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] sm:grid-cols-[100px_1fr_auto]">
                  <div className="rounded-2xl bg-[#4e2a84] py-3.5 text-center text-[#fffdf8]">
                    <p className="text-xs font-extrabold uppercase tracking-wide opacity-80">
                      {event.month}
                    </p>
                    <p className="mt-0.5 text-[2.1rem] font-extrabold">
                      {event.day}
                    </p>
                  </div>

                  <div>
                    <h2 className="mb-2 text-[1.4rem] font-extrabold text-foreground">
                      {event.title}
                    </h2>
                    <p className="mb-3 text-[15px] leading-relaxed text-foreground">
                      {event.copy}
                    </p>
                    <div className="flex flex-wrap gap-4.5 text-sm text-foreground/75">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={15} strokeWidth={2.25} />
                        {event.time}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={15} strokeWidth={2.25} />
                        {event.place}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex h-fit shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold ${
                      TYPE_TINTS[event.type] ?? TYPE_TINTS.Other
                    }`}
                  >
                    {event.type}
                  </span>
                </article>
              </div>
            ))}
          </div>
        )}

        {!user && (
          <p className="mt-7 text-center text-sm text-foreground/65">
            <a href="/auth" className="font-bold">
              Sign in
            </a>{" "}
            to submit an event for approval.
          </p>
        )}
      </div>

      {showModal && (
        <SubmitEventModal
          onClose={() => setShowModal(false)}
          onSubmitted={() => {
            setShowModal(false);
            fetchEvents();
          }}
        />
      )}
    </section>
  );
}
