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
          className="bg-gray-900 border border-gray-700 
            text-gray-200 text-sm md:text-base
            px-4 py-2 
            rounded-lg 
            w-40
            flex items-center justify-between
            hover:border-gray-500
            focus:outline-none"
        >
          {value || <span className="text-gray-500 text-sm md:text-base">Filter by...</span>}
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </ListboxButton>

        <ListboxOptions
          className="
            absolute z-50 top-full w-full
          bg-gray-900 border border-gray-700 rounded-lg shadow-xl
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
                ${active ? "bg-gray-700 text-white" : ""}
                ${selected ? "bg-gray-800 font-semibold" : ""}
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
