export default function CalendarLoading() {
  return (
    <section className="mx-auto max-w-300 animate-pulse px-5 py-14 lg:px-8">
      <div className="mb-10">
        <div className="mb-3 h-11 w-70 rounded-full bg-secondary" />
        <div className="h-5 w-90 rounded-full bg-secondary" />
      </div>
      <div className="flex flex-col gap-5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="grid grid-cols-1 items-start gap-6 rounded-[1.75rem] bg-card p-6 shadow-[var(--shadow-soft)] sm:grid-cols-[100px_1fr_auto]"
          >
            <div className="h-20 rounded-2xl bg-secondary" />
            <div>
              <div className="mb-3 h-6 w-60 rounded-full bg-secondary" />
              <div className="mb-4 h-4 w-full max-w-100 rounded-full bg-secondary" />
              <div className="h-4 w-50 rounded-full bg-secondary" />
            </div>
            <div className="h-7 w-20 rounded-full bg-secondary" />
          </div>
        ))}
      </div>
    </section>
  );
}
