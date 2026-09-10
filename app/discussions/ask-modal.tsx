"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function AskModal({ value, onChange, onClose, onSubmit }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#241b2e]/20 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-130 rounded-[2rem] bg-card p-7 shadow-[var(--shadow-lift)]">
        <h2 className="font-display mb-1 text-xl font-bold text-foreground">
          Ask anonymously
        </h2>
        <p className="mb-4.5 text-[13px] text-foreground/55">
          No name attached, ever.
        </p>
        <textarea
          autoFocus
          placeholder="What's on your mind? Ask anything about student life, visas, academics…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit();
          }}
          rows={4}
          className="input-style resize-y"
        />
        <div className="mt-4.5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border-[1.5px] border-border bg-transparent py-3 font-bold text-foreground transition hover:bg-foreground/5"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!value.trim()}
            className="flex-1 rounded-full bg-[#4e2a84] py-3 font-bold text-[#fffdf8] transition hover:bg-[#3f216d] disabled:opacity-40"
          >
            Post question
          </button>
        </div>
      </div>
    </div>
  );
}
