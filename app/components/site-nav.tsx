"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/calendar", label: "Calendar" },
  { href: "/tax-filing", label: "Tax Filing" },
  { href: "/discussions", label: "Discussions" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdminUser, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b-2 border-divider bg-card/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-350 items-center justify-between gap-5 px-5 py-3 lg:px-8">
        <Link
          className="flex shrink-0 items-center gap-2.5"
          href="/"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="grid h-10 w-10 shrink-0 overflow-hidden rounded-full bg-accent ring-2 ring-[#4e2a84]/15">
            <img
              src="/images/logo.jpg"
              alt="UISAC logo"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="text-[22px] font-extrabold tracking-tight text-foreground">
            UISAC
          </span>
        </Link>

        <button
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="flex shrink-0 flex-col gap-1.5 rounded-full border-[1.5px] border-border p-3 lg:hidden"
        >
          <span className="h-0.5 w-5 rounded-full bg-foreground" />
          <span className="h-0.5 w-5 rounded-full bg-foreground" />
          <span className="h-0.5 w-5 rounded-full bg-foreground" />
        </button>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
        >
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-full px-4.5 py-2.5 text-[15px] font-bold no-underline transition",
                  active
                    ? "bg-[#4e2a84] text-[#fffdf8]"
                    : "text-foreground/70 hover:bg-[#4e2a84]/8 hover:text-[#4e2a84]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {!loading && (
            <>
              {user ? (
                <>
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      className="rounded-full border border-[#d2c1e6] bg-[#f4eefa] px-4 py-2 text-sm font-bold text-[#3f216d] no-underline transition hover:bg-[#e6dcf2]"
                    >
                      Admin
                    </Link>
                  )}
                  <span className="max-w-45 truncate text-sm text-foreground/62">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="rounded-full border-[1.5px] border-border px-4.5 py-2.5 text-sm font-bold text-foreground transition hover:bg-foreground/5"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="rounded-full bg-[#4e2a84] px-5.5 py-2.5 text-sm font-bold text-[#fffdf8] no-underline shadow-[var(--shadow-soft)] transition hover:bg-[#3f216d]"
                >
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Primary mobile"
          className="flex flex-col border-t-2 border-divider px-6 pb-6 pt-2 lg:hidden"
        >
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={[
                  "mt-2 rounded-2xl px-4 py-3.5 text-base font-bold no-underline",
                  active
                    ? "bg-[#4e2a84] text-[#fffdf8]"
                    : "text-foreground hover:bg-[#4e2a84]/8",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
          {!loading && (
            <>
              {user ? (
                <>
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mt-2 rounded-2xl px-4 py-3 font-bold text-[#4e2a84] no-underline"
                    >
                      Admin
                    </Link>
                  )}
                  <p className="px-4 py-2 text-sm text-foreground/62">
                    {user.email}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="mt-2 rounded-2xl border-[1.5px] border-border p-3.5 text-sm font-bold text-foreground"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-3 rounded-2xl bg-[#4e2a84] p-4 text-center text-sm font-bold text-[#fffdf8] no-underline"
                >
                  Sign In
                </Link>
              )}
            </>
          )}
        </nav>
      )}
    </header>
  );
}
