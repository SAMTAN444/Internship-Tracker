import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { btnPrimary, btnSecondary, btnGhost, cardTitle } from "./ui";
import FilterDropdown from "./FilterOptions";
import StatusDropdown from "./StatusDropdown";

// Title, Active/Archived tabs, search, filter/reset and the bulk status update.
export default function InternToolbar({
  query,
  setPage,
  setSearchQuery,
  setSearchField,
  setSortField,
  setSortOrder,
  onScopeChange,
  selectedCount,
  statusToUpdate,
  setStatusToUpdate,
  onBulkUpdate,
  addOpen,
  onToggleAdd,
}) {
  const { searchquery, searchField, sortField, scope } = query;

  // Debounced search: type into local state, propagate after a pause so we
  // don't fire a request on every keystroke.
  const [localSearch, setLocalSearch] = useState(searchquery);
  useEffect(() => {
    setLocalSearch(searchquery); // keep in sync when cleared via Reset
  }, [searchquery]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (localSearch !== searchquery) {
        setSearchQuery(localSearch);
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [localSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const canReset = searchquery || searchField || sortField;
  const reset = () => {
    setSearchQuery("");
    setSearchField("");
    setSortField("");
    setSortOrder("asc");
    setPage(1);
  };

  const changeField = (val) => {
    setSearchField(val);
    setPage(1);
  };

  const tabClass = (active) =>
    `min-h-9 px-4 rounded-md text-sm font-medium transition-colors ${
      active ? "bg-brand-soft text-fg" : "text-fg-muted hover:text-fg"
    }`;

  return (
    <div className="p-5 md:p-6 border-b border-line">
      {/* Title + Add */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={cardTitle}>Applications</h2>
          <p className="text-sm text-fg-muted">Track and manage your applications</p>
        </div>
        <button
          type="button"
          onClick={onToggleAdd}
          aria-expanded={addOpen}
          aria-controls="add-application-form"
          className={addOpen ? btnSecondary : btnPrimary}
        >
          {addOpen ? <X aria-hidden="true" className="w-4 h-4" /> : <Plus aria-hidden="true" className="w-4 h-4" />}
          {addOpen ? "Close form" : "Add application"}
        </button>
      </div>

      {/* Active / Archived */}
      <div role="group" aria-label="Which applications" className="mt-4 inline-flex gap-0.5 p-0.5 border border-line rounded-lg">
        <button
          type="button"
          onClick={() => onScopeChange("active")}
          aria-pressed={scope === "active"}
          className={tabClass(scope === "active")}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => onScopeChange("archived")}
          aria-pressed={scope === "archived"}
          className={tabClass(scope === "archived")}
        >
          Archived
        </button>
      </div>

      {/* Search, filter, bulk status */}
      <div className="mt-4 space-y-3">
        <input
          type="text"
          placeholder="Search applications"
          aria-label="Search applications"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="field"
        />

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-40 min-w-0 grow md:grow-0">
            <FilterDropdown value={searchField} setValue={changeField} />
          </div>
          <button disabled={!canReset} onClick={reset} className={btnGhost}>
            Reset
          </button>

          <div className="hidden md:block flex-1" />

          <div className="w-40 min-w-0 grow md:grow-0">
            <StatusDropdown value={statusToUpdate} setValue={setStatusToUpdate} scope={scope} />
          </div>
          <button disabled={selectedCount === 0} onClick={onBulkUpdate} className={btnPrimary}>
            Update status
          </button>
        </div>

        <p className="text-sm text-fg-muted text-right" aria-live="polite">
          {selectedCount} selected
        </p>
      </div>
    </div>
  );
}
