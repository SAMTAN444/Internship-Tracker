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
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Bell className="w-6 h-6 text-amber-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Upcoming Reminders
        </h3>
      </div>

      {reminders.length === 0 ? (
        <p className="text-sm font-medium text-gray-600">
          No upcoming OA or interview reminders
        </p>
      ) : (
        <div className="space-y-3 overflow-auto pr-2 max-h-55 md:max-h-75">
          {reminders.map((intern) => {
            const formattedDate = new Date(
              intern.reminder.remindAt,
            ).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            const timeRemaining = getTimeRemaining(intern.reminder.remindAt);

            const locationText =
              intern.status === "Interview"
                ? intern.reminder.location || "Location not specified"
                : "Online Assessment";

            return (
              <div
                key={intern._id}
                role="button"
                tabIndex={0}
                onClick={() => onOpen(intern)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen(intern);
                  }
                }}
                aria-label={`Open reminder for ${intern.company}`}
                className="
                  w-full cursor-pointer
                  rounded-xl
                  border border-gray-200
                  p-4
                  hover:bg-gray-50
                  transition
                "
              >
                <p className="text-sm md:text-base font-semibold text-gray-900 truncate">
                  {intern.company}
                </p>

                <p className="text-sm text-gray-600 truncate">{intern.role}</p>

                <p className="text-sm text-gray-600 truncate mt-0.5">
                  {locationText}
                </p>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 text-sm text-gray-700">
                    <CalendarClock className="w-4 h-4 text-blue-600 shrink-0" />

                    <span className="truncate">{formattedDate}</span>

                    <span className="shrink-0 text-gray-700">
                      {timeRemaining}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(intern._id);
                    }}
                    className="shrink-0 text-gray-600 hover:text-red-600 text-sm font-semibold"
                    title="Remove reminder"
                  >
                    Delete
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
