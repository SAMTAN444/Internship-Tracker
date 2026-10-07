import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, ExternalLink, Pencil, Trash2, Bell, FileText } from "lucide-react";
import { STATUS_STYLES, CYCLE_STYLES } from "./statusStyles";

function SortHeader({ field, label, sortField, sortOrder, onSort }) {
  const active = sortField === field;
  return (
    <th
      scope="col"
      aria-sort={active ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
      className="px-6 py-4 text-left text-sm"
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-gray-900"
      >
        {label}{" "}
        <span aria-hidden="true">{active ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}</span>
      </button>
    </th>
  );
}

// Table view for md+ screens, with a per-row actions menu.
export default function InternTableDesktop({
  internships,
  searchquery,
  sortField,
  sortOrder,
  onSort,
  isSelected,
  allSelected,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onOpenNotes,
  onOpenReminder,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

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
  }, []);

  const sortProps = { sortField, sortOrder, onSort };

  return (
    <div className="hidden md:block">
      <table className="min-w-full text-base">
        <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider text-sm">
          <tr className="odd:bg-gray-50 even:bg-transparent hover:bg-gray-100 transition">
            <th scope="col" className="px-6 py-4 text-center w-12">
              <input
                type="checkbox"
                aria-label="Select all applications"
                className="w-5 h-5 rounded accent-gray-900 bg-gray-50"
                checked={allSelected}
                onChange={onToggleSelectAll}
              />
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm">Company</th>
            <th scope="col" className="px-6 py-4 text-left text-sm">Role</th>
            <SortHeader field="cycle" label="Cycle" {...sortProps} />
            <SortHeader field="appliedAt" label="Date Applied" {...sortProps} />
            <SortHeader field="status" label="Status" {...sortProps} />
            <th scope="col" className="px-6 py-4 text-left text-sm">Actions</th>
          </tr>
        </thead>

        <tbody>
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
                  checked={isSelected(intern._id)}
                  onChange={() => onToggleSelect(intern._id)}
                />
              </td>
              <td className="px-6 py-5 text-gray-900 font-semibold text-lg">{intern.company}</td>
              <td className="px-6 py-5 text-gray-700 text-base">{intern.role}</td>
              <td className="px-6 py-5">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md ${CYCLE_STYLES[intern.cycle]}`}>
                  <span className="text-sm font-semibold">{intern.cycle}</span>
                </span>
              </td>
              <td className="px-6 py-4 text-gray-700">{new Date(intern.appliedAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1.5 text-sm rounded-full font-medium ${STATUS_STYLES[intern.status]}`}>
                  {intern.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right relative">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => onOpenNotes(intern)}
                    aria-label={`Open notes for ${intern.company}`}
                    className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg hover:bg-gray-100"
                  >
                    <FileText className="w-4 h-4 text-gray-700" />
                  </button>

                  <button
                    onClick={() => setOpenMenuId(openMenuId === intern._id ? null : intern._id)}
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
                    {(intern.status === "OA" || intern.status === "Interview") && (
                      <button
                        role="menuitem"
                        onClick={() => {
                          onOpenReminder(intern);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-800 font-semibold hover:bg-gray-100"
                      >
                        <Bell className={`w-4 h-4 ${intern.reminder ? "text-amber-600" : "text-gray-600"}`} />
                        {intern.reminder ? "Edit Reminder" : "Set Reminder"}
                      </button>
                    )}

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
  );
}
