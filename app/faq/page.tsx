import { GraduationCap, Compass, Home, Plus, Minus } from "lucide-react";
import type { ReactNode } from "react";

type FaqItem = { q: string; a: ReactNode };
type FaqSection = {
  key: string;
  title: string;
  icon: typeof GraduationCap;
  iconBg: string;
  iconColor: string;
  tape: string;
  items: FaqItem[];
};

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-[#4e2a84] underline decoration-[#4e2a84]/30 underline-offset-2 transition hover:decoration-[#4e2a84]"
    >
      {children}
    </a>
  );
}

const sections: FaqSection[] = [
  {
    key: "academics",
    title: "Classes and academic support",
    icon: GraduationCap,
    iconBg: "bg-[#4e2a84]",
    iconColor: "text-[#fffdf8]",
    tape: "bg-[#f6b93b]/70",
    items: [
      {
        q: "How do I choose and register for classes?",
        a: (
          <ul className="ml-4.5 list-disc space-y-2">
            <li>
              Meet with your advisor and talk through everything you&apos;re
              interested in. If your interests reach outside your major, ask to
              be pointed to an advisor in that school too.
            </li>
            <li>
              Learn how CAESAR works before registration opens. Filters, the
              shopping cart, and waitlists all take a few tries to get used to.
            </li>
            <li>
              Browse{" "}
              <Ext href="https://class-descriptions.northwestern.edu/">
                class descriptions
              </Ext>{" "}
              and save everything that catches your eye.
            </li>
            <li>
              Lay out your schedule with <Ext href="https://www.paper.nu/">Paper</Ext>{" "}
              before you register.
            </li>
            <li>
              If a course is full, email the professor anyway and ask to join.
              A short note about why you want the class goes a long way.
            </li>
          </ul>
        ),
      },
      {
        q: "What support resources do people forget about?",
        a: (
          <ul className="ml-4.5 list-disc space-y-2">
            <li>
              <Ext href="https://buffett.northwestern.edu/programs/undergraduate-opportunities/atlas-peer-mentorship-program/">
                Atlas peer mentorship
              </Ext>{" "}
              pairs international students with a mentor. Applications open in
              the first weeks of fall, so don&apos;t miss the window.
            </li>
            <li>
              <strong className="text-foreground">
                Academic Support and Learning Advancement (ASLA)
              </strong>{" "}
              runs peer-led study groups and drop-in peer tutoring.
            </li>
            <li>
              <strong className="text-foreground">The Writing Place</strong>{" "}
              offers peer consultations on class assignments and any other
              writing. Genuinely useful for proofreading and feedback.
            </li>
            <li>
              The Norris website lists every center for arts, crafts, and
              games.
            </li>
          </ul>
        ),
      },
      {
        q: "How do I access library resources?",
        a: (
          <p>
            Log in with your NetID, pick the resource, and choose how you want
            to borrow it. Keep an eye on the return deadline. You can almost
            always extend a loan, which saves you the late charges.
          </p>
        ),
      },
    ],
  },
  {
    key: "campus-life",
    title: "Getting around and finding things to do",
    icon: Compass,
    iconBg: "bg-[#4fb2c4]",
    iconColor: "text-[#062b30]",
    tape: "bg-[#ff7a5c]/70",
    items: [
      {
        q: "How do I get around campus?",
        a: (
          <ul className="ml-4.5 list-disc space-y-2">
            <li>
              <strong className="text-foreground">NU Transit</strong> for Safe
              Ride, the free campus taxi.
            </li>
            <li>
              <strong className="text-foreground">TripShot</strong> for shuttle
              schedules. The Loop route covers the Evanston campus; the
              Intercampus route stops across campus and continues to the
              Chicago campus.
            </li>
            <li>
              Keep a map open for the first couple of weeks. Campus gets
              familiar faster than you&apos;d think.
            </li>
          </ul>
        ),
      },
      {
        q: "Where are the good study and hangout spots?",
        a: (
          <p>
            The Multicultural Center is the one people rave about. Also worth
            knowing: the Black House (open to everyone), the Buffett Institute
            for Global Affairs, the third floor of Norris, and the Kresge media
            center.
          </p>
        ),
      },
      {
        q: "How do I find something to do?",
        a: (
          <ul className="ml-4.5 list-disc space-y-2">
            <li>Eventbrite covers events across Chicago, Evanston, and campus.</li>
            <li>The Buffett Institute website for global-affairs programming.</li>
            <li>
              The <em>Downtown Evanston</em> newspaper for what&apos;s on
              locally.
            </li>
            <li>Fizz and CatsOnCampus for campus events and socials.</li>
          </ul>
        ),
      },
      {
        q: "What can I do over Thanksgiving or spring break?",
        a: (
          <ul className="ml-4.5 list-disc space-y-2">
            <li>
              <Ext href="https://www.northwestern.edu/lead-engage/community-engagement/alternative-spring-break.html">
                Alternative Spring Break
              </Ext>{" "}
              is fully sponsored volunteering in Chicago.
            </li>
            <li>
              Look for volunteering opportunities that include accommodation.
            </li>
            <li>
              If you&apos;re travelling, Frontier&apos;s 6-month and annual
              flight passes can cut costs. The catch is you can only book one
              to two days ahead.
            </li>
            <li>Check what your own ethnic communities are organising, too.</li>
          </ul>
        ),
      },
    ],
  },
  {
    key: "housing-work",
    title: "Housing and working on campus",
    icon: Home,
    iconBg: "bg-[#ff7a5c]",
    iconColor: "text-[#3d1408]",
    tape: "bg-[#4fb2c4]/70",
    items: [
      {
        q: "How do I find subletting, summer housing, or furniture?",
        a: (
          <ul className="ml-4.5 list-disc space-y-2">
            <li>Facebook groups for Chicago and Evanston, plus Marketplace.</li>
            <li>GroupMe, where people advertise rooms and furniture constantly.</li>
            <li>The Fizz marketplace and feed.</li>
            <li>
              The IFA @ Northwestern group chat for international students.
            </li>
          </ul>
        ),
      },
      {
        q: "How do I get a job on campus?",
        a: (
          <ul className="ml-4.5 list-disc space-y-2">
            <li>
              Start with the{" "}
              <Ext href="https://www.northwestern.edu/student-employment/">
                student employment job board
              </Ext>
              .
            </li>
            <li>
              Ask upperclassmen when and where hiring actually happens. Timing
              matters more than the posting.
            </li>
            <li>
              Volunteer at events you genuinely enjoy. When a position opens at
              Block, Norris, the labs, the Observatory, the Multicultural
              Center, or the Gender and Sexuality Center, you already know the
              team.
            </li>
          </ul>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div>
      <section className="px-5 pt-18 pb-4 text-center lg:px-8">
        <h1 className="font-display mx-auto mb-5 max-w-225 text-[2.2rem] font-bold tracking-tight text-foreground sm:text-[2.7rem]">
          Things nobody tells you
        </h1>
        <p className="mx-auto max-w-[60ch] text-lg leading-relaxed text-foreground/72">
          The advice international students usually pick up halfway through
          their first year, collected here so you get it on day one.
        </p>
      </section>

      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <section
            key={section.key}
            className="mx-auto max-w-250 px-5 py-10 lg:px-8"
          >
            <div className="mb-6 flex items-center gap-3.5">
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${section.iconBg} ${section.iconColor}`}
              >
                <Icon size={20} strokeWidth={2.25} />
              </span>
              <h2 className="font-display text-[1.5rem] font-bold text-foreground sm:text-[1.8rem]">
                {section.title}
              </h2>
            </div>

            <div className="relative">
              <span
                aria-hidden="true"
                className={`tape absolute -top-3 left-10 ${section.tape}`}
              />
              <div className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl bg-card px-5 py-4.5 shadow-[var(--shadow-soft)] [&>summary]:cursor-pointer [&>summary]:list-none [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex justify-between gap-4 text-base font-bold text-foreground">
                      {item.q}
                      <span className="grid h-6 w-6 shrink-0 place-items-center text-[#4e2a84]">
                        <Plus
                          aria-hidden="true"
                          size={20}
                          strokeWidth={2.5}
                          className="group-open:hidden"
                        />
                        <Minus
                          aria-hidden="true"
                          size={20}
                          strokeWidth={2.5}
                          className="hidden group-open:block"
                        />
                      </span>
                    </summary>
                    <div className="mt-3 text-[15px] leading-relaxed text-foreground/75">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="px-5 pt-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-250 rounded-[1.75rem] bg-[#f4eefa] px-7 py-9 text-center shadow-[var(--shadow-soft)]">
          <h2 className="font-display mb-2.5 text-xl font-bold text-foreground">
            Still stuck on something?
          </h2>
          <p className="mx-auto mb-6 max-w-[52ch] text-[15px] leading-relaxed text-foreground/72">
            Ask it anonymously in Discussions. No name attached, and someone
            who has been through it will usually know.
          </p>
          <a
            href="/discussions"
            className="inline-block rounded-full bg-[#4e2a84] px-7 py-3.5 text-[15px] font-bold text-[#fffdf8] no-underline shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-[#3f216d] hover:shadow-[var(--shadow-lift)]"
          >
            Ask a question
          </a>
        </div>
      </section>
    </div>
  );
}
