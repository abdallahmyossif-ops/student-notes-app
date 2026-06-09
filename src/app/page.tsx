"use client";

import { useEffect, useState } from "react";

const API = "/api/notes";

function NoteCard({
  note,
  onDelete,
  isOpen,
  onToggle,
}: {
  note: { id: string; title: string; content: string };
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <li className="rounded-2xl border border-indigo-100 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div
        className="flex w-full items-center justify-between gap-4 px-5 py-4"
      >
        <button
          type="button"
          onClick={() => onToggle(note.id)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <svg
            className={`mt-0.5 h-5 w-5 shrink-0 text-indigo-500 transition-transform ${isOpen ? "rotate-90" : ""
              }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span className="text-sm font-medium text-slate-700">{note.title}</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onDelete(note.id)}
          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
        >
          Delete Note
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-indigo-100 bg-indigo-50/30 px-5 py-4">
          <div className="rounded-xl border border-indigo-100 bg-white p-4">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 font-sans">
              {note.content}
            </pre>
          </div>
        </div>
      )}
    </li>
  );
}

export default function HomePage() {
  const [notes, setNotes] = useState<{ id: string; title: string; content: string }[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(API, { cache: "no-store" });
        if (!cancelled && res.ok) {
          const data = await res.json();
          setNotes(data);
        }
      } catch {
        if (!cancelled) setNotes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        const note = await res.json();
        setNotes((prev) => [note, ...prev]);
        setTitle("");
        setContent("");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        setOpenNoteId((current) => (current === id ? null : current));
      }
    } catch {
      // ignore
    }
  };

  const toggleNote = (id: string) => {
    setOpenNoteId((current) => (current === id ? null : id));
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="space-y-2 text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-200">
            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Notes</h1>
          <p className="text-sm text-slate-600">Quick notes, simple and focused</p>
        </header>

        <section className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
              <svg className="h-4 w-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-slate-900">Add a note</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="title" className="text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Lecture topic or assignment"
                className="w-full rounded-xl border border-indigo-200 bg-indigo-50/40 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="content" className="text-sm font-medium text-slate-700">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Short summary, key points, reminders..."
                rows={3}
                className="w-full rounded-xl border border-indigo-200 bg-indigo-50/40 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save note"}
            </button>
          </form>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Your notes</h2>
            {!loading && notes.length > 0 && (
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </span>
            )}
          </div>
          {loading ? (
            <div className="rounded-2xl border border-dashed border-indigo-200 bg-white p-6">
              <div className="flex items-center justify-center gap-3 text-slate-500">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <span className="text-sm">Loading notes...</span>
              </div>
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-indigo-200 bg-white p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                <svg className="h-6 w-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700">No notes yet</p>
              <p className="mt-1 text-xs text-slate-500">Add your first note above to get started</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDelete}
                  isOpen={openNoteId === note.id}
                  onToggle={toggleNote}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
