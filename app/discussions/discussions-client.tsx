"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, MessageCircle, Search, Plus } from "lucide-react";

const CARD_TAPE = ["bg-[#f6b93b]/70", "bg-[#ff7a5c]/70", "bg-[#4fb2c4]/70"];
import {
  createQuestion,
  createReply,
  adjustUpvote,
  type DbQuestion,
  type DbReply,
} from "./actions";
import { useAuth } from "../components/auth-provider";

// ─── localStorage: track which question IDs this browser has upvoted ──────────

const UPVOTE_KEY = "uisac_upvoted_questions";

function loadUpvotedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(UPVOTE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveUpvotedIds(ids: Set<string>): void {
  try {
    localStorage.setItem(UPVOTE_KEY, JSON.stringify([...ids]));
  } catch {}
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Question = DbQuestion & { upvoted: boolean };
type SortMode = "newest" | "most-replied";

function withUpvoted(q: DbQuestion, ids: Set<string>): Question {
  return { ...q, upvoted: ids.has(q.id) };
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DiscussionsClient({
  initialQuestions,
}: {
  initialQuestions: DbQuestion[];
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");
  const [showAskModal, setShowAskModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [askText, setAskText] = useState("");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const { session } = useAuth();
  const router = useRouter();

  // Merge initial questions with localStorage upvote state on mount
  useEffect(() => {
    const ids = loadUpvotedIds();
    setQuestions(initialQuestions.map((q) => withUpvoted(q, ids)));
  }, [initialQuestions]);

  const filtered = questions
    .filter((q) => q.text.toLowerCase().includes(search.toLowerCase()))
    .sort(
      sort === "newest"
        ? (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : (a, b) => b.replies.length - a.replies.length,
    );

  function submitQuestion() {
    const text = askText.trim();
    if (!text || !session) return;
    const accessToken = session.access_token;

    // Optimistic update
    const optimistic: Question = {
      id: `optimistic-${Date.now()}`,
      text,
      upvotes: 0,
      upvoted: false,
      created_at: new Date().toISOString(),
      replies: [],
    };
    setQuestions((prev) => [optimistic, ...prev]);
    setAskText("");
    setShowAskModal(false);

    startTransition(async () => {
      try {
        const saved = await createQuestion(text, accessToken);
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === optimistic.id ? { ...saved, upvoted: false } : q,
          ),
        );
      } catch {
        // Revert on failure
        setQuestions((prev) => prev.filter((q) => q.id !== optimistic.id));
      }
    });
  }

  function toggleUpvote(id: string) {
    const q = questions.find((q) => q.id === id);
    if (!q) return;
    const delta = q.upvoted ? -1 : (1 as const);

    // Optimistic update + localStorage
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, upvotes: q.upvotes + delta, upvoted: !q.upvoted }
          : q,
      ),
    );

    const ids = loadUpvotedIds();
    if (delta === 1) ids.add(id);
    else ids.delete(id);
    saveUpvotedIds(ids);

    // Skip DB update for optimistic-only items not yet saved
    if (id.startsWith("optimistic-")) return;

    startTransition(async () => {
      try {
        await adjustUpvote(id, delta);
      } catch {
        // Revert
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === id
              ? { ...q, upvotes: q.upvotes - delta, upvoted: !q.upvoted }
              : q,
          ),
        );
        const ids = loadUpvotedIds();
        if (delta === 1) ids.delete(id);
        else ids.add(id);
        saveUpvotedIds(ids);
      }
    });
  }

  function submitReply(questionId: string) {
    const text = (replyTexts[questionId] ?? "").trim();
    if (!text || !session) return;
    const accessToken = session.access_token;

    const optimistic: DbReply = {
      id: `optimistic-${Date.now()}`,
      question_id: questionId,
      text,
      created_at: new Date().toISOString(),
    };

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, replies: [...q.replies, optimistic] }
          : q,
      ),
    );
    setReplyTexts((prev) => ({ ...prev, [questionId]: "" }));

    if (questionId.startsWith("optimistic-")) return;

    startTransition(async () => {
      try {
        const saved = await createReply(questionId, text, accessToken);
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  replies: q.replies.map((r) =>
                    r.id === optimistic.id ? saved : r,
                  ),
                }
              : q,
          ),
        );
      } catch {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? { ...q, replies: q.replies.filter((r) => r.id !== optimistic.id) }
              : q,
          ),
        );
      }
    });
  }

  function openAskModal() {
    if (!session) {
      router.push("/auth");
      return;
    }
    setShowAskModal(true);
  }

  return (
    <>
      <section className="relative overflow-hidden px-4 pt-16 pb-10 text-center lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-8rem] left-1/2 h-100 w-150 -translate-x-1/2 opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, #eaf6f8 0%, #f4eefa 55%, transparent 78%)",
          }}
        />
        <h1 className="relative mb-4 text-[2.6rem] font-extrabold tracking-tight text-foreground">
          Discussions
        </h1>
        <p className="relative mb-8 text-lg leading-relaxed text-foreground/72">
          Ask anything, share experiences — completely anonymous. No
          usernames, no judgment.
        </p>
        {session ? (
          <button
            onClick={openAskModal}
            className="relative inline-flex items-center gap-1.5 rounded-full bg-[#4e2a84] px-7.5 py-3.5 text-base font-bold text-[#fffdf8] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <Plus size={18} strokeWidth={2.5} />
            Ask anonymously
          </button>
        ) : (
          <div className="relative inline-flex flex-wrap items-center gap-3.5 rounded-full bg-[#f1e8d8] px-5.5 py-3">
            <span className="text-sm text-foreground/72">
              Sign in with your Northwestern account to post a question.
            </span>
            <a href="/auth" className="whitespace-nowrap text-sm font-bold no-underline">
              Sign in →
            </a>
          </div>
        )}
      </section>

      <div className="mx-auto flex max-w-225 flex-wrap gap-3 px-4">
        <div className="relative min-w-55 flex-1">
          <Search
            size={17}
            strokeWidth={2.25}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-foreground/40"
          />
          <input
            type="text"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-style pl-11"
          />
        </div>
        <div className="flex shrink-0 gap-1 rounded-full bg-secondary p-1">
          {(["newest", "most-replied"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={[
                "rounded-full px-4.5 py-2.5 text-sm font-bold transition",
                sort === s
                  ? "bg-[#4e2a84] text-[#fffdf8]"
                  : "bg-transparent text-foreground/70 hover:text-foreground",
              ].join(" ")}
            >
              {s === "newest" ? "Newest" : "Most replied"}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-225 px-4 py-8 pb-24">
        {filtered.length === 0 && (
          <EmptyState search={search} onAsk={openAskModal} signedIn={!!session} />
        )}

        <div className="flex flex-col gap-4">
          {filtered.map((q, i) => (
            <QuestionCard
              key={q.id}
              tape={CARD_TAPE[i % CARD_TAPE.length]}
              rotate={i % 2 === 0 ? "-rotate-[0.6deg]" : "rotate-[0.6deg]"}
              question={q}
              expanded={expandedId === q.id}
              onToggleExpand={() =>
                setExpandedId(expandedId === q.id ? null : q.id)
              }
              onToggleUpvote={() => toggleUpvote(q.id)}
              replyText={replyTexts[q.id] ?? ""}
              onReplyTextChange={(v) =>
                setReplyTexts((prev) => ({ ...prev, [q.id]: v }))
              }
              onSubmitReply={() => submitReply(q.id)}
              isPending={isPending}
              canPost={!!session}
            />
          ))}
        </div>
      </section>

      {/* Ask Modal */}
      {showAskModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#241b2e]/20 p-4 backdrop-blur-sm"
          onClick={(e) =>
            e.target === e.currentTarget && setShowAskModal(false)
          }
        >
          <div className="w-full max-w-130 rounded-[2rem] bg-card p-7 shadow-[var(--shadow-lift)]">
            <h2 className="mb-1 text-xl font-extrabold text-foreground">
              Ask anonymously
            </h2>
            <p className="mb-4.5 text-[13px] text-foreground/55">
              No name attached, ever.
            </p>
            <textarea
              autoFocus
              placeholder="What's on your mind? Ask anything about student life, visas, academics…"
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                  submitQuestion();
              }}
              rows={4}
              className="input-style resize-y"
            />
            <div className="mt-4.5 flex gap-3">
              <button
                onClick={() => {
                  setShowAskModal(false);
                  setAskText("");
                }}
                className="flex-1 rounded-full border-[1.5px] border-border bg-transparent py-3 font-bold text-foreground transition hover:bg-foreground/5"
              >
                Cancel
              </button>
              <button
                onClick={submitQuestion}
                disabled={!askText.trim()}
                className="flex-1 rounded-full bg-[#4e2a84] py-3 font-bold text-[#fffdf8] transition hover:bg-[#3f216d] disabled:opacity-40"
              >
                Post question
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── QuestionCard ─────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  expanded,
  onToggleExpand,
  onToggleUpvote,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  isPending,
  canPost,
  tape,
  rotate,
}: {
  question: Question;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleUpvote: () => void;
  replyText: string;
  onReplyTextChange: (v: string) => void;
  onSubmitReply: () => void;
  isPending: boolean;
  canPost: boolean;
  tape: string;
  rotate: string;
}) {
  return (
    <div className={`relative ${rotate}`}>
      <span
        aria-hidden="true"
        className={`tape absolute -top-3 left-10 rotate-[-4deg] ${tape}`}
      />
      <article className="rounded-[1.75rem] bg-card p-6 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-lift)]">
        <div className="flex gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleUpvote();
            }}
            disabled={isPending}
            className={[
              "flex h-14 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl text-sm font-extrabold transition",
              question.upvoted
                ? "bg-[#4e2a84] text-[#fffdf8]"
                : "bg-[#f4eefa] text-[#3f216d] hover:bg-[#e6dcf2]",
            ].join(" ")}
          >
            <ChevronUp size={16} strokeWidth={2.5} />
            {question.upvotes > 0 ? question.upvotes : ""}
          </button>

          <button className="block flex-1 text-left" onClick={onToggleExpand}>
            <p className="text-[17px] font-bold leading-snug text-foreground">
              {question.text}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-foreground/55">
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle size={14} strokeWidth={2.25} />
                {question.replies.length}{" "}
                {question.replies.length === 1 ? "reply" : "replies"}
              </span>
              <span>{formatTime(question.created_at)}</span>
              <span className="ml-auto font-bold text-[#4e2a84]">
                {expanded ? "hide replies" : "show replies"}
              </span>
            </div>
          </button>
        </div>

        {expanded && (
          <div className="mt-5 border-t border-divider-thin pt-5 pl-16">
            {question.replies.length === 0 ? (
              <p className="mb-4 text-sm text-foreground/55 italic">
                No replies yet — be the first to respond.
              </p>
            ) : (
              <div className="mb-3 flex flex-col gap-2.5">
                {question.replies.map((r) => (
                  <div key={r.id} className="rounded-2xl bg-secondary px-4 py-3.5">
                    <p className="text-sm leading-relaxed">{r.text}</p>
                    <p className="mt-1.5 text-xs text-foreground/55">
                      {formatTime(r.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {canPost ? (
              <div className="mt-2 flex gap-2.5">
                <input
                  type="text"
                  placeholder="Reply anonymously…"
                  value={replyText}
                  onChange={(e) => onReplyTextChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSubmitReply()}
                  className="input-style flex-1 py-2.5"
                />
                <button
                  onClick={onSubmitReply}
                  disabled={!replyText.trim() || isPending}
                  className="shrink-0 rounded-full bg-[#4e2a84] px-5.5 text-sm font-bold text-[#fffdf8] transition hover:bg-[#3f216d] disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            ) : (
              <div className="mt-2 flex flex-wrap items-center gap-3 rounded-2xl bg-secondary px-4 py-3">
                <span className="text-[13px] text-foreground/72">
                  Sign in to reply anonymously.
                </span>
                <a href="/auth" className="text-[13px] font-bold no-underline">
                  Sign in →
                </a>
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({
  search,
  onAsk,
  signedIn,
}: {
  search: string;
  onAsk: () => void;
  signedIn: boolean;
}) {
  return (
    <div className="rounded-[2rem] bg-[#f4eefa] px-6 py-20 text-center shadow-[var(--shadow-soft)]">
      <p className="mb-2.5 text-lg font-extrabold text-foreground">
        {search ? `No questions match "${search}"` : "No questions yet"}
      </p>
      <p className="mb-6 text-[15px] text-foreground/65">
        {search
          ? "Try a different search, or be the first to ask it."
          : "Be the first to start a discussion."}
      </p>
      {signedIn && (
        <button
          onClick={onAsk}
          className="rounded-full bg-[#4e2a84] px-6 py-3.5 text-[15px] font-bold text-[#fffdf8]"
        >
          Ask the first question
        </button>
      )}
    </div>
  );
}
