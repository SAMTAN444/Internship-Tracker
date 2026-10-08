import { useState, useRef, useEffect } from "react";
import { CYCLE_ICON_STYLES } from "./statusStyles";
import { Leaf, Sun, Wind, Snowflake, CalendarClock, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast } from "react-toastify";
import { btnIcon, btnPrimary, btnSecondary, card, cardTitle } from "./ui";

function Field({ id, label, required, children }) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-fg mb-1.5">
          {label}
          {required && (
            <span className="text-danger" aria-hidden="true">
              {" *"}
            </span>
          )}
        </label>
        {children}
      </div>
    );
  }

// Add-application panel. Opened from the applications toolbar; onCancel closes it.
export default function Form({ onSubmit, onCancel }) {
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
    <div id="add-application-form" className="w-full">
      <div className={`w-full p-5 md:p-6 ${card}`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <h2 className={cardTitle}>Add application</h2>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              aria-label="Close add application form"
              className={`ml-auto ${btnIcon}`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
          <Field id="company" label="Company Name" required>
            <input
              id="company"
              name="company"
              required
              aria-required="true"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Google, Bloomberg, Apple"
              className="field"
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
              className="field"
            />
          </Field>

          <Field id="link" label="Job Link (optional)">
            <input
              id="link"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://careers.company.com/job-posting"
              className="field"
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
                className="field flex items-center justify-between"
              >
                {form.cycle ? (
                  (() => {
                    const selected = CYCLES.find((c) => c.value === form.cycle);
                    const Icon = selected.icon;
                    return (
                      <span
                        className="flex items-center gap-2 text-fg"
                      >
                        <Icon aria-hidden="true" className="w-4 h-4 text-fg-muted" />
                        <span>
                          {selected.label}
                        </span>
                      </span>
                    );
                  })()
                ) : (
                  <span className="text-fg-muted">
                    Choose internship period
                  </span>
                )}

                <span aria-hidden="true" className="text-fg-muted text-sm">▾</span>
              </button>

              {cycleOpen && (
                <div
                  className="absolute z-20 mt-1 w-full py-1 rounded-lg bg-surface border border-line shadow-lg overflow-hidden"
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
                      className="w-full px-3 py-2 text-left hover:bg-surface-2 flex items-center gap-3"
                    >
                      <c.icon
                        className={`w-4 h-4 ${CYCLE_ICON_STYLES[c.value]}`}
                      />
                      <div>
                        <div className="text-sm text-fg font-medium">
                          {c.label}
                        </div>
                        <div className="text-xs text-fg-muted">{c.desc}</div>
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
                className="field flex items-center gap-3 text-fg"
              >
                <CalendarClock aria-hidden="true" className="w-4 h-4 text-fg-muted" />
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
                  className="mt-2 w-fit max-w-full overflow-x-auto bg-surface border border-line rounded-xl p-3"
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
          <div className="md:col-span-2 flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className={btnSecondary}
            >
              Clear form
            </button>

            <button
              type="submit"
              className={btnPrimary}
            >
              Add application
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  
}
