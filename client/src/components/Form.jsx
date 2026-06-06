import { useState, useRef, useEffect } from "react";
import { Leaf, Sun, Wind, Snowflake, CalendarClock } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast } from "react-toastify";

function Field({ id, label, required, children }) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && (
            <span className="text-red-600" aria-hidden="true">
              {" *"}
            </span>
          )}
        </label>
        {children}
      </div>
    );
  }

export default function Form({ onSubmit }) {
  const [form, setForm] = useState({
    company: "",
    role: "",
    link: "",
    cycle: "",
    appliedAt: "",
    notes: "",
  });

  const CYCLES = [
    { value: "Spring", label: "Spring (Jan-Apr)", desc: "Jan–Apr", icon: Leaf },
    { value: "Summer", label: "Summer (May-Aug)", desc: "May–Aug", icon: Sun },
    { value: "Fall", label: "Fall (Sept-Dec)", desc: "Sept–Dec", icon: Wind },
    { value: "Winter", label: "Winter (Dec-Jan)", desc: "Dec–Jan", icon: Snowflake },
    {
      value: "6-Month",
      label: "6-Month",
      desc: "Full / Part time",
      icon: CalendarClock,
    },
  ];

  const cycleStyles = {
    Spring: "bg-green-100 text-green-800",
    Summer: "bg-amber-100 text-amber-800",
    Fall: "bg-orange-100 text-orange-800",
    Winter: "bg-blue-100 text-blue-800",
    "6-Month": "bg-purple-100 text-purple-800",
  };

  const cycleIconStyles = {
    Spring: "text-green-700",
    Summer: "text-amber-700",
    Fall: "text-orange-700",
    Winter: "text-blue-700",
    "6-Month": "text-purple-700",
  };

  const cycleRef = useRef(null);
  const dateRef = useRef(null);
  const [cycleOpen, setCycleOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (cycleRef.current && !cycleRef.current.contains(e.target)) {
        setCycleOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleReset() {
    setForm({
      company: "",
      role: "",
      link: "",
      cycle: "",
      appliedAt: "",
      notes: "",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.company || !form.role || !form.cycle || !form.appliedAt) {
        toast.error("Please fill in required fields");
        return;
    }
    const success= await onSubmit(form);

    if (success) {
      handleReset();
      setCycleOpen(false);
      setDateOpen(false);
    }
  }

  return (
    <div className="w-full">
      <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-[#CBFF9E] flex items-center justify-center text-gray-900 text-4xl font-semibold">
            +
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Add New Application
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Field id="company" label="Company Name" required>
            <input
              id="company"
              name="company"
              required
              aria-required="true"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Google, Bloomberg, Apple"
              className="input-dark"
            />
          </Field>

          <Field id="role" label="Position" required>
            <input
              id="role"
              name="role"
              required
              aria-required="true"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Software Engineer Intern"
              className="input-dark"
            />
          </Field>

          <Field id="link" label="Job Link (optional)">
            <input
              id="link"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://careers.company.com/job-posting"
              className="input-dark"
            />
          </Field>

          <Field id="cycle" label="Time Period" required>
            <div ref={cycleRef} className="relative">
              <button
                id="cycle"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={cycleOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setCycleOpen(!cycleOpen);
                  setDateOpen(false);
                }}
                className="input-dark flex items-center justify-between"
              >
                {form.cycle ? (
                  (() => {
                    const selected = CYCLES.find((c) => c.value === form.cycle);
                    const Icon = selected.icon;
                    const cycleStyle = cycleStyles[form.cycle];
                    return (
                      <span
                        className={`flex items-center gap-2 px-3 py-1 rounded-md ${cycleStyle}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-m font-medium">
                          {selected.label}
                        </span>
                      </span>
                    );
                  })()
                ) : (
                  <span className="text-gray-600">
                    Choose internship period
                  </span>
                )}

                <span className="text-gray-600 text-xl">▾</span>
              </button>

              {cycleOpen && (
                <div
                  className="absolute z-20 mt-2 w-full rounded-xl bg-gray-50 border border-gray-200 shadow-lg overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {CYCLES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, cycle: c.value });
                        setCycleOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3"
                    >
                      <c.icon
                        className={`w-5 h-5 ${cycleIconStyles[c.value]}`}
                      />
                      <div>
                        <div className="text-gray-900 font-medium">
                          {c.label}
                        </div>
                        <div className="text-xs text-gray-600">{c.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <Field id="appliedAt" label="Date Applied" required>
            <div ref={dateRef} className="relative">
              <button
                id="appliedAt"
                type="button"
                aria-haspopup="dialog"
                aria-expanded={dateOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setDateOpen(!dateOpen);
                  setCycleOpen(false);
                }}
                className="input-dark flex items-center gap-3 text-gray-700"
              >
                <CalendarClock className="w-5 h-5 text-blue-600" />
                {form.appliedAt
                  ? new Date(form.appliedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Select date"}
              </button>
              {dateOpen && (
                <div
                  className="absolute bottom-full mb-2 bg-white border border-gray-200 rounded-xl p-4 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DayPicker
                    mode="single"
                    selected={
                      form.appliedAt ? new Date(form.appliedAt) : undefined
                    }
                    onSelect={(date) => {
                      if (!date) return;
                      setForm({
                        ...form,
                        appliedAt: date.toISOString(),
                      });
                      setDateOpen(false);
                    }}
                  ></DayPicker>
                </div>
              )}
            </div>
          </Field>

          {/* ACTIONS */}
          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
            >
              Reset Form
            </button>

            <button
              type="submit"
              className="px-8 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  
}
