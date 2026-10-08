import { X, Bell, Trash2, CalendarClock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast } from "react-toastify";
import { btnDanger, btnIcon, btnPrimary, btnSecondary } from "./ui";

function TimeDropdown({ value, options, isOpen, onOpen, onSelect }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onOpen}
        className="time-select flex items-center justify-center font-medium hover:bg-surface-2 transition-colors"
      >
        {value}
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-1 w-full max-h-48 overflow-y-auto py-1 bg-surface border border-line rounded-lg shadow-lg z-50"
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className="w-full px-3 py-2 text-center text-sm text-fg hover:bg-surface-2"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReminderModal({ intern, onClose, onSave, onRemove }) {
  const modalRef = useRef(null);
  const [location, setLocation] = useState(intern.reminder?.location || "");

  const existing = intern.reminder?.remindAt
    ? new Date(intern.reminder.remindAt)
    : null;

  const [openPicker, setOpenPicker] = useState(null);
  const [date, setDate] = useState(existing ?? null);
  const [dateOpen, setDateOpen] = useState(false);
  // Start the time pickers at the existing reminder's time (12-hour clock).
  // The modal mounts fresh for each reminder, so this only needs to run once.
  const initialTime = (() => {
    if (!existing) return { hour: "09", minute: "00", period: "AM" };
    let h = existing.getHours();
    const period = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    if (h > 12) h -= 12;
    return {
      hour: String(h).padStart(2, "0"),
      minute: String(existing.getMinutes()).padStart(2, "0"),
      period,
    };
  })();
  const [hour, setHour] = useState(initialTime.hour);
  const [minute, setMinute] = useState(initialTime.minute);
  const [period, setPeriod] = useState(initialTime.period);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    function closePickers(e) {
      if (!e.target.closest(".time-select")) {
        setOpenPicker(null);
      }
    }

    document.addEventListener("click", closePickers);
    return () => document.removeEventListener("click", closePickers);
  }, []);


  function handleSave() {
    if (!date) return;

    if (intern.status === "Interview" && !location.trim()) {
        toast.error("Please specify interview location");
        return;
    }

    let h = parseInt(hour, 10);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    const remindAt = new Date(date);
    remindAt.setHours(h, parseInt(minute), 0, 0);

    onSave({
      type: intern.status,
      remindAt: remindAt.toISOString(),
      location: intern.status === "Interview" ? location: null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-title"
        className="w-full max-w-md max-h-[90vh] overflow-auto rounded-xl bg-surface border border-line shadow-2xl p-5 md:p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell aria-hidden="true" className="w-5 h-5 text-fg-muted" />
            <h2 id="reminder-title" className="text-xl font-semibold">
              {intern.reminder ? "Edit reminder" : "Add reminder"}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" className={`-mr-2 ${btnIcon}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-fg-muted mb-6">
          {intern.status} reminder for{" "}
          <span className="text-fg font-medium">{intern.company}</span>
        </p>

        {/* Date picker */}
        <label className="block text-sm font-medium text-fg mb-1.5">
          Reminder date
        </label>
        <div className="relative mb-4">
          <button
            type="button"
            onClick={() => setDateOpen(!dateOpen)}
            className="field flex items-center gap-3 w-full"
          >
            <CalendarClock aria-hidden="true" className="w-4 h-4 text-fg-muted" />
            {date
              ? date.toLocaleDateString("en-GB", {
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
                selected={date ?? undefined}
                onSelect={(d) => {
                  setDate(d);
                  setDateOpen(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Time picker */}
        <label className="block text-sm font-medium text-fg mb-1.5">
          Reminder time
        </label>

        <div className="flex items-center gap-3 mb-6">
          {/* Hour */}
          <TimeDropdown
            value={hour}
            options={Array.from({ length: 12 }, (_, i) =>
              String(i + 1).padStart(2, "0")
            )}
            isOpen={openPicker === "hour"}
            onOpen={() => setOpenPicker(openPicker === "hour" ? null : "hour")}
            onSelect={(v) => {
              setHour(v);
              setOpenPicker(null);
            }}
          />

          <span className="text-fg-muted font-medium">:</span>

          {/* Minute */}
          <TimeDropdown
            value={minute}
            options={["00", "15", "30", "45"]}
            isOpen={openPicker === "minute"}
            onOpen={() =>
              setOpenPicker(openPicker === "minute" ? null : "minute")
            }
            onSelect={(v) => {
              setMinute(v);
              setOpenPicker(null);
            }}
          />

          {/* AM / PM */}
          <TimeDropdown
            value={period}
            options={["AM", "PM"]}
            isOpen={openPicker === "period"}
            onOpen={() =>
              setOpenPicker(openPicker === "period" ? null : "period")
            }
            onSelect={(v) => {
              setPeriod(v);
              setOpenPicker(null);
            }}
          />
        </div>

        {intern.status === "Interview" && (
          <>
            <label className="block text-sm font-medium text-fg mb-1.5">
              Interview location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. NTU North Spine"
              className="field mb-4"
            />
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          {intern.reminder && (
            <button
              onClick={onRemove}
              className={btnDanger}
            >
              <Trash2 className="w-4 h-4" />
              Remove reminder
            </button>
          )}

          <div className="flex gap-2 ml-auto">
            <button
              onClick={onClose}
              className={btnSecondary}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={!date}
              className={btnPrimary}
            >
              Save reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
