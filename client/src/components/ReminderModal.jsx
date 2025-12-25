import { X, Bell, Trash2, CalendarClock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function ReminderModal({ intern, onClose, onSave, onRemove }) {
  const modalRef = useRef(null);

  const existing = intern.reminder?.remindAt
    ? newDate(intern.reminder.remindAt)
    : null;

  const [date, setDate] = useState(existing ?? null);
  const [time, setTime] = useState(
    existing
      ? `${existing.getHours().toString().padStart(2, "0")}:${existing
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : "09:00"
  );
  const [dateOpen, setDateOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  function handleSave() {
    if (!date) return;

    const [h, m] = time.split(":");
    const remindAt = new Date(date);
    remindAt.setHours(h, m, 0, 0);

    onSave({
      type: intern.status,
      remindAt: remindAt.toISOString(),
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
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input-dark w-full mb-6"
        />

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
              className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-sm font-semibold disabled:opacity-40"
            >
              Save reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
