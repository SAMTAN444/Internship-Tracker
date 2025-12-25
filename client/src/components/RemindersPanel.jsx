import { Bell, CalendarClock } from "lucide-react";

function getTimeRemaining(date) {
  const diff = new Date(date) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  return `In ${Math.ceil(days / 7)} weeks`;
}

export default function RemindersPanel({ reminders, onOpen, onDelete }) {
  return (
    <div className="w-full bg-gray-900/40 border border-gray-700/50 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Bell className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-gray-100">
          Upcoming Reminders
        </h3>
      </div>

      {/* Empty state */}
      {reminders.length === 0 ? (
        <p className="text-sm font-medium text-gray-400">
          No upcoming OA or interview reminders
        </p>
      ) : (
        <div className="space-y-3">
          {reminders.map((intern) => {
            const formattedDate = new Date(
              intern.reminder.remindAt
            ).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            const timeRemaining = getTimeRemaining(
              intern.reminder.remindAt
            );

            return (
              <div
                key={intern._id}
                onClick={() => onOpen(intern)}
                className="
                  w-full cursor-pointer
                  rounded-lg
                  border border-gray-700/60
                  p-3
                  hover:bg-gray-800/60
                  transition
                "
              >
                <p className="text-sm font-semibold text-gray-100 truncate">
                  {intern.company}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {intern.role}
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <CalendarClock className="w-4 h-4 text-blue-400" />
                    <span>{formattedDate}</span>
                    <span className="text-gray-400">
                      • {timeRemaining}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(intern._id);
                    }}
                    className="text-gray-400 hover:text-red-400"
                    title="Remove reminder"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
