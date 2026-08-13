// Add admin email addresses here.
// Also update the is_admin() SQL function in your Supabase dashboard (see setup instructions).
export const ADMIN_EMAILS: string[] = [
  "harutsargsyan2027@u.northwestern.edu",
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(
    email.toLowerCase(),
  );
}

// Mirrors is_northwestern() in supabase/002_discussions_and_domain_restriction.sql
// and the hook_restrict_signup_by_email_domain() Auth Hook — keep in sync.
const NORTHWESTERN_EMAIL_SUFFIX = "@u.northwestern.edu";

export function isNorthwestern(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith(NORTHWESTERN_EMAIL_SUFFIX);
}
