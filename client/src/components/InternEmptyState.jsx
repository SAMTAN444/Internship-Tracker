import { HiOutlineArchive, HiOutlineSearch, HiOutlineClipboardList } from "react-icons/hi";

const primaryButton =
  "min-h-11 px-5 text-sm font-semibold text-on-brand bg-brand rounded-lg hover:bg-brand-hover";
const secondaryButton =
  "min-h-11 px-5 text-sm font-semibold text-fg bg-surface border border-line-strong rounded-lg hover:bg-surface-2";

// Shown in place of the table/cards when the current view has no rows.
// Each variant says why it's empty and offers the next step.
export default function InternEmptyState({ searchquery, scope, onClearSearch, onAddApplication, onShowActive }) {
  let Icon, title, body, action;

  if (searchquery) {
    Icon = HiOutlineSearch;
    title = `No applications match “${searchquery}”`;
    body = "Check the spelling, or clear the search to see everything in this tab.";
    action = (
      <button type="button" onClick={onClearSearch} className={secondaryButton}>
        Clear search
      </button>
    );
  } else if (scope === "archived") {
    Icon = HiOutlineArchive;
    title = "Nothing archived yet";
    body = "When a recruiting season wraps up, select its applications in Active and choose Archive to keep them out of the way.";
    action = (
      <button type="button" onClick={onShowActive} className={secondaryButton}>
        Go to active applications
      </button>
    );
  } else {
    Icon = HiOutlineClipboardList;
    title = "No applications yet";
    body = "Add the first one with the form above. It'll appear here with its status, so you can move it along as you hear back.";
    action = (
      <button type="button" onClick={onAddApplication} className={primaryButton}>
        Add an application
      </button>
    );
  }

  return (
    <div className="px-6 py-14 flex flex-col items-center text-center">
      <Icon aria-hidden="true" className="w-8 h-8 text-fg-muted" />
      <h3 className="mt-3 text-base font-semibold text-fg text-balance">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-fg-muted text-pretty">{body}</p>
      <div className="mt-5">{action}</div>
    </div>
  );
}
