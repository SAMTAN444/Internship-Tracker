import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";

export default function StatusDropdown({ value, setValue, scope }) {
  const statusOptions =
    scope === "archived"
      ? ["Applied"] // Unarchive
      : ["Applied", "OA", "Interview", "Offer", "Rejected", "Archived"];
  // DISPLAY labels
  const labelFor = (status) => {
    if (scope === "archived" && status === "Applied") return "Unarchive";
    if (scope !== "archived" && status === "Archived") return "Archive";
    return status;
  };
  return (
    <Listbox value={value} onChange={setValue}>
      <div className="relative w-full">
        <ListboxButton
          // Its visible text is just the current value, so name the control's purpose
          aria-label={`Status to apply: ${scope === "archived" && value === "Applied" ? "Unarchive" : value}`}
          className="field flex items-center justify-between gap-2 text-left text-sm! hover:border-fg-muted"
        >
          <span>
            {scope === "archived" && value === "Applied" ? "Unarchive" : value}
          </span>

          <ChevronDown className="w-4 h-4 text-fg-muted" />
        </ListboxButton>

        <ListboxOptions
          className="absolute z-50 top-full mt-1 w-full py-1 bg-surface border border-line rounded-lg shadow-lg overflow-hidden focus:outline-none"
        >
          {statusOptions.map((status, idx) => (
            <ListboxOption
              key={idx}
              value={status}
              className={({ active, selected }) =>
                `
                cursor-pointer select-none px-3 py-2 text-sm
                text-fg
                ${active ? "bg-surface-2 text-fg" : ""}
                ${selected ? "font-medium" : ""}
                `
              }
            >
              {labelFor(status)}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
