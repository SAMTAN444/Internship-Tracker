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
    <section aria-labelledby="reminders-heading" className="w-full bg-surface border border-line rounded-xl p-5 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Bell aria-hidden="true" className="w-5 h-5 text-fg-muted" />
        <h2 id="reminders-heading" className="text-xl font-semibold text-fg">Upcoming reminders</h2>
      </div>

      {reminders.length === 0 ? (
        <p className="text-sm text-fg-muted">
          No upcoming OA or interview reminders
        </p>
      ) : (
        <div className="-mx-2 divide-y divide-line overflow-auto max-h-72">
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
                className="w-full cursor-pointer rounded-lg px-2 py-3 hover:bg-surface-2 transition-colors"
              >
                <p className="text-sm font-medium text-fg truncate">
                  {intern.company}
                </p>

                <p className="text-sm text-fg-muted truncate">{intern.role}</p>

                <p className="text-sm text-fg-muted truncate mt-0.5">
                  {locationText}
                </p>

                <div className="mt-2 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 text-sm text-fg-muted">
                    <CalendarClock className="w-4 h-4 text-fg-muted shrink-0" />

                    <span className="truncate">{formattedDate}</span>

                    <span className="shrink-0 text-fg-muted">
                      {timeRemaining}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(intern._id);
                    }}
                    className="shrink-0 min-h-10 px-2 -my-2 rounded-md text-fg-muted hover:text-danger text-sm font-medium"
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
    </section>
  );
}
