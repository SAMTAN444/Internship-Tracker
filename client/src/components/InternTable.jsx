import {
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Trash2,
  Bell,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import FilterDropdown from "./FilterOptions";
import StatusDropdown from "./StatusDropdown";
import InternCard from "./InternCard.jsx";

export default function InternTable({
  internships,
  selectedIds,
  setSelectedIds,
  statusToUpdate,
  setStatusToUpdate,
  onBulkUpdate,
  onEdit,
  onDelete,
  page,
  setPage,
  total,
  limit,
  searchquery,
  setSearchQuery,
  searchField,
  setSearchField,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  setReminderTarget,
  scope,
  setScope,
}) {
  const cycleStyles = {
    Spring: "bg-green-100 text-green-800",
    Summer: "bg-amber-100 text-amber-800",
    Fall: "bg-orange-100 text-orange-800",
    Winter: "bg-blue-100 text-blue-800",
    "6-Month": "bg-purple-100 text-purple-800",
  };

  const CYCLE_META = {
    Spring: { label: "Spring", desc: "Jan–Apr" },
    Summer: { label: "Summer", desc: "May–Aug" },
    Fall: { label: "Fall", desc: "Sept–Dec" },
    Winter: { label: "Winter", desc: "Dec–Jan" },
    "6-Month": { label: "6-Month", desc: "" },
  };

  const statusStyles = {
    Applied: "bg-gray-100 text-gray-800 border border-gray-300",
    OA: "bg-purple-100 text-purple-900 border border-purple-300",
    Interview: "bg-amber-100 text-amber-900 border border-amber-300",
    Offer: "bg-[#CBFF9E] text-gray-900 border border-green-600",
    Rejected: "bg-red-100 text-red-900 border border-red-300",
    Archived: "bg-gray-100 text-gray-700 border border-gray-300",
  };

  const [openMenuId, setOpenMenuId] = useState(null);

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

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === internships.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(internships.map((i) => i._id));
    }
  };

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpenMenuId(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [searchquery, sortField, sortOrder]);

  // Shared sort handler: toggles order on the active field, else selects it.
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };
  const ariaSortFor = (field) =>
    sortField === field
      ? sortOrder === "asc"
        ? "ascending"
        : "descending"
      : "none";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
      {/* Table Header */}

      <div className="px-6 py-6 border-b border-gray-200 bg-gray-50">
        {/* Row 1 - Title */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">
            Internships
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Track and manage your applications
          </p>
        </div>
        {/* Tabs (above search) */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setScope("active");
              setPage(1);
              setSelectedIds([]);
              setStatusToUpdate("Applied");
            }}
            aria-pressed={scope === "active"}
            className={`
      flex-1 h-10 rounded-lg text-sm font-semibold
      border border-gray-200
      ${scope === "active" ? "bg-[#CBFF9E] text-gray-900" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}
    `}
          >
            Active Apps
          </button>

          <button
            type="button"
            onClick={() => {
              setScope("archived");
              setPage(1);
              setSelectedIds([]);
              setStatusToUpdate("Applied");
            }}
            aria-pressed={scope === "archived"}
            className={`
      flex-1 h-10 rounded-lg text-sm font-semibold
      border border-gray-200
      ${scope === "archived" ? "bg-[#CBFF9E] text-gray-900" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}
    `}
          >
            Archived Apps
          </button>
        </div>

        {/* Row 2 - Search + Filter + Status + Update Button */}
        {/* CONTROLS */}
        <div className="mt-6 space-y-4">
          {/* Search */}
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
                <FilterDropdown
                  value={searchField}
                  setValue={(val) => {
                    setSearchField(val);
                    setPage(1);
                  }}
                />
              </div>

              <button
                disabled={!searchquery && !searchField && !sortField}
                onClick={() => {
                  setSearchQuery("");
                  setSearchField("");
                  setSortField("");
                  setSortOrder("asc");
                  setPage(1);
                }}
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
                <StatusDropdown
                  value={statusToUpdate}
                  setValue={setStatusToUpdate}
                  scope={scope}
                />
              </div>

              <button
                disabled={selectedIds.length === 0}
                onClick={onBulkUpdate}
                className={`
          h-10 w-24
          rounded-lg text-sm font-semibold transition
          ${
            selectedIds.length === 0
              ? "bg-gray-100 text-gray-800 hover:bg-gray-200/70 disabled:opacity-40 disabled:cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }
        `}
              >
                Update
              </button>
            </div>

            {/* Row 3: selected count on RIGHT (below Update row) */}
            <div className="grid grid-cols-[1fr_96px]">
              <div />
              <span className="text-sm text-gray-700 text-right">
                {selectedIds.length} selected
              </span>
            </div>
          </div>

          {/* ===== DESKTOP (>= md) ===== */}
          <div className="hidden md:block">
            {/* Row 1: everything on ONE row */}
            <div className="flex items-center gap-2">
              {/* Left: Filter + Reset */}
              <div className="flex items-center gap-2">
                <div className="w-47.5">
                  <FilterDropdown
                    value={searchField}
                    setValue={(val) => {
                      setSearchField(val);
                      setPage(1);
                    }}
                  />
                </div>

                <button
                  disabled={!searchquery && !searchField && !sortField}
                  onClick={() => {
                    setSearchQuery("");
                    setSearchField("");
                    setSortField("");
                    setSortOrder("asc");
                    setPage(1);
                  }}
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

              {/* Spacer */}
              <div className="flex-1" />

              {/* Right: Applied + Update status (SAME ROW) */}
              <div className="flex items-center gap-2">
                <div className="w-42.5">
                  <StatusDropdown
                    value={statusToUpdate}
                    setValue={setStatusToUpdate}
                    scope={scope}
                  />
                </div>

                <button
                  disabled={selectedIds.length === 0}
                  onClick={onBulkUpdate}
                  className={`
          h-10 px-3 rounded-lg text-sm font-semibold transition whitespace-nowrap
          ${
            selectedIds.length === 0
              ? "bg-gray-100 text-gray-800 hover:bg-gray-200/70 disabled:opacity-40 disabled:cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }
        `}
                >
                  Update status
                </button>
              </div>
            </div>

            {/* Row 2: selected BELOW the whole row, aligned right */}
            <div className="mt-2 flex justify-end">
              <span className="text-sm text-gray-700">
                {selectedIds.length} selected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="block md:hidden px-4 py-4">
        {internships.map((intern) => (
          <InternCard
            key={intern._id}
            intern={intern}
            selected={selectedIds.includes(intern._id)}
            onToggleSelect={() => toggleSelect(intern._id)}
            onEdit={() => onEdit(intern)}
            onDelete={() => onDelete(intern._id)}
            onOpenNotes={() => navigate(`/notes/${intern._id}`)}
            onOpenReminder={() => setReminderTarget(intern)}
          />
        ))}
      </div>
      {/* Table */}
      <div className="hidden md:block">
        <table className="min-w-full text-base">
          <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider text-sm">
            <tr className="odd:bg-gray-50 even:bg-transparent hover:bg-gray-100 transition">
              <th scope="col" className="px-6 py-4 text-center w-12">
                <input
                  type="checkbox"
                  aria-label="Select all applications"
                  className="w-5 h-5 rounded accent-gray-900 bg-gray-50"
                  checked={
                    internships.length > 0 &&
                    selectedIds.length === internships.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm">Company</th>
              <th scope="col" className="px-6 py-4 text-left text-sm">Role</th>
              <th scope="col" aria-sort={ariaSortFor("cycle")} className="px-6 py-4 text-left text-sm">
                <button
                  type="button"
                  onClick={() => handleSort("cycle")}
                  className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-gray-900"
                >
                  Cycle{" "}
                  <span aria-hidden="true">
                    {sortField === "cycle" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                  </span>
                </button>
              </th>
              <th scope="col" aria-sort={ariaSortFor("appliedAt")} className="px-6 py-4 text-left text-sm">
                <button
                  type="button"
                  onClick={() => handleSort("appliedAt")}
                  className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-gray-900"
                >
                  Date Applied{" "}
                  <span aria-hidden="true">
                    {sortField === "appliedAt" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                  </span>
                </button>
              </th>

              <th scope="col" aria-sort={ariaSortFor("status")} className="px-6 py-4 text-left text-sm">
                <button
                  type="button"
                  onClick={() => handleSort("status")}
                  className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-gray-900"
                >
                  Status{" "}
                  <span aria-hidden="true">
                    {sortField === "status" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                  </span>
                </button>
              </th>

              <th scope="col" className="px-6 py-4 text-left text-sm">Actions</th>
            </tr>
          </thead>

          <tbody className="">
            {internships.length === 0 && searchquery === "" && (
              <tr>
                <td colSpan="7" className="px-6 py-6 text-center text-gray-700">
                  No internships yet
                </td>
              </tr>
            )}
            {internships.length === 0 && searchquery !== "" && (
              <tr>
                <td colSpan="7">
                  <div className="flex justify-center items-center h-48 text-gray-700 text-lg">
                    No internships match your search
                  </div>
                </td>
              </tr>
            )}

            {internships.map((intern) => (
              <tr key={intern._id} className="hover:bg-gray-100 transition">
                <td className="px-6 py-5 text-center">
                  <input
                    type="checkbox"
                    aria-label={`Select ${intern.company} application`}
                    className="w-5 h-5 rounded accent-gray-900 bg-gray-50"
                    checked={selectedIds.includes(intern._id)}
                    onChange={() => toggleSelect(intern._id)}
                  />
                </td>
                <td className="px-6 py-5 text-gray-900 font-semibold text-lg">
                  {intern.company}
                </td>
                <td className="px-6 py-5 text-gray-700 text-base">
                  {intern.role}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md ${
                      cycleStyles[intern.cycle]
                    }`}
                  >
                    <span className="text-sm font-semibold">
                      {CYCLE_META[intern.cycle]?.label}
                    </span>
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {new Date(intern.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1.5 text-sm rounded-full font-medium ${
                      statusStyles[intern.status]
                    }`}
                  >
                    {intern.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <div className="flex items-center gap-2 justify-end">
                    {/* Notes Button */}
                    <button
                      onClick={() => navigate(`/notes/${intern._id}`)}
                      aria-label={`Open notes for ${intern.company}`}
                      className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg hover:bg-gray-100"
                    >
                      <FileText className="w-4 h-4 text-gray-700" />
                    </button>

                    {/* Menu Toggle */}
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === intern._id ? null : intern._id,
                        )
                      }
                      aria-label={`More actions for ${intern.company}`}
                      aria-haspopup="menu"
                      aria-expanded={openMenuId === intern._id}
                      className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg hover:bg-gray-100"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>

                  {openMenuId === intern._id && (
                    <div
                      ref={menuRef}
                      role="menu"
                      className="absolute right-6 top-full mt-2 w-44 rounded-xl bg-gray-50 border border-gray-200 shadow-lg z-50"
                    >
                      {/* Job link — conditional */}
                      {intern.applicationLink && (
                        <a
                          role="menuitem"
                          href={intern.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                          Job Link
                        </a>
                      )}

                      {/* Reminder - only for OA / Interview */}
                      {(intern.status === "OA" ||
                        intern.status === "Interview") && (
                        <button
                          role="menuitem"
                          onClick={() => {
                            setReminderTarget(intern);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-800 font-semibold hover:bg-gray-100"
                        >
                          <Bell
                            className={`w-4 h-4 ${
                              intern.reminder
                                ? "text-amber-600"
                                : "text-gray-600"
                            }`}
                          />
                          {intern.reminder ? "Edit Reminder" : "Set Reminder"}
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        role="menuitem"
                        onClick={() => {
                          onEdit(intern);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-800 font-semibold hover:bg-gray-100"
                      >
                        <Pencil className="w-4 h-4 text-gray-700" />
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        role="menuitem"
                        onClick={() => {
                          onDelete(intern._id);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-700">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            aria-label="Previous page"
            className="inline-flex items-center justify-center min-h-11 px-4 rounded-md bg-gray-100 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            aria-label="Next page"
            className="inline-flex items-center justify-center min-h-11 px-4 rounded-md bg-gray-100 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
