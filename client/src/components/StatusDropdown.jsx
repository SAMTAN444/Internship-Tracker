import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";

const statusOptions = ["Applied", "OA", "Interview", "Offer", "Rejected"];

export default function StatusDropdown({ value, setValue }) {
    
  return (
    <Listbox value={value} onChange={setValue}>
      <div className="relative inline-block">
        <ListboxButton
          className="bg-gray-900 border border-gray-700 
            text-gray-200 text-lg 
            px-4 py-2 
            rounded-lg 
            w-36
            flex items-center justify-between
            hover:border-gray-500
            focus:outline-none"
        >
          <span>{value}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </ListboxButton>

        <ListboxOptions
          className="absolute z-50 top-full w-full
            bg-gray-900 border border-gray-700 rounded-lg shadow-xl
            overflow-hidden focus:outline-none"
        >
          {statusOptions.map((status, idx) => (
            <ListboxOption
              key={idx}
              value={status}
              className={({ active, selected }) =>
                `
                cursor-pointer select-none px-4 py-2 text-lg
                ${active ? "bg-gray-700 text-white" : ""}
                ${selected ? "bg-gray-800  font-semibold" : ""}
                `
              }
            >
              {status}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
