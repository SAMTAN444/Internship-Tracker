import { useState, useRef, useEffect } from "react";
import { Leaf, Sun, Wind, Snowflake, CalendarClock } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function Field({ label, children }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
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
    { value: "Spring", label: "Spring", desc: "Jan–Apr", icon: Leaf },
    { value: "Summer", label: "Summer", desc: "May–Aug", icon: Sun },
    { value: "Fall", label: "Fall", desc: "Sept–Dec", icon: Wind },
    { value: "Winter", label: "Winter", desc: "Dec–Jan", icon: Snowflake },
    {
      value: "6-Month",
      label: "6-Month",
      desc: "Full / Part time",
      icon: CalendarClock,
    },
  ];

  const cycleStyles = {
    Spring: "bg-green-500/15 text-green-300",
    Summer: "bg-yellow-500/15 text-yellow-300",
    Fall: "bg-orange-500/15 text-orange-300",
    Winter: "bg-blue-500/15 text-blue-300",
    "6-Month": "bg-purple-500/15 text-purple-300",
  };

  const cycleIconStyles = {
    Spring: "text-green-400",
    Summer: "text-yellow-400",
    Fall: "text-orange-400",
    Winter: "text-blue-400",
    "6-Month": "text-purple-400",
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

  function handleReset(e) {
    setForm({
      company: "",
      role: "",
      link: "",
      cycle: "",
      appliedAt: "",
      notes: "",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.company || !form.role || !form.cycle) {
        alert("Please fill in required fields");
        return;
    }
    onSubmit(form);
  }

  return (
    <div className="w-full">
      <div className="w-full bg-gray-900/70 backdrop-blur border border-gray-700/60 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 text-4xl font-semibold">
            +
          </div>
          <h2 className="text-2xl font-semibold text-gray-100">
            Add New Application
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Field label="Company Name">
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Google, Bloomberg, Apple"
              className="input-dark"
            />
          </Field>

          <Field label="Position">
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Software Engineer Intern"
              className="input-dark"
            />
          </Field>

          <Field label="Job Link (optional)">
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://careers.company.com/job-posting"
              className="input-dark"
            />
          </Field>

          <Field label="Time Period">
            <div ref={cycleRef} className="relative">
              <button
                type="button"
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
                  <span className="text-gray-500">
                    Choose internship period
                  </span>
                )}

                <span className="text-gray-400 text-xl">▾</span>
              </button>

              {cycleOpen && (
                <div
                  className="absolute z-20 mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 shadow-lg overflow-hidden"
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
                      className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3"
                    >
                      <c.icon
                        className={`w-5 h-5 ${cycleIconStyles[c.value]}`}
                      />
                      <div>
                        <div className="text-gray-100 font-medium">
                          {c.label}
                        </div>
                        <div className="text-xs text-gray-400">{c.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <Field label="Date Applied">
            <div ref={dateRef} className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDateOpen(!dateOpen);
                  setCycleOpen(false);
                }}
                className="input-dark flex items-center gap-3 text-gray-300"
              >
                <CalendarClock className="w-5 h-5 text-blue-400" />
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
                  className="absolute z-50 mt-2 rounded-xl border border-gray-700 bg-gray-900 shadow-xl p-4"
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
              className="px-6 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 font-medium"
            >
              Reset Form
            </button>

            <button
              type="submit"
              className="px-8 py-2 rounded-lg bg-blue-500/20 text-blue-400 font-semibold hover:bg-blue-500/3"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  
}
