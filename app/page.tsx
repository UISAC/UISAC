import Link from "next/link";
import { Megaphone, PartyPopper, Receipt, MessageCircleQuestion } from "lucide-react";

const pillars = [
  {
    title: "Advocacy",
    desc: "We represent international student concerns directly to university administration.",
    cta: "See our mission",
    href: "/about#mission",
    icon: Megaphone,
    tint: "bg-[#f4eefa]",
    iconBg: "bg-[#4e2a84]",
    iconColor: "text-[#fffdf8]",
    deg: "-2deg",
    tape: "bg-[#f6b93b]/70",
  },
  {
    title: "Community events",
    desc: "Socials, cultural nights, and workshops that make campus feel like home.",
    cta: "View calendar",
    href: "/calendar",
    icon: PartyPopper,
    tint: "bg-[#fef1de]",
    iconBg: "bg-[#f6b93b]",
    iconColor: "text-[#3a2705]",
    deg: "1deg",
    tape: "bg-[#4e2a84]/60",
  },
  {
    title: "Tax filing help",
    desc: "Plain-language guidance on U.S. tax forms and deadlines for the first time.",
    cta: "Get guidance",
    href: "/tax-filing",
    icon: Receipt,
    tint: "bg-[#fff0eb]",
    iconBg: "bg-[#ff7a5c]",
    iconColor: "text-[#3d1408]",
    deg: "-1deg",
    tape: "bg-[#4fb2c4]/60",
  },
  {
    title: "Anonymous Q&A",
    desc: "Ask anything about visas, academics, or student life without giving your name.",
    cta: "Ask a question",
    href: "/discussions",
    icon: MessageCircleQuestion,
    tint: "bg-[#eaf6f8]",
    iconBg: "bg-[#4fb2c4]",
    iconColor: "text-[#062b30]",
    deg: "2deg",
    tape: "bg-[#ff7a5c]/60",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto grid max-w-350 grid-cols-1 items-center gap-14 px-5 py-20 md:grid-cols-2 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-32 h-125 w-125 opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #e6dcf2 0%, #f4eefa 55%, transparent 75%)",
            borderRadius: "62% 38% 55% 45% / 45% 55% 45% 55%",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-40 right-0 h-90 w-90 opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #fef1de 0%, transparent 70%)",
            borderRadius: "40% 60% 50% 50% / 55% 45% 55% 45%",
          }}
        />

        <div className="relative">
          <h1 className="mb-6 text-[3.2rem] leading-[1.05] font-extrabold tracking-tight text-foreground md:text-[3.9rem]">
            Empowering international students for success
          </h1>
          <p className="mb-9 max-w-[52ch] text-lg leading-relaxed text-foreground/72">
            We advocate for international student rights, provide essential
            resources, and build a welcoming community for everyone.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/about"
              className="rounded-full bg-[#4e2a84] px-8 py-4 text-base font-bold text-[#fffdf8] no-underline shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-[#3f216d] hover:shadow-[var(--shadow-lift)]"
            >
              Learn More
            </Link>
            <Link
              href="/about#mission"
              className="rounded-full border-2 border-[#4e2a84]/25 px-8 py-4 text-base font-bold text-foreground no-underline transition hover:border-[#4e2a84]/50 hover:bg-[#4e2a84]/5"
            >
              Our Mission
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            className="relative aspect-6/5 -rotate-2 rounded-[2.5rem] border-[3px] border-[#fffdf8] shadow-[var(--shadow-lift)]"
            style={{
              background:
                "repeating-linear-gradient(135deg, #e6dcf2 0px, #e6dcf2 22px, #d2c1e6 22px, #d2c1e6 44px)",
            }}
          >
            <span className="absolute -bottom-4 left-6 rotate-1 rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs text-foreground shadow-[var(--shadow-soft)]">
              PHOTO — students at fall orientation
            </span>
          </div>
          <span
            aria-hidden="true"
            className="tape absolute -top-3 left-14 rotate-[-6deg] bg-[#f6b93b]/80"
          />
          <span
            aria-hidden="true"
            className="tape absolute -top-3 right-14 rotate-[7deg] bg-[#ff7a5c]/80"
          />
        </div>
      </section>

      <section className="relative mx-auto max-w-350 px-5 pt-8 pb-24 lg:px-8">
        <h2 className="mb-14 max-w-[30ch] text-[2rem] font-extrabold text-foreground">
          Four ways UISAC supports you, all year round
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="pin-settle relative"
                style={{
                  "--settle-rot": p.deg,
                  animationDelay: `${i * 90}ms`,
                } as React.CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className={`tape absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg] ${p.tape}`}
                />
                <div
                  className={`${p.tint} relative flex h-full flex-col rounded-[1.75rem] p-7 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]`}
                >
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${p.iconBg} ${p.iconColor}`}
                  >
                    <Icon size={22} strokeWidth={2.25} />
                  </span>
                  <h3 className="mt-5 mb-2 text-lg font-extrabold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mb-5 flex-1 text-[15px] leading-relaxed text-foreground/70">
                    {p.desc}
                  </p>
                  <Link
                    href={p.href}
                    className="text-sm font-bold text-[#4e2a84] no-underline"
                  >
                    {p.cta} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8">
        <div className="mx-auto flex max-w-350 flex-wrap items-center justify-between gap-8 rounded-[2.5rem] bg-[#4e2a84] px-8 py-14 shadow-[var(--shadow-lift)] sm:px-14">
          <h2 className="max-w-[24ch] text-[2rem] font-extrabold tracking-tight text-[#fffdf8]">
            New to campus and figuring it out? You&apos;re not alone.
          </h2>
          <Link
            href="/discussions"
            className="shrink-0 rounded-full bg-[#fffdf8] px-8 py-4 text-base font-bold text-[#4e2a84] no-underline transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Ask a question anonymously
          </Link>
        </div>
      </section>
    </div>
  );
}
