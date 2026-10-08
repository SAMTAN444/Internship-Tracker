import { FileText, Pencil, Trash2, Bell } from "lucide-react";
import { STATUS_STYLES, CYCLE_STYLES } from "./statusStyles";

export default function InternCard({
  intern,
  selected,
  onToggleSelect,
  onEdit,
  onDelete,
  onOpenNotes,
  onOpenReminder,
}) {
  return (
    <div className="py-4">
      {/* Top row */}
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-medium text-fg truncate">
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
              aria-label={`Select ${intern.company} application`}
              className="mt-1 mr-2 w-4 h-4 accent-brand"
            />

            {intern.company}
          </h3>
          <p className="text-sm text-fg-muted truncate">{intern.role}</p>
        </div>

        <span
          className={`shrink-0 ${STATUS_STYLES[intern.status] || "chip chip-applied"}`}
        >
          {intern.status}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-3 flex justify-between text-xs text-fg-muted">
        <span
          className={CYCLE_STYLES[intern.cycle] || "chip chip-cycle"}
        >
          {intern.cycle}
        </span>

        <span>{new Date(intern.appliedAt).toLocaleDateString()}</span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-1">
        <button
          onClick={onOpenNotes}
          aria-label={`Open notes for ${intern.company}`}
          title="Notes"
          className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg hover:bg-surface-2"
        >
          <FileText className="w-4 h-4 text-fg-muted" />
        </button>

        {/* Reminder (OA / Interview only) */}
        {(intern.status === "OA" || intern.status === "Interview") && (
          <button
            onClick={onOpenReminder}
            aria-label={intern.reminder ? "Edit reminder" : "Set reminder"}
            title={intern.reminder ? "Edit reminder" : "Set reminder"}
            className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg hover:bg-surface-2"
          >
            <Bell
              className={`w-4 h-4 ${
                intern.reminder ? "text-fg fill-current" : "text-fg-muted"
              }`}
            />
          </button>
        )}

        <button
          onClick={onEdit}
          aria-label={`Edit ${intern.company} application`}
          title="Edit"
          className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg hover:bg-surface-2"
        >
          <Pencil className="w-4 h-4 text-fg-muted" />
        </button>

        <button
          onClick={onDelete}
          aria-label={`Delete ${intern.company} application`}
          title="Delete"
          className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-lg hover:bg-surface-2"
        >
          <Trash2 className="w-4 h-4 text-danger" />
        </button>
      </div>
    </div>
  );
}
