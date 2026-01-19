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
    Spring: "bg-green-500/15 text-green-300",
    Summer: "bg-yellow-500/15 text-yellow-300",
    Fall: "bg-orange-500/15 text-orange-300",
    Winter: "bg-blue-500/15 text-blue-300",
    "6-Month": "bg-purple-500/15 text-purple-300",
  };

  const CYCLE_META = {
    Spring: { label: "Spring", desc: "Jan–Apr" },
    Summer: { label: "Summer", desc: "May–Aug" },
    Fall: { label: "Fall", desc: "Sept–Dec" },
    Winter: { label: "Winter", desc: "Dec–Jan" },
    "6-Month": { label: "6-Month", desc: "" },
  };

  const statusStyles = {
    Applied: "bg-gray-600 text-white",
    OA: "bg-purple-600 text-white",
    Interview: "bg-yellow-600 text-white",
    Offer: "bg-green-600 text-white",
    Rejected: "bg-red-500 text-white",
    Archived: "bg-gray-700 text-gray-300 border border-gray-600",
  };

  const [openMenuId, setOpenMenuId] = useState(null);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchquery, sortField, sortOrder]);

  return (
    <div className="bg-gray-900/60 backdrop-blur border border-gray-700/60 rounded-xl shadow-lg">
      {/* Table Header */}

      <div className="px-6 py-6 border-b border-gray-700/60 bg-gray-800/60">
        {/* Row 1 - Title */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">
            Internships
          </h2>
          <p className="text-sm md:text-base text-gray-400">
            Track and manage your applications
          </p>
        </div>
        {/* Tabs (above search) */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setScope("active");
              console.log("tab -> archived click");
              setPage(1);
              setSelectedIds([]);
              setStatusToUpdate("Applied");
            }}
            className={`
      flex-1 h-10 rounded-lg text-sm font-semibold
      border border-gray-700/60
      ${scope === "active" ? "bg-teal-700 text-gray-100" : "bg-gray-800/30 text-gray-400 hover:bg-gray-800/50"}
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
            className={`
      flex-1 h-10 rounded-lg text-sm font-semibold
      border border-gray-700/60
      ${scope === "archived" ? "bg-teal-700 text-gray-100" : "bg-gray-800/30 text-gray-400 hover:bg-gray-800/50"}
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
            value={searchquery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
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
          bg-gray-700/60 text-gray-200
          hover:bg-gray-600/70
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
              ? "bg-gray-700/60 text-gray-200 hover:bg-gray-600/70 disabled:opacity-40 disabled:cursor-not-allowed"
              : "bg-teal-700 text-white hover:bg-teal-600"
          }
        `}
              >
                Update
              </button>
            </div>

            {/* Row 3: selected count on RIGHT (below Update row) */}
            <div className="grid grid-cols-[1fr_96px]">
              <div />
              <span className="text-sm text-gray-300 text-right">
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
          bg-gray-600 text-white
          hover:bg-gray-600/70
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
              ? "bg-gray-700/60 text-gray-200 hover:bg-gray-600/70 disabled:opacity-40 disabled:cursor-not-allowed"
              : "bg-teal-700 text-white hover:bg-teal-600"
          }
        `}
                >
                  Update status
                </button>
              </div>
            </div>

            {/* Row 2: selected BELOW the whole row, aligned right */}
            <div className="mt-2 flex justify-end">
              <span className="text-sm text-gray-300">
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
          <thead className="bg-gray-800/80 text-gray-300 uppercase tracking-wider text-sm">
            <tr className="odd:bg-gray-800/40 even:bg-transparent hover:bg-gray-700/40 transition">
              <th className="px-6 py-4 text-center w-12">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-3xl bg-gray-800 text-blue-700"
                  checked={
                    internships.length > 0 &&
                    selectedIds.length === internships.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-left text-sm">Company</th>
              <th className="px-6 py-4 text-left text-sm">Role</th>
              <th
                className="px-6 py-4 text-left text-sm cursor-pointer select-none"
                onClick={() => {
                  if (sortField === "cycle") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortField("cycle");
                    setSortOrder("asc");
                  }
                  setPage(1);
                }}
              >
                Cycle{" "}
                {sortField === "cycle"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"}
              </th>
              <th
                className="px-6 py-4 text-left text-sm cursor-pointer select-none"
                onClick={() => {
                  if (sortField === "appliedAt") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortField("appliedAt");
                    setSortOrder("asc");
                  }
                  setPage(1);
                }}
              >
                <span className="inline-flex items-center gap-1">
                  Date Applied{" "}
                  {sortField === "appliedAt"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </span>
              </th>

              <th
                className="px-6 py-4 text-left text-sm cursor-pointer select-none"
                onClick={() => {
                  if (sortField === "status") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortField("status");
                    setSortOrder("asc");
                  }
                  setPage(1);
                }}
              >
                Status{" "}
                {sortField === "status"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"}
              </th>

              <th className="px-6 py-4 text-left text-sm">Actions</th>
            </tr>
          </thead>

          <tbody className="">
            {internships.length === 0 && searchquery === "" && (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-400">
                  No internships yet
                </td>
              </tr>
            )}
            {internships.length === 0 && searchquery !== "" && (
              <tr>
                <td colSpan="7">
                  <div className="flex justify-center items-center h-48 text-gray-400 text-lg">
                    No internships match your search
                  </div>
                </td>
              </tr>
            )}

            {internships.map((intern) => (
              <tr key={intern._id} className="hover:bg-gray-700/40 transition">
                <td className="px-6 py-5 text-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-3xl bg-gray-800 text-blue-700"
                    checked={selectedIds.includes(intern._id)}
                    onChange={() => toggleSelect(intern._id)}
                  />
                </td>
                <td className="px-6 py-5 text-gray-100 font-semibold text-lg">
                  {intern.company}
                </td>
                <td className="px-6 py-5 text-gray-300 text-base">
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

                <td className="px-6 py-4 text-gray-300">
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
                  <div className="flex items-center gap-3 justify-end">
                    {/* Notes Button */}
                    <button
                      onClick={() => navigate(`/notes/${intern._id}`)}
                      className="p-2 rounded-lg hover:bg-gray-700"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* Menu Toggle */}
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === intern._id ? null : intern._id,
                        )
                      }
                      className="p-2 rounded-lg hover:bg-gray-700"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {openMenuId === intern._id && (
                    <div
                      ref={menuRef}
                      className="fixed right-6 mt-2 w-44 rounded-xl bg-gray-800 border border-gray-700 shadow-lg z-50"
                    >
                      {/* Job link — conditional */}
                      {intern.applicationLink && (
                        <a
                          href={intern.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-400" />
                          Job Link
                        </a>
                      )}

                      {/* Reminder - only for OA / Interview */}
                      {(intern.status === "OA" ||
                        intern.status === "Interview") && (
                        <button
                          onClick={() => {
                            setReminderTarget(intern);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-200 font-semibold hover:bg-gray-700"
                        >
                          <Bell
                            className={`w-4 h-4 ${
                              intern.reminder
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                          {intern.reminder ? "Edit Reminder" : "Set Reminder"}
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        onClick={() => {
                          onEdit(intern);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-200 font-semibold hover:bg-gray-700"
                      >
                        <Pencil className="w-4 h-4 text-teal-600" />
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          onDelete(intern._id);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700"
                      >
                        <Trash2 className="w-4 h-4 text-red-700" />
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
      <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-800 text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-800 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
