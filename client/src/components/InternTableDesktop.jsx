import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MoreHorizontal, ExternalLink, Pencil, Trash2, Bell, FileText } from "lucide-react";
import { STATUS_STYLES, CYCLE_STYLES } from "./statusStyles";
import { btnIcon } from "./ui";

const itemClass =
  "w-full flex items-center gap-3 px-3 min-h-10 text-sm text-fg data-focus:bg-surface-2 cursor-pointer";

function SortHeader({ field, label, sortField, sortOrder, onSort }) {
  const active = sortField === field;
  return (
    <th
      scope="col"
      aria-sort={active ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
      className="px-4 py-3 text-left"
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 font-medium hover:text-fg"
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
  const sortProps = { sortField, sortOrder, onSort };

  return (
    <div className="hidden md:block">
      <table className="min-w-full text-sm">
        <thead className="text-xs text-fg-muted border-b border-line">
          <tr>
            <th scope="col" className="px-4 py-3 text-center w-12">
              <input
                type="checkbox"
                aria-label="Select all applications"
                className="w-4 h-4 accent-brand"
                checked={allSelected}
                onChange={onToggleSelectAll}
              />
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium">Company</th>
            <th scope="col" className="px-4 py-3 text-left font-medium">Role</th>
            <SortHeader field="cycle" label="Cycle" {...sortProps} />
            <SortHeader field="appliedAt" label="Date Applied" {...sortProps} />
            <SortHeader field="status" label="Status" {...sortProps} />
            <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {internships.map((intern) => (
            <tr key={intern._id} className="border-b border-line last:border-b-0 hover:bg-surface-2 transition-colors">
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  aria-label={`Select ${intern.company} application`}
                  className="w-4 h-4 accent-brand"
                  checked={isSelected(intern._id)}
                  onChange={() => onToggleSelect(intern._id)}
                />
              </td>
              <td className="px-4 py-3 text-fg font-medium">{intern.company}</td>
              <td className="px-4 py-3 text-fg-muted">{intern.role}</td>
              <td className="px-4 py-3">
                <span className={CYCLE_STYLES[intern.cycle]}>{intern.cycle}</span>
              </td>
              <td className="px-4 py-3 text-fg-muted tabular-nums">{new Date(intern.appliedAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <span className={STATUS_STYLES[intern.status]}>
                  {intern.status}
                </span>
              </td>
              <td className="px-4 py-1 text-right">
                <div className="flex items-center gap-1 justify-end">
                  <button
                    onClick={() => onOpenNotes(intern)}
                    aria-label={`Open notes for ${intern.company}`}
                    className={btnIcon}
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  {/* Anchored menus render on top of the page (portal) and flip
                      upward near the bottom of the screen, so they're never
                      clipped by the table's scroll container. */}
                  <Menu>
                    <MenuButton aria-label={`More actions for ${intern.company}`} className={btnIcon}>
                      <MoreHorizontal className="w-5 h-5" />
                    </MenuButton>
                    <MenuItems
                      anchor="bottom end"
                      className="z-50 w-48 py-1 rounded-lg bg-surface border border-line shadow-lg [--anchor-gap:4px] [--anchor-padding:8px] outline-none focus-visible:outline-none"
                    >
                      {intern.applicationLink && (
                        <MenuItem as="a" href={intern.applicationLink} target="_blank" rel="noopener noreferrer" className={itemClass}>
                          <ExternalLink aria-hidden="true" className="w-4 h-4 text-fg-muted" />
                          Job link
                        </MenuItem>
                      )}

                      {/* Reminder - only for OA / Interview */}
                      {(intern.status === "OA" || intern.status === "Interview") && (
                        <MenuItem as="button" onClick={() => onOpenReminder(intern)} className={itemClass}>
                          <Bell
                            aria-hidden="true"
                            className={`w-4 h-4 ${intern.reminder ? "text-fg fill-current" : "text-fg-muted"}`}
                          />
                          {intern.reminder ? "Edit reminder" : "Set reminder"}
                        </MenuItem>
                      )}

                      <MenuItem as="button" onClick={() => onEdit(intern)} className={itemClass}>
                        <Pencil aria-hidden="true" className="w-4 h-4 text-fg-muted" />
                        Edit
                      </MenuItem>

                      <MenuItem as="button" onClick={() => onDelete(intern._id)} className={itemClass}>
                        <Trash2 aria-hidden="true" className="w-4 h-4 text-danger" />
                        Delete
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
