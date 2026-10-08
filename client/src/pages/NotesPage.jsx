import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import { HiArrowLeft } from "react-icons/hi";
import { getInternship, updateInternship } from "../services/internships";
import { LoadingScreen } from "../components/StatusScreen";
import Logo from "../components/Logo";

const isMac = /mac/i.test(navigator.userAgentData?.platform || navigator.platform);

const MARKDOWN_TIPS = [
  ["# Heading", "Large heading"],
  ["## Heading", "Smaller heading"],
  ["**bold**", "Bold"],
  ["*italic*", "Italic"],
  ["- item", "Bullet list"],
  ["1. item", "Numbered list"],
  ["> quote", "Quote"],
  ["`code`", "Inline code"],
  ["[text](url)", "Link"],
];

const segmentClass = (active) =>
  `min-h-9 px-4 rounded-md text-sm font-medium transition-colors ${
    active ? "bg-brand-soft text-fg" : "text-fg-muted hover:text-fg"
  }`;

export default function NotesPage() {
  const { id } = useParams();

  const [internship, setInternship] = useState(null);
  const [notes, setNotes] = useState("");
  const [originalNotes, setOriginalNotes] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const isDirty = notes !== originalNotes;

  const load = useCallback(() => {
    setLoadError(false);
    setInternship(null);
    getInternship(id)
      .then((data) => {
        setInternship(data);
        setNotes(data.notes || "");
        setOriginalNotes(data.notes || "");
      })
      .catch(() => setLoadError(true));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = useCallback(async () => {
    if (!isDirty || saving) return;
    setSaving(true);
    try {
      await updateInternship(id, { notes });
      setOriginalNotes(notes);
      toast.success("Notes saved");
    } catch {
      toast.error("Couldn't save notes. Your changes are still here; try again.");
    } finally {
      setSaving(false);
    }
  }, [id, notes, isDirty, saving]);

  // Cmd/Ctrl+S saves
  useEffect(() => {
    function handleKeyDown(e) {
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // Warn before closing the tab with unsaved notes
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const header = (
    <header className="border-b border-line bg-surface">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-fg hover:text-fg-muted"
        >
          <HiArrowLeft aria-hidden="true" className="w-5 h-5" />
          Back to dashboard
        </Link>
        <Logo size="sm" />
      </div>
    </header>
  );

  if (loadError) {
    return (
      <div className="min-h-screen bg-canvas text-fg">
        {header}
        <main className="max-w-4xl mx-auto px-4 py-12 md:px-6">
          <div role="alert" className="bg-surface border border-line rounded-xl p-6">
            <h1 className="text-base font-semibold">Couldn&apos;t load these notes</h1>
            <p className="mt-2 text-sm text-fg-muted">
              The application may have been deleted, or the server may be waking up.
            </p>
            <button
              type="button"
              onClick={load}
              className="mt-4 min-h-10 px-4 text-sm font-medium text-on-brand bg-brand rounded-lg hover:bg-brand-hover"
            >
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!internship) return <LoadingScreen label="Loading notes…" />;

  return (
    <div className="min-h-screen bg-canvas text-fg flex flex-col">
      {header}

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{internship.company}</h1>
        <p className="mt-1 text-sm text-fg-muted">{internship.role}</p>

        {/* Toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Notes view" className="flex gap-0.5 p-0.5 border border-line rounded-lg bg-surface">
            <button type="button" aria-pressed={!isPreview} onClick={() => setIsPreview(false)} className={segmentClass(!isPreview)}>
              Edit
            </button>
            <button type="button" aria-pressed={isPreview} onClick={() => setIsPreview(true)} className={segmentClass(isPreview)}>
              Preview
            </button>
          </div>

          {!isPreview && (
            <button
              type="button"
              aria-expanded={showTips}
              aria-controls="markdown-tips"
              onClick={() => setShowTips((v) => !v)}
              className="min-h-10 px-3 text-sm font-medium text-fg rounded-lg hover:bg-surface-2"
            >
              {showTips ? "Hide Markdown tips" : "Markdown tips"}
            </button>
          )}

          <div className="ml-auto flex items-center gap-3">
            <span role="status" className="text-sm text-fg-muted">
              {saving ? "Saving…" : isDirty ? "Unsaved changes" : "All changes saved"}
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || saving}
              aria-keyshortcuts={isMac ? "Meta+S" : "Control+S"}
              className="inline-flex items-center gap-2 min-h-10 px-4 text-sm font-medium rounded-lg text-on-brand bg-brand hover:bg-brand-hover disabled:bg-surface-2 disabled:text-fg-muted disabled:cursor-not-allowed"
            >
              Save
              <kbd className="hidden sm:inline font-sans text-xs font-medium opacity-80">{isMac ? "⌘S" : "Ctrl+S"}</kbd>
            </button>
          </div>
        </div>

        {!isPreview && showTips && (
          <dl
            id="markdown-tips"
            className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 p-4 text-sm border border-line rounded-xl bg-surface-2"
          >
            {MARKDOWN_TIPS.map(([syntax, meaning]) => (
              <div key={syntax} className="flex items-baseline gap-2 min-w-0">
                <dt>
                  <code className="font-mono text-fg">{syntax}</code>
                </dt>
                <dd className="text-fg-muted truncate">{meaning}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* Editor / Preview */}
        <div className="mt-4">
          {!isPreview ? (
            <>
              <label htmlFor="notes" className="sr-only">
                Notes for {internship.company}
              </label>
              <textarea
                id="notes"
                className="w-full h-[55vh] md:h-[60vh] p-4 text-base leading-relaxed text-fg bg-surface border border-line-strong rounded-xl resize-y placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                placeholder="Interview dates, contacts, questions they asked… Markdown works here."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </>
          ) : (
            <div className="min-h-[55vh] md:min-h-[60vh] p-4 md:p-6 bg-surface border border-line rounded-xl overflow-auto">
              {notes.trim() ? (
                <div className="prose prose-gray max-w-none">
                  <ReactMarkdown>{notes}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-fg-muted">Nothing to preview yet. Switch to Edit to write some notes.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
