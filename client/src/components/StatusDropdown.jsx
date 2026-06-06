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
      <div className="relative inline-block">
        <ListboxButton
          className="bg-white border border-gray-200
            text-gray-800 text-sm md:text-base
            px-4 py-2 min-h-11
            rounded-lg
            w-36
            flex items-center justify-between
            hover:border-gray-400
            focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
        >
          <span>
            {scope === "archived" && value === "Applied" ? "Unarchive" : value}
          </span>

          <ChevronDown className="w-4 h-4 text-gray-600" />
        </ListboxButton>

        <ListboxOptions
          className="absolute z-50 top-full w-full
            bg-white border border-gray-200 rounded-lg shadow-xl
            overflow-hidden focus:outline-none"
        >
          {statusOptions.map((status, idx) => (
            <ListboxOption
              key={idx}
              value={status}
              className={({ active, selected }) =>
                `
                cursor-pointer select-none px-4 py-2 text-sm
                ${status === "Archived" ? "text-gray-700" : "text-gray-800"}
                ${active ? "bg-gray-100 text-gray-900" : ""}
                ${selected ? "bg-gray-50 font-semibold" : ""}
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
