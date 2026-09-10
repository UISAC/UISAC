export default function DiscussionsLoading() {
  return (
    <div className="animate-pulse">
      <section className="px-4 pt-16 pb-10 text-center">
        <div className="mx-auto mb-4 h-11 w-60 rounded-full bg-secondary" />
        <div className="mx-auto mb-8 h-5 w-100 max-w-full rounded-full bg-secondary" />
        <div className="mx-auto h-13 w-45 rounded-full bg-secondary" />
      </section>
      <div className="mx-auto flex max-w-225 flex-wrap gap-3 px-4">
        <div className="h-13 min-w-55 flex-1 rounded-2xl bg-secondary" />
        <div className="h-13 w-45 shrink-0 rounded-full bg-secondary" />
      </div>
      <section className="mx-auto max-w-225 px-4 py-8 pb-24">
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[1.75rem] bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex gap-4">
                <div className="h-14 w-12 shrink-0 rounded-2xl bg-secondary" />
                <div className="flex-1">
                  <div className="mb-3 h-5 w-full max-w-110 rounded-full bg-secondary" />
                  <div className="h-4 w-40 rounded-full bg-secondary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
