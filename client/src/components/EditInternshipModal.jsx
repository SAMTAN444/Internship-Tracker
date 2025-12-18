import { useState, useRef, useEffect } from "react";
import { X, CalendarClock, Leaf, Sun, Wind, Snowflake } from "lucide-react";
import { DayPicker } from "react-day-picker";
import API from "../services/api";
import "react-day-picker/dist/style.css";
import { toast } from "react-toastify";

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

  const cycleIconStyles = {
    Spring: "text-green-400",
    Summer: "text-yellow-400",
    Fall: "text-orange-400",
    Winter: "text-blue-400",
    "6-Month": "text-purple-300",
  };

  const cycleStyles = {
    Spring: "bg-green-500/15 text-green-300",
    Summer: "bg-yellow-500/15 text-yellow-300",
    Fall: "bg-orange-500/15 text-orange-300",
    Winter: "bg-blue-500/15 text-blue-300",
    "6-Month": "text-purple-400",
  };

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
  }, []);

  const handleSubmit = async () => {
    try {
      const { data } = await API.put(`/api/internships/${intern._id}`, {
        company: form.company,
        role: form.role,
        cycle: form.cycle,
        appliedAt: form.appliedAt,
        applicationLink: form.link,
        notes: form.notes,
      });
      toast.success("Internship Updated");
      onSave(data);
    } catch (err) {
      console.error(err);
      toast.error("Faield to Update Internship");
    }
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black-60 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <X />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100">
            Edit Application
          </h2>
          <p className="text-gray-400 text-sm">
            Update your application details below
          </p>
        </div>

        <div className="space-y-6">
          {/* Company */}
          <Field label="Company Name">
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="input-dark"
            />
          </Field>

          {/* Role */}
          <Field label="Position">
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="input-dark"
            />
          </Field>

          {/* Link */}
          <Field label="Job Link (optional)">
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="input-dark"
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
                className="input-dark flex items-center justify-between"
              >
                {form.cycle ? (
                  (() => {
                    const selected = CYCLES.find((c) => c.value === form.cycle);
                    const Icon = selected.icon;
                    const cycleStyle = cycleStyles[form.cycle];
                    const iconStyle = cycleIconStyles[form.cycle];

                    return (
                      <span
                        className={`flex items-center gap-2 px-3 py-1 rounded-md ${cycleStyle}`}
                      >
                        <Icon className={`w-5 h-5 ${iconStyle}`} />
                        <span className="text-sm font-medium">
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
                <div className="absolute mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl z-50">
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

          {/* Date */}
          <Field label="Date Applied">
            <div ref={dateRef} className="relative">
              <button
                type="button"
                onClick={() => setDateOpen(!dateOpen)}
                className="input-dark flex items-center gap-3"
              >
                <CalendarClock className="w-5 h-5 text-blue-400" />
                {new Date(form.appliedAt).toLocaleDateString("en-GB")}
              </button>

              {dateOpen && (
                <div className="absolute bottom-full mb-2 bg-gray-900 border border-gray-700 rounded-xl p-4 z-50">
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
        <div className="mt-10 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition font-medium"
          >
            Cancel
          </button>

          <button 
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg  font-medium bg-teal-700 hover:bg-teal-600 text-white "
          >Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      {children}
    </div>
  );
}
