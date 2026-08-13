"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../components/auth-provider";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const EVENT_TYPES = ["Social", "Academic", "Cultural", "Workshop", "Networking", "Other"];

type Props = {
  onClose: () => void;
  onSubmitted: () => void;
};

export default function SubmitEventModal({ onClose, onSubmitted }: Props) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    copy: "",
    month: "January",
    day: "",
    time: "",
    place: "",
    type: "Social",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5 px-7 py-6">
            <Field label="Event title">
              <input
                required
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. UISAC Finance Career Panel"
                className="input-style"
              />
            </Field>

            <Field label="Description">
              <textarea
                required
                rows={3}
                value={form.copy}
                onChange={(e) => set("copy", e.target.value)}
                placeholder="Tell people what to expect…"
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

              <Field label="Day">
                <input
                  required
                  type="number"
                  min={1}
                  max={31}
                  value={form.day}
                  onChange={(e) => set("day", e.target.value)}
                  placeholder="e.g. 26"
                  className="input-style"
                />
              </Field>
            </div>

            <Field label="Time">
              <input
                required
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                placeholder="e.g. 3:00 PM – 5:30 PM"
                className="input-style"
              />
            </Field>

            <Field label="Location">
              <input
                required
                value={form.place}
                onChange={(e) => set("place", e.target.value)}
                placeholder="e.g. Norris University Center"
                className="input-style"
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-foreground">{label}</label>
      {children}
    </div>
  );
}
