"use client";

import { useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../components/auth-provider";

// Common Northwestern (Evanston) campus locations, offered as autosuggest.
// Free text is always accepted — this just speeds up the common case.
const CAMPUS_LOCATIONS = [
  "Norris University Center",
  "Norris Aquatics Center",
  "University Library",
  "Technological Institute (Tech)",
  "Fisk Hall",
  "Kresge Centennial Hall",
  "Annie May Swift Hall",
  "Harris Hall",
  "Kellogg Global Hub",
  "McCormick Foundation Center",
  "Frances Searle Building",
  "Ryan Fieldhouse",
  "Welsh-Ryan Arena",
  "Patten Gymnasium",
  "Segal Visitors Center",
  "Deering Meadow",
  "The Arch",
  "Foster-Walker Complex (Plex)",
  "Sargent Hall",
  "Allison Hall",
  "Bobb-McCulloch Hall",
  "Hobart House",
  "Willard Residential College",
  "Shepard Residential College",
  "Slivka Residential College",
  "Chapin Hall",
  "1835 Hinman",
  "International Studies Residential College",
  "Buffett Institute for Global Affairs",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS_IN_MONTH: Record<string, number> = {
  January: 31, February: 29, March: 31, April: 30, May: 31, June: 30,
  July: 31, August: 31, September: 30, October: 31, November: 30, December: 31,
};

const EVENT_TYPES = ["Social", "Academic", "Cultural", "Workshop", "Networking", "Other"];

// "3 PM", "3:00 PM", "3:00 PM – 5:30 PM", "15:00", "15:00-17:30"
const TIME_PATTERN =
  /^((0?[1-9]|1[0-2])(:[0-5]\d)?\s*[AaPp][Mm](\s*(-|–|to)\s*(0?[1-9]|1[0-2])(:[0-5]\d)?\s*[AaPp][Mm])?|([01]?\d|2[0-3]):[0-5]\d(\s*(-|–|to)\s*([01]?\d|2[0-3]):[0-5]\d)?)$/;

type FormState = {
  title: string;
  copy: string;
  month: string;
  day: string;
  time: string;
  place: string;
  type: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  const title = form.title.trim();
  if (!title) errors.title = "Give the event a title.";
  else if (title.length < 3) errors.title = "Title's too short to be useful.";
  else if (title.length > 120) errors.title = "Keep it under 120 characters.";

  const copy = form.copy.trim();
  if (!copy) errors.copy = "Tell people what to expect.";
  else if (copy.length < 10) errors.copy = "Add a bit more detail (10+ characters).";
  else if (copy.length > 600) errors.copy = "Keep it under 600 characters.";

  const day = Number(form.day);
  const maxDay = DAYS_IN_MONTH[form.month] ?? 31;
  if (!form.day.trim()) errors.day = "Required.";
  else if (!Number.isInteger(day) || day < 1 || day > maxDay) {
    errors.day = `Enter a day between 1 and ${maxDay} for ${form.month}.`;
  }

  const time = form.time.trim();
  if (!time) errors.time = "Required.";
  else if (!TIME_PATTERN.test(time)) {
    errors.time = "Use a format like “3:00 PM” or “3:00 PM – 5:30 PM”.";
  }

  const place = form.place.trim();
  if (!place) errors.place = "Required.";
  else if (place.length < 2) errors.place = "That doesn't look like a location.";

  return errors;
}

type Props = {
  onClose: () => void;
  onSubmitted: () => void;
};

export default function SubmitEventModal({ onClose, onSubmitted }: Props) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState(false);

  const [form, setForm] = useState<FormState>({
    title: "",
    copy: "",
    month: "January",
    day: "",
    time: "",
    place: "",
    type: "Social",
  });

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched) {
      setFieldErrors((prev) => validate({ ...form, [field]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setTouched(true);
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setError(null);
    setSubmitting(true);

    const { error } = await supabase.from("events").insert({
      title: form.title.trim(),
      copy: form.copy.trim(),
      month: form.month,
      day: form.day.trim(),
      time: form.time.trim(),
      place: form.place.trim(),
      type: form.type,
      status: "pending",
      user_id: user.id,
      user_email: user.email,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#241b2e]/20 px-4 py-8 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-140 overflow-y-auto rounded-[2rem] bg-card shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between border-b-2 border-divider px-7 py-6">
          <h2 className="text-xl font-extrabold text-foreground">
            Submit an event
          </h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-foreground/5 text-2xl leading-none text-foreground transition hover:bg-foreground/10"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {success ? (
          <div className="px-8 py-12 text-center">
            <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#eaf5ee] text-[#2c7a4b]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="mb-2.5 text-xl font-extrabold text-foreground">
              Event submitted!
            </h3>
            <p className="mb-6 text-[15px] text-foreground/72">
              Your event is pending admin approval and will appear on the
              calendar once approved.
            </p>
            <button
              onClick={onSubmitted}
              className="rounded-full bg-[#4e2a84] px-7 py-3 font-bold text-[#fffdf8]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4.5 px-7 py-6">
            <Field label="Event title" error={fieldErrors.title}>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. UISAC Finance Career Panel"
                maxLength={120}
                aria-invalid={!!fieldErrors.title}
                className="input-style"
              />
            </Field>

            <Field label="Description" error={fieldErrors.copy}>
              <textarea
                rows={3}
                value={form.copy}
                onChange={(e) => set("copy", e.target.value)}
                placeholder="Tell people what to expect…"
                maxLength={600}
                aria-invalid={!!fieldErrors.copy}
                className="input-style resize-none"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Month">
                <select
                  value={form.month}
                  onChange={(e) => set("month", e.target.value)}
                  className="input-style"
                >
                  {MONTHS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </Field>

              <Field label="Day" error={fieldErrors.day}>
                <input
                  type="number"
                  min={1}
                  max={DAYS_IN_MONTH[form.month] ?? 31}
                  value={form.day}
                  onChange={(e) => set("day", e.target.value)}
                  placeholder="e.g. 26"
                  aria-invalid={!!fieldErrors.day}
                  className="input-style"
                />
              </Field>
            </div>

            <Field label="Time" error={fieldErrors.time}>
              <input
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                placeholder="e.g. 3:00 PM – 5:30 PM"
                aria-invalid={!!fieldErrors.time}
                className="input-style"
              />
            </Field>

            <Field label="Location" error={fieldErrors.place}>
              <LocationField
                value={form.place}
                onChange={(v) => set("place", v)}
                error={!!fieldErrors.place}
              />
            </Field>

            <Field label="Event type">
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className="input-style"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>

            {error && (
              <p className="rounded-2xl border-[1.5px] border-[#e3b3ab] bg-[#fdece5] px-4 py-3 text-sm text-[#b0402a]">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border-[1.5px] border-border bg-transparent py-3 font-bold text-foreground transition hover:bg-foreground/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-full bg-[#4e2a84] py-3 font-bold text-[#fffdf8] transition hover:bg-[#3f216d] disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit for approval"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function LocationField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return CAMPUS_LOCATIONS.slice(0, 6);
    return CAMPUS_LOCATIONS.filter((loc) =>
      loc.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [value]);

  function selectMatch(loc: string) {
    onChange(loc);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => (i - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectMatch(matches[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlighted(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // let a click on a suggestion register before the list closes
          closeTimeout.current = setTimeout(() => setOpen(false), 120);
        }}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Norris University Center"
        aria-invalid={error}
        aria-expanded={open && matches.length > 0}
        aria-autocomplete="list"
        role="combobox"
        autoComplete="off"
        className="input-style"
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-2xl border-[1.5px] border-border bg-card shadow-[var(--shadow-lift)]">
          {matches.map((loc, i) => (
            <li key={loc}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (closeTimeout.current) clearTimeout(closeTimeout.current);
                  selectMatch(loc);
                }}
                className={`block w-full px-4 py-2.5 text-left text-[15px] transition ${
                  i === highlighted
                    ? "bg-[#4e2a84]/10 text-[#3f216d]"
                    : "text-foreground hover:bg-foreground/5"
                }`}
              >
                {loc}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-foreground">{label}</label>
      {children}
      {error && (
        <p className="text-[13px] font-medium text-[#b0402a]">{error}</p>
      )}
    </div>
  );
}
