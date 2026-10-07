import { useEffect, useState } from "react";
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

  const tabClass = (active) => `
      flex-1 h-10 rounded-lg text-sm font-semibold
      border border-gray-200
      ${active ? "bg-[#CBFF9E] text-gray-900" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}
    `;

  const updateClass = `
          rounded-lg text-sm font-semibold transition
          ${
            selectedCount === 0
              ? "bg-gray-100 text-gray-800 hover:bg-gray-200/70 disabled:opacity-40 disabled:cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }
        `;

  return (
    <div className="px-6 py-6 border-b border-gray-200 bg-gray-50">
      {/* Row 1 - Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">Internships</h2>
        <p className="text-sm md:text-base text-gray-600">Track and manage your applications</p>
      </div>

      {/* Tabs (above search) */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onScopeChange("active")}
          aria-pressed={scope === "active"}
          className={tabClass(scope === "active")}
        >
          Active Apps
        </button>
        <button
          type="button"
          onClick={() => onScopeChange("archived")}
          aria-pressed={scope === "archived"}
          className={tabClass(scope === "archived")}
        >
          Archived Apps
        </button>
      </div>

      {/* Search + Filter + Status + Update */}
      <div className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Search applications"
          aria-label="Search applications"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="input-dark w-full"
        />

        {/* ===== MOBILE (<= md) ===== */}
        <div className="grid gap-3 md:hidden">
          {/* Row 1: Filter + Reset */}
          <div className="grid grid-cols-[1fr_96px] gap-3 items-center">
            <div className="w-full min-w-0">
              <FilterDropdown value={searchField} setValue={changeField} />
            </div>
            <button
              disabled={!canReset}
              onClick={reset}
              className="
          h-10 w-24
          rounded-lg text-sm font-semibold
          bg-gray-100 text-gray-800
          hover:bg-gray-200/70
          disabled:opacity-40 disabled:cursor-not-allowed
        "
            >
              Reset
            </button>
          </div>

          {/* Row 2: Status (same width as Filter) + Update */}
          <div className="grid grid-cols-[1fr_96px] gap-3 items-center">
            <div className="w-full min-w-0">
              <StatusDropdown value={statusToUpdate} setValue={setStatusToUpdate} scope={scope} />
            </div>
            <button disabled={selectedCount === 0} onClick={onBulkUpdate} className={`h-10 w-24 ${updateClass}`}>
              Update
            </button>
          </div>

          {/* Row 3: selected count on RIGHT (below Update row) */}
          <div className="grid grid-cols-[1fr_96px]">
            <div />
            <span className="text-sm text-gray-700 text-right">{selectedCount} selected</span>
          </div>
        </div>

        {/* ===== DESKTOP (>= md) ===== */}
        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            {/* Left: Filter + Reset */}
            <div className="flex items-center gap-2">
              <div className="w-47.5">
                <FilterDropdown value={searchField} setValue={changeField} />
              </div>
              <button
                disabled={!canReset}
                onClick={reset}
                className="
          h-10 px-3 rounded-lg text-sm font-semibold
          bg-gray-200 text-gray-900
          hover:bg-gray-200/70
          disabled:opacity-40 disabled:cursor-not-allowed
        "
              >
                Reset
              </button>
            </div>

            <div className="flex-1" />

            {/* Right: status + Update status */}
            <div className="flex items-center gap-2">
              <div className="w-42.5">
                <StatusDropdown value={statusToUpdate} setValue={setStatusToUpdate} scope={scope} />
              </div>
              <button
                disabled={selectedCount === 0}
                onClick={onBulkUpdate}
                className={`h-10 px-3 whitespace-nowrap ${updateClass}`}
              >
                Update status
              </button>
            </div>
          </div>

          <div className="mt-2 flex justify-end">
            <span className="text-sm text-gray-700">{selectedCount} selected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
