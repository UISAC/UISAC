import { Mail, ClipboardList } from "lucide-react";
import type { ComponentType } from "react";

// lucide dropped brand icons, so the Instagram glyph is inlined here, drawn to
// match lucide's 24px grid and stroke so it sits level with the others.
function InstagramIcon({
  size = 17,
  strokeWidth = 2.25,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

type FooterLink = {
  label: string;
  detail: string;
  href: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  external: boolean;
  iconBg: string;
  iconColor: string;
};

const links: FooterLink[] = [
  {
    label: "Instagram",
    detail: "@uisacnu",
    href: "https://www.instagram.com/uisacnu",
    icon: InstagramIcon,
    external: true,
    iconBg: "bg-[#ff7a5c]",
    iconColor: "text-[#3d1408]",
  },
  {
    label: "Email us",
    detail: "isac@u.northwestern.edu",
    href: "mailto:isac@u.northwestern.edu",
    icon: Mail,
    external: false,
    iconBg: "bg-[#4e2a84]",
    iconColor: "text-[#fffdf8]",
  },
  {
    label: "Contact form",
    detail: "Send us a message",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdI0sxEcWv6zOghdS_Y3E0ocFGB_DHXlU9D9U6qpiJTkyA7gQ/viewform",
    icon: ClipboardList,
    external: true,
    iconBg: "bg-[#4fb2c4]",
    iconColor: "text-[#062b30]",
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-8 border-t-2 border-divider">
      <div className="mx-auto max-w-350 px-5 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="grid h-10 w-10 shrink-0 overflow-hidden rounded-full bg-accent ring-2 ring-[#4e2a84]/15">
                <img
                  src="/images/logo.jpg"
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="font-display text-[23px] font-bold tracking-tight text-foreground">
                UISAC
              </span>
            </div>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-foreground/72">
              The Undergraduate International Students Advancement Council, a
              student-led organization supporting international students at
              Northwestern.
            </p>
          </div>

          <div>
            <h2 className="font-display mb-5 text-lg font-bold text-foreground">
              Get in touch
            </h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="flex h-full items-center gap-3 rounded-2xl border-[1.5px] border-border bg-card px-4 py-3.5 no-underline shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[#4e2a84]/35 hover:shadow-[var(--shadow-lift)]"
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${link.iconBg} ${link.iconColor}`}
                      >
                        <Icon size={17} strokeWidth={2.25} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-foreground">
                          {link.label}
                        </span>
                        <span className="block truncate text-[13px] text-foreground/60">
                          {link.detail}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-divider-thin pt-6 text-[13px] text-foreground/55">
          UISAC, Northwestern University. Built by students, for students.
        </p>
      </div>
    </footer>
  );
}
