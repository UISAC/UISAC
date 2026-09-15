"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CalendarDays, Clock, MapPin, Plus } from "lucide-react";
import { googleMapsSearchUrl } from "@/lib/google-places";
import { useAuth } from "../components/auth-provider";
import { getApprovedEvents } from "./actions";
import { formatEventFull, isPastEvent, type DBEvent } from "./types";

const SubmitEventModal = dynamic(() => import("./submit-event-modal"), {
  ssr: false,
});

const ROW_TAPE = ["bg-[#f6b93b]/80", "bg-[#ff7a5c]/80", "bg-[#4fb2c4]/80"];

const TYPE_TINTS: Record<string, string> = {
  Social: "bg-[#fef1de] text-[#7a5309]",
  Academic: "bg-[#f4eefa] text-[#3f216d]",
  Cultural: "bg-[#fff0eb] text-[#7a2d16]",
  Workshop: "bg-[#eaf6f8] text-[#0d4750]",
  Networking: "bg-[#eaf5ee] text-[#1f5836]",
  Other: "bg-[#f1e8d8] text-[#4a3c1f]",
};

export default function CalendarClient({
  initialEvents,
}: {
  initialEvents: DBEvent[];
}) {
  const { user } = useAuth();
  const [events, setEvents] = useState<DBEvent[]>(initialEvents);
  const [showModal, setShowModal] = useState(false);

  async function refreshEvents() {
    try {
      setEvents(await getApprovedEvents());
    } catch {
      // leave the existing list in place if the refresh fails
    }
  }

  // Events arrive oldest-first. Show what is still to come at the top, then
  // past events below, most recent first, so the page leads with what is
  // actually upcoming.
  const upcoming = events.filter((e) => !isPastEvent(e.event_date));
  const past = events.filter((e) => isPastEvent(e.event_date)).reverse();
  const ordered = [...upcoming, ...past];

  return (
    <section>
      <div className="mx-auto max-w-300 px-5 py-14 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
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
        ) : (
          <div className="flex flex-col gap-5">
            {ordered.map((event, i) => {
              const past = isPastEvent(event.event_date);
              return (
                <div key={event.id} className="relative">
                  <span
                    aria-hidden="true"
                    className={`tape absolute -top-3 left-10 ${
                      past ? "bg-foreground/15" : ROW_TAPE[i % ROW_TAPE.length]
                    }`}
                  />
                  <article
                    className={`grid grid-cols-1 items-start gap-6 rounded-[1.75rem] bg-card p-6 shadow-[var(--shadow-soft)] transition sm:grid-cols-[1fr_auto] ${
                      past
                        ? "opacity-60 grayscale"
                        : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                      {event.banner_url && (
                        // Fixed box plus object-cover so every banner renders at
                        // the same size whatever the uploaded image's shape.
                        <img
                          src={event.banner_url}
                          alt=""
                          loading="lazy"
                          // An admin can delete a banner file while the event
                          // still points at it; collapse rather than leave a hole.
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          className="h-40 w-full shrink-0 rounded-[14px] object-cover sm:h-36 sm:w-36"
                        />
                      )}

                      <div className="min-w-0">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                          <h2 className="text-[1.4rem] font-extrabold text-foreground">
                            {event.title}
                          </h2>
                          {past && (
                            <span className="rounded-full bg-foreground/10 px-2.5 py-1 text-xs font-bold text-foreground/60">
                              Past
                            </span>
                          )}
                        </div>

                        <p
                          className={`mb-3 inline-flex items-center gap-1.5 text-sm font-bold ${
                            past ? "text-foreground/60" : "text-[#4e2a84]"
                          }`}
                        >
                          <CalendarDays size={15} strokeWidth={2.25} />
                          {formatEventFull(event.event_date)}
                        </p>

                        <p className="mb-3 text-[15px] leading-relaxed text-foreground">
                          {event.copy}
                        </p>
                        <div className="flex flex-wrap gap-4.5 text-sm text-foreground/75">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={15} strokeWidth={2.25} />
                            {event.time}
                          </span>
                          <a
                            href={googleMapsSearchUrl(event.place)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 font-bold text-[#4e2a84] no-underline hover:underline"
                          >
                            <MapPin size={15} strokeWidth={2.25} />
                            {event.place}
                          </a>
                        </div>
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
              );
            })}
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
            refreshEvents();
          }}
        />
      )}
    </section>
  );
}
