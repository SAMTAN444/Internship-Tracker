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
      <div className="relative inline-block">
        <ListboxButton
          className="bg-white border border-gray-200
            text-gray-800 text-sm md:text-base
            px-4 py-2 min-h-11
            rounded-lg
            w-40
            flex items-center justify-between
            hover:border-gray-400
            focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
        >
          {value || <span className="text-gray-600 text-sm md:text-base">Filter by...</span>}
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </ListboxButton>

        <ListboxOptions
          className="
            absolute z-50 top-full w-full
          bg-white border border-gray-200 rounded-lg shadow-xl
            overflow-hidden focus:outline-none
          "
        >
          {filterOptions.map((option, idx) => (
            <ListboxOption
              key={idx}
              value={option}
              className={({ active, selected }) =>
                `
                cursor-pointer select-none px-4 py-2 text-sm md:text-base
                ${active ? "bg-gray-100 text-gray-900" : ""}
                ${selected ? "bg-gray-50 font-semibold" : ""}
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
