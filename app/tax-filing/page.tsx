import { Info, ArrowRight, Plus } from "lucide-react";

const STEP_TAPE = [
  "bg-[#4e2a84]/50",
  "bg-[#f6b93b]/80",
  "bg-[#ff7a5c]/80",
  "bg-[#4fb2c4]/80",
];

const steps = [
  {
    n: "1",
    title: "Figure out your residency status",
    desc: 'Most F-1 and J-1 students are "nonresident aliens" for tax purposes for their first 5 calendar years in the U.S. This determines which forms you file.',
  },
  {
    n: "2",
    title: "Gather your documents",
    desc: "Collect your passport, I-20 or DS-2019, Social Security or ITIN number, and any income statements (W-2, 1042-S) your employer or university sent you.",
  },
  {
    n: "3",
    title: "File Form 8843, always",
    desc: "Every F-1/J-1 student and their dependents must file Form 8843, even with zero U.S. income. If you also had income, you'll file Form 1040-NR alongside it.",
  },
  {
    n: "4",
    title: "Submit before the deadline",
    desc: "File electronically or by mail before the deadline that applies to you. Keep a copy of everything you send for your records.",
  },
];

const deadlines = [
  { date: "Apr 15", desc: "Deadline to file a federal tax return if you earned U.S. income." },
  { date: "Jun 15", desc: "Deadline to file Form 8843 if you had no U.S. income." },
  { date: "Year-round", desc: "Your university's international office can point you to filing software discounts." },
];

const forms = [
  { name: "Form 8843", desc: "A statement, not a tax return, required for all F-1/J-1 students regardless of income." },
  { name: "Form 1040-NR", desc: "The federal income tax return for nonresident aliens who earned U.S. income." },
  { name: "W-2", desc: "Sent by an on-campus or authorized employer, summarizing wages and tax withheld." },
  { name: "Form 1042-S", desc: "Sent if you received a scholarship, fellowship, or treaty-exempt income." },
];

const faqs = [
  {
    q: "Do I still need to file if I had no income at all?",
    a: "Yes. Form 8843 is required for every F-1/J-1 student and their dependents, even with zero U.S. income, by June 15.",
  },
  {
    q: "Am I a resident or nonresident for tax purposes?",
    a: "Most international students are nonresidents for their first 5 calendar years on an F-1 or J-1 visa. This is different from your immigration status.",
  },
  {
    q: "Can I use regular tax software like TurboTax?",
    a: "Not usually. Most consumer tax software is built for residents. Look for a nonresident-specific tool, or check if your school offers one for free.",
  },
  {
    q: "What happens if I miss the deadline?",
    a: "File as soon as you can. Filing late is far better than not filing, and having no U.S. income means there's usually no penalty for Form 8843 alone.",
  },
];

const resources = [
  { title: "IRS: Taxation of nonresident aliens", href: "#" },
  { title: "Sprintax nonresident tax filing tool", href: "#" },
  { title: "Contact your international student office", href: "#" },
];

export default function TaxFilingPage() {
  return (
    <div>
      <section className="px-5 pt-18 pb-0 text-center lg:px-8">
        <h1 className="mx-auto mb-5 max-w-225 text-[2.6rem] font-extrabold tracking-tight text-foreground">
          Tax filing resources
        </h1>
        <p className="text-lg leading-relaxed text-foreground/72">
          Understanding U.S. taxes as an international student can be
          confusing, especially the first time. Here&apos;s a calm,
          step-by-step overview to help you get it done.
        </p>
      </section>

      <section className="mx-auto max-w-250 px-5 pt-10">
        <div className="relative -rotate-1">
          <span
            aria-hidden="true"
            className="tape absolute -top-3 left-12 rotate-[-6deg] bg-[#f6b93b]/80"
          />
          <div className="flex gap-4.5 rounded-[1.75rem] bg-[#f4eefa] px-7 py-6 shadow-[var(--shadow-soft)]">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#4e2a84] text-[#fffdf8]">
              <Info size={20} strokeWidth={2.25} />
            </span>
            <div>
              <h2 className="mb-1.5 text-[17px] font-extrabold text-foreground">
                Disclaimer
              </h2>
              <p className="text-[15px] leading-relaxed text-foreground/75">
                UISAC provides general information only. We are not tax
                professionals or attorneys. Please consult a qualified tax
                advisor for your specific situation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-250 px-5 py-16">
        <h2 className="mb-9 text-[1.75rem] font-extrabold text-foreground">
          Filing in four steps
        </h2>
        <div className="flex flex-col gap-7">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`relative ${i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
            >
              <span
                aria-hidden="true"
                className={`tape absolute -top-3 left-10 ${
                  i % 2 === 0 ? "rotate-[-5deg]" : "rotate-[5deg]"
                } ${STEP_TAPE[i]}`}
              />
              <div className="grid grid-cols-[56px_1fr] gap-5 rounded-[1.5rem] bg-card p-5 shadow-[var(--shadow-soft)]">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#4e2a84] text-xl font-extrabold text-[#fffdf8]">
                  {s.n}
                </span>
                <div>
                  <h3 className="mb-1.5 text-lg font-bold text-foreground">
                    {s.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-foreground/72">
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-300 grid-cols-1 gap-8 px-5 py-8 md:grid-cols-2">
        <div className="-rotate-1 rounded-[1.75rem] bg-[#fef1de] p-9 shadow-[var(--shadow-soft)]">
          <h2 className="mb-5 text-xl font-extrabold text-foreground">
            Key deadlines
          </h2>
          {deadlines.map((d) => (
            <div
              key={d.date}
              className="flex gap-3.5 border-t border-[#f6b93b]/30 py-3.5 first:border-t-0 first:pt-0"
            >
              <span className="shrink-0 rounded-full bg-[#f6b93b]/25 px-3 py-1 text-xs font-extrabold whitespace-nowrap text-[#7a5309]">
                {d.date}
              </span>
              <span className="text-[15px] leading-snug text-foreground/75">
                {d.desc}
              </span>
            </div>
          ))}
        </div>
        <div className="rotate-1 rounded-[1.75rem] bg-[#eaf6f8] p-9 shadow-[var(--shadow-soft)]">
          <h2 className="mb-5 text-xl font-extrabold text-foreground">
            Common forms, explained
          </h2>
          {forms.map((f) => (
            <div key={f.name} className="border-t border-[#4fb2c4]/25 py-3.5 first:border-t-0 first:pt-0">
              <p className="text-[15px] leading-snug text-foreground/75">
                <strong className="text-foreground">{f.name}:</strong>{" "}
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-225 px-5 py-16">
        <span
          aria-hidden="true"
          className="tape absolute top-11 left-5 rotate-[-4deg] bg-[#4fb2c4]/70"
        />
        <h2 className="relative mb-7 text-[1.75rem] font-extrabold text-foreground">
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-3">
          {faqs.map((q) => (
            <details
              key={q.q}
              className="group rounded-2xl bg-card px-5 py-4.5 shadow-[var(--shadow-soft)] [&>summary]:cursor-pointer [&>summary]:list-none [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex justify-between gap-4 text-base font-bold">
                {q.q}
                <Plus
                  aria-hidden="true"
                  size={20}
                  strokeWidth={2.5}
                  className="shrink-0 text-[#4e2a84] transition group-open:rotate-45"
                />
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/72">
                {q.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="relative mx-auto max-w-225 rotate-1">
          <span
            aria-hidden="true"
            className="tape absolute -top-3 right-12 rotate-[6deg] bg-[#f6b93b]/80"
          />
          <div className="rounded-[1.75rem] bg-[#fef1de] p-8 shadow-[var(--shadow-soft)]">
            <h2 className="mb-5 text-2xl font-extrabold text-foreground">
              More resources
            </h2>
            <div className="flex flex-col gap-3">
              {resources.map((r) => (
                <a
                  key={r.title}
                  href={r.href}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-card px-5 py-4 no-underline shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="text-[15px] font-bold text-foreground">
                    {r.title}
                  </span>
                  <ArrowRight size={18} strokeWidth={2.25} className="text-[#4e2a84]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
