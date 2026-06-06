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

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
      {/* Top row */}
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
              aria-label={`Select ${intern.company} application`}
              className="mt-1 mr-2 w-4 h-4 rounded bg-gray-50 accent-gray-900"
            />

            {intern.company}
          </h3>
          <p className="text-sm text-gray-600 truncate">{intern.role}</p>
        </div>

        <span
          className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium
    ${statusStyles[intern.status] || "bg-gray-100 text-gray-800"}
  `}
        >
          {intern.status}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-3 flex justify-between text-xs text-gray-600">
        <span
          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium
    ${cycleStyles[intern.cycle] || "bg-gray-100 text-gray-700"}
  `}
        >
          {CYCLE_META[intern.cycle]?.label || intern.cycle}
        </span>

        <span>{new Date(intern.appliedAt).toLocaleDateString()}</span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-1">
        <button
          onClick={onOpenNotes}
          aria-label={`Open notes for ${intern.company}`}
          title="Notes"
          className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg hover:bg-gray-100"
        >
          <FileText className="w-4 h-4 text-gray-700" />
        </button>

        {/* Reminder (OA / Interview only) */}
        {(intern.status === "OA" || intern.status === "Interview") && (
          <button
            onClick={onOpenReminder}
            aria-label={intern.reminder ? "Edit reminder" : "Set reminder"}
            title={intern.reminder ? "Edit reminder" : "Set reminder"}
            className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg hover:bg-gray-100"
          >
            <Bell
              className={`w-4 h-4 ${
                intern.reminder ? "text-amber-600" : "text-gray-600"
              }`}
            />
          </button>
        )}

        <button
          onClick={onEdit}
          aria-label={`Edit ${intern.company} application`}
          title="Edit"
          className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg hover:bg-gray-100"
        >
          <Pencil className="w-4 h-4 text-gray-700" />
        </button>

        <button
          onClick={onDelete}
          aria-label={`Delete ${intern.company} application`}
          title="Delete"
          className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg hover:bg-gray-100"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}
