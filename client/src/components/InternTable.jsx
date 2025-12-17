import { MoreHorizontal, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { FileText } from "lucide-react";

export default function InternTable({
  internships,
  selectedIds,
  setSelectedIds,
  statusToUpdate,
  setStatusToUpdate,
  onBulkUpdate,
  onEdit,
  onDelete,
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

  const [selectedNotes, setSelectedNotes] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === internships.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(internships.map((i) => i._id));
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-900/60 backdrop-blur border border-gray-700/60 rounded-xl shadow-lg">
      {/* Table Header */}

      <div className="px-6 py-6 border-b border-gray-700/60 bg-gray-800/60 flex items-start justify-between">
        {/* Left: title */}
        <div>
          <h2 className="text-3xl font-semibold tracking-wide">Internships</h2>
          <p className="text-xl text-gray-400">
            Track and manage your applications
          </p>
        </div>

        {/* Right: bulk actions */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <select
              value={statusToUpdate}
              onChange={(e) => setStatusToUpdate(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-m font-semibold text-gray-200"
            >
              <option value="Applied">Applied</option>
              <option value="OA">OA</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button 
              disabled={selectedIds.length === 0}
              onClick={onBulkUpdate}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition 
                ${
                  selectedIds.length === 0
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-blue-700 text-white hover:bg-blue-800"
                }`}
            >Update Status
            </button>
          </div>
          <span className="text-xs text-gray-400">
            {selectedIds.length} selected
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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
              <th className="px-6 py-4 text-left text-sm">Cycle</th>
              <th className="px-6 py-4 text-left text-sm">Date Applied</th>
              <th className="px-6 py-4 text-left text-sm">Status</th>
              <th className="px-6 py-4 text-left text-sm">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {internships.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-400">
                  No internships yet
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
                  <span className="px-3 py-1.5 text-sm rounded-full bg-blue-500/15 text-blue-300 font-medium">
                    {intern.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === intern._id ? null : intern._id
                      )
                    }
                    className="p-2 rounded-lg hover:bg-gray-700"
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>

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

                      {/* Edit */}
                      <button
                        onClick={() => {
                          onEdit(intern);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-200 font-semibold hover:bg-gray-700"
                      >
                        <Pencil className="w-4 h-4 text-green-400" />
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
                        <Trash2 className="w-4 h-4" />
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
        <span>Showing 1-2 of 50</span>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-800 text-sm">
            Prev
          </button>
          <button className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-800 text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
