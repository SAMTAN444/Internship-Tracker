import { useState, useRef, useEffect } from "react";
import { CYCLE_ICON_STYLES } from "./statusStyles";
import { X, CalendarClock, Leaf, Sun, Wind, Snowflake } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { updateInternship } from "../services/internships";
import "react-day-picker/dist/style.css";
import { toast } from "react-toastify";
import { btnIcon, btnPrimary, btnSecondary } from "./ui";

export default function EditInternshipModal({ intern, onClose, onSave }) {
  const [form, setForm] = useState({
    company: intern.company,
    role: intern.role,
    link: intern.applicationLink || "",
    cycle: intern.cycle,
    appliedAt: intern.appliedAt,
    notes: intern.notes || "",
  });

  const [cycleOpen, setCycleOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const cycleRef = useRef(null);
  const dateRef = useRef(null);
  const modalRef = useRef(null);

  const CYCLES = [
    { value: "Spring", label: "Spring (Jan-Apr)", desc: "Jan–Apr", icon: Leaf },
    { value: "Summer", label: "Summer (May-Aug)", desc: "May–Aug", icon: Sun },
    { value: "Fall", label: "Fall (Sept-Dec)", desc: "Sept–Dec", icon: Wind },
    {
      value: "Winter",
      label: "Winter (Dec-Jan)",
      desc: "Dec–Jan",
      icon: Snowflake,
    },
    {
      value: "6-Month",
      label: "6-Month",
      desc: "Full / Part time",
      icon: CalendarClock,
    },
  ];



  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }

      // Close cycle dropdown
      if (cycleRef.current && !cycleRef.current.contains(e.target)) {
        setCycleOpen(false);
      }

      // Close date picker
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async () => {
    try {
      const data = await updateInternship(intern._id, {
        company: form.company,
        role: form.role,
        cycle: form.cycle,
        appliedAt: form.appliedAt,
        applicationLink: form.link,
        notes: form.notes,
      });
      toast.success("Internship updated");
      onSave(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update internship");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-application-title"
        className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-surface border border-line rounded-xl shadow-2xl p-5 md:p-6 relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className={`absolute top-3 right-3 ${btnIcon}`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 pr-12">
          <h2 id="edit-application-title" className="text-xl font-semibold text-fg">
            Edit application
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Company */}
          <Field label="Company Name">
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="field"
            />
          </Field>

          {/* Role */}
          <Field label="Position">
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="field"
            />
          </Field>

          {/* Link */}
          <Field label="Job Link (optional)">
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="field"
            />
          </Field>

          {/* Cycle */}
          <Field label="Time Period">
            <div ref={cycleRef} className="relative">
              <button
                type="button"
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
                    const iconStyle = CYCLE_ICON_STYLES[form.cycle];

                    return (
                      <span
                        className="flex items-center gap-2 text-fg"
                      >
                        <Icon aria-hidden="true" className={`w-4 h-4 ${iconStyle}`} />
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
                <div className="absolute mt-1 w-full py-1 bg-surface border border-line rounded-lg shadow-lg z-50">
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

          {/* Date */}
          <Field label="Date Applied">
            <div ref={dateRef} className="relative">
              <button
                type="button"
                onClick={() => setDateOpen(!dateOpen)}
                className="field flex items-center gap-3"
              >
                <CalendarClock aria-hidden="true" className="w-4 h-4 text-fg-muted" />
                {new Date(form.appliedAt).toLocaleDateString("en-GB")}
              </button>

              {dateOpen && (
                <div className="mt-2 w-fit max-w-full overflow-x-auto bg-surface border border-line rounded-xl p-3">
                  <DayPicker
                    mode="single"
                    selected={new Date(form.appliedAt)}
                    onSelect={(date) => {
                      setForm({
                        ...form,
                        appliedAt: date.toISOString(),
                      });
                      setDateOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className={btnSecondary}
          >
            Cancel
          </button>

          <button 
          onClick={handleSubmit}
          className={btnPrimary}
          >Save changes</button>
        </div>
      </div>
    </div>
  );
}

// Wrapping the control in the <label> associates the two for screen readers
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-fg mb-1.5">{label}</span>
      {children}
    </label>
  );
}
