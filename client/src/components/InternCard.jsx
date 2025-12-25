import { FileText, Pencil, Trash2, Bell } from "lucide-react";

export default function InternCard({
  intern,
  selected,
  onToggleSelect,
  onEdit,
  onDelete,
  onOpenNotes,
  onOpenReminder,
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
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
      {/* Top row */}
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-100 truncate">
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
              className="mt-1 mr-2 w-4 h-4 rounded bg-gray-800 text-blue-500"
            />

            {intern.company}
          </h3>
          <p className="text-sm text-gray-400 truncate">{intern.role}</p>
        </div>

        <span
          className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium
    ${statusStyles[intern.status] || "bg-gray-700 text-gray-200"}
  `}
        >
          {intern.status}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-3 flex justify-between text-xs text-gray-400">
        <span
          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium
    ${cycleStyles[intern.cycle] || "bg-gray-700 text-gray-300"}
  `}
        >
          {CYCLE_META[intern.cycle]?.label || intern.cycle}
        </span>

        <span>{new Date(intern.appliedAt).toLocaleDateString()}</span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onOpenNotes}
          title="Notes"
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <FileText className="w-4 h-4 text-blue-400" />
        </button>

        {/* Reminder (OA / Interview only) */}
        {(intern.status === "OA" || intern.status === "Interview") && (
          <button
            onClick={onOpenReminder}
            title={intern.reminder ? "Edit reminder" : "Set reminder"}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <Bell
              className={`w-4 h-4 ${
                intern.reminder ? "text-yellow-400" : "text-gray-400"
              }`}
            />
          </button>
        )}

        <button
          onClick={onEdit}
          title="Edit"
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <Pencil className="w-4 h-4 text-teal-400" />
        </button>

        <button
          onClick={onDelete}
          title="Delete"
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  );
}
