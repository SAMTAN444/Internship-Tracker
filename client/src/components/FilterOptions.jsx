import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";

const filterOptions = ["Company", "Role", "Cycle", "Status"];

export default function FilterDropdown({ value, setValue }) {
  return (
    <Listbox value={value} onChange={setValue}>
      <div className="relative w-full">
        <ListboxButton
          className="field flex items-center justify-between gap-2 text-left text-sm! hover:border-fg-muted"
        >
          {value || <span className="text-fg-muted">Filter by…</span>}
          <ChevronDown className="w-4 h-4 text-fg-muted" />
        </ListboxButton>

        <ListboxOptions
          className="absolute z-50 top-full mt-1 w-full py-1 bg-surface border border-line rounded-lg shadow-lg overflow-hidden focus:outline-none"
        >
          {filterOptions.map((option, idx) => (
            <ListboxOption
              key={idx}
              value={option}
              className={({ active, selected }) =>
                `
                cursor-pointer select-none px-3 py-2 text-sm text-fg
                ${active ? "bg-surface-2 text-fg" : ""}
                ${selected ? "font-medium" : ""}
                `
              }
            >
              {option}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
