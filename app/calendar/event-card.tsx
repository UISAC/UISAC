"use client";

import { CalendarDays, Clock, ExternalLink, MapPin } from "lucide-react";
import { googleMapsSearchUrl } from "@/lib/google-places";
import { formatEventFull, isPastEvent, type DBEvent } from "./types";

const TYPE_TINTS: Record<string, string> = {
  Social: "bg-[#fef1de] text-[#7a5309]",
  Academic: "bg-[#f4eefa] text-[#3f216d]",
  Cultural: "bg-[#fff0eb] text-[#7a2d16]",
  Workshop: "bg-[#eaf6f8] text-[#0d4750]",
  Networking: "bg-[#eaf5ee] text-[#1f5836]",
  Other: "bg-[#f1e8d8] text-[#4a3c1f]",
};

/** Shown instead of the raw URL, which is usually far too long for the card. */
function linkLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Link";
  }
}

export default function EventCard({ event }: { event: DBEvent }) {
  const past = isPastEvent(event.event_date);

  return (
    <article
      className={`grid grid-cols-1 items-start gap-6 overflow-hidden rounded-[1.75rem] bg-card p-6 shadow-[var(--shadow-soft)] transition sm:h-52 sm:grid-cols-[1fr_auto] ${
        past
          ? "opacity-60 grayscale"
          : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
      }`}
    >
      {/* h-40 is the card's h-52 minus its p-6 top and bottom. It is spelled
          out rather than inherited with h-full: the grid uses items-start, so
          the grid item is sized to its content and a percentage height has no
          definite parent to resolve against -- it falls back to auto and the
          banner renders at its natural height, spilling out of the card. */}
      <div className="flex min-w-0 flex-col gap-4 sm:h-40 sm:flex-row sm:items-start sm:gap-5">
        {event.banner_url && (
          // Fixed box plus object-cover so every banner renders at the same
          // size whatever the uploaded image's shape.
          <img
            src={event.banner_url}
            alt=""
            loading="lazy"
            // An admin can delete a banner file while the event still points
            // at it; collapse rather than leave a hole.
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="h-40 w-full shrink-0 rounded-[14px] object-cover sm:h-40 sm:w-40"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col sm:h-40">
          <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
            <h2 className="line-clamp-1 text-[1.4rem] font-extrabold text-foreground">
              {event.title}
            </h2>
            {past && (
              <span className="shrink-0 rounded-full bg-foreground/10 px-2.5 py-1 text-xs font-bold text-foreground/60">
                Past
              </span>
            )}
          </div>

          <p
            className={`mb-2 inline-flex items-center gap-1.5 text-sm font-bold ${
              past ? "text-foreground/60" : "text-[#4e2a84]"
            }`}
          >
            <CalendarDays size={15} strokeWidth={2.25} />
            {formatEventFull(event.event_date)}
          </p>

          {/* The card is a fixed height, so long copy is trimmed with an
              ellipsis rather than being allowed to set the card's size. */}
          {/* break-words matters because people paste raw URLs into the
              description: a long unbroken string has no wrap point and would
              otherwise run past the card's edge. */}
          <p className="mb-3 line-clamp-2 break-words text-[15px] leading-relaxed text-foreground">
            {event.copy}
          </p>

          {/* One row on desktop. A long venue name used to wrap this onto a
              second line, which pushed the card's content past its fixed
              height and left the clamped copy sliced through mid-line by the
              overflow clip. Each item truncates instead. Mobile cards have no
              fixed height, so wrapping is fine there. */}
          <div className="mt-auto flex flex-wrap gap-x-4.5 gap-y-2 text-sm text-foreground/75 sm:flex-nowrap">
            {/* shrink-0 so the squeeze from flex-nowrap lands on the venue
                name, which truncates, rather than breaking the time in two. */}
            <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap">
              <Clock size={15} strokeWidth={2.25} />
              {event.time}
            </span>
            <a
              href={googleMapsSearchUrl(event.place)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-0 items-center gap-1.5 font-bold text-[#4e2a84] no-underline hover:underline"
            >
              <MapPin size={15} strokeWidth={2.25} className="shrink-0" />
              <span className="truncate">{event.place}</span>
            </a>
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-0 items-center gap-1.5 font-bold text-[#4e2a84] no-underline hover:underline"
              >
                <ExternalLink size={15} strokeWidth={2.25} className="shrink-0" />
                <span className="truncate">{linkLabel(event.link)}</span>
              </a>
            )}
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
  );
}
