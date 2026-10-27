"use client";

import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventInput } from "@fullcalendar/core";
import EventCard from "./event-card";
import { isPastEvent, type DBEvent } from "./types";

/** Pill colours per event type, matching the tints used on the cards. */
const TYPE_COLORS: Record<string, string> = {
  Social: "#e8a53b",
  Academic: "#6b3fa0",
  Cultural: "#ff7a5c",
  Workshop: "#4fb2c4",
  Networking: "#3f8f5d",
  Other: "#8a7a5c",
};

/** First of the month, `offset` months from now, in local time. */
function monthStart(offset: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  return d;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function CalendarMonthView({ events }: { events: DBEvent[] }) {
  const [selected, setSelected] = useState<DBEvent | null>(null);

  const fcEvents = useMemo<EventInput[]>(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        // A bare YYYY-MM-DD is parsed as an all-day local date, which is what
        // we want -- these events have no machine-readable start time.
        start: e.event_date,
        allDay: true,
        backgroundColor: isPastEvent(e.event_date)
          ? "#b9b2a6"
          : (TYPE_COLORS[e.type] ?? TYPE_COLORS.Other),
        borderColor: "transparent",
        extendedProps: { dbEvent: e },
      })),
    [events],
  );

  const months = [monthStart(0), monthStart(1)];

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        {months.map((month, i) => (
          <div
            key={month.toISOString()}
            className="rounded-[1.75rem] bg-card p-5 shadow-[var(--shadow-soft)]"
          >
            <h3 className="font-display mb-3 text-center text-[1.15rem] font-bold text-foreground">
              {monthLabel(month)}
            </h3>
            <div className="fc-uisac">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                initialDate={month}
                // Our own heading above replaces the built-in toolbar, and
                // without nav buttons the two grids stay on the two months
                // this view promises.
                headerToolbar={false}
                height="auto"
                fixedWeekCount={false}
                showNonCurrentDates={false}
                dayMaxEvents={3}
                moreLinkContent={(a) => `+${a.num} more`}
                firstDay={0}
                events={fcEvents}
                eventClick={(info) => {
                  info.jsEvent.preventDefault();
                  setSelected(info.event.extendedProps.dbEvent as DBEvent);
                }}
                eventClassNames="cursor-pointer"
                aria-label={`${monthLabel(month)} calendar`}
                // Only the second grid is lazily sized; both need this to
                // render correctly inside a flex/grid parent.
                handleWindowResize={i === 0}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {selected ? (
          <>
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-[15px] font-bold text-foreground/70">
                Selected event
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full border-[1.5px] border-border px-3.5 py-1.5 text-[13px] font-bold text-foreground transition hover:bg-foreground/5"
              >
                Clear
              </button>
            </div>
            <EventCard event={selected} />
          </>
        ) : (
          <p className="text-center text-sm text-foreground/60">
            Select an event in the calendar to see its details.
          </p>
        )}
      </div>
    </div>
  );
}
