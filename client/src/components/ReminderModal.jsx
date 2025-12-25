import { X, Bell, Trash2, CalendarClock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
function TimeDropdown({ value, options, isOpen, onOpen, onSelect }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onOpen}
        className="
          time-select
          flex items-center justify-center
          font-semibold
          hover:bg-gray-700
          transition
        "
      >
        {value}
      </button>

      {isOpen && (
        <div
          className="
            absolute top-full mt-2
            w-full
            max-h-48 overflow-y-auto
            bg-gray-800
            border border-gray-700
            rounded-xl
            shadow-xl
            z-50
          "
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className="
                w-full px-4 py-2
                text-center text-sm
                hover:bg-gray-700
                transition
              "
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
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

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

  useEffect(() => {
    if (!existing) return;

    let h = existing.getHours();
    const m = existing.getMinutes();

    const p = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    if (h > 12) h -= 12;

    setHour(String(h).padStart(2, "0"));
    setMinute(String(m).padStart(2, "0"));
    setPeriod(p);
  }, [intern]);

  function handleSave() {
    if (!date) return;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/70 backdrop-blur-xs">
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold">
              {intern.reminder ? "Edit Reminder" : "Add Reminder"}
            </h2>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-gray-200" />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-400 mb-6">
          {intern.status} reminder for{" "}
          <span className="text-gray-200 font-medium">{intern.company}</span>
        </p>

        {/* Date picker */}
        <label className="block text-sm text-gray-300 mb-2">
          Reminder date
        </label>
        <div className="relative mb-4">
          <button
            type="button"
            onClick={() => setDateOpen(!dateOpen)}
            className="input-dark flex items-center gap-3 w-full"
          >
            <CalendarClock className="w-5 h-5 text-blue-400" />
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
              className="absolute top-full mt-2 bg-gray-800 border border-gray-700 rounded-xl p-4 z-50"
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
        <label className="block text-sm text-gray-300 mb-2">
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

          <span className="text-gray-400 font-semibold">:</span>

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
            <label className="block text-sm text-gray-300 mb-2">
              Interview location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. NTU North Spine / Zoom"
              className="input-dark mb-4"
            />
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          {intern.reminder && (
            <button
              onClick={onRemove}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
              Remove reminder
            </button>
          )}

          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={!date}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-sm font-semibold disabled:opacity-40"
            >
              Save reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
