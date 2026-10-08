import { MoreHorizontal } from "lucide-react";
import { STATUS_STYLES, STATUS_BAR, CYCLE_STYLES } from "./statusStyles";

// A miniature, static copy of the dashboard for the landing page hero. Built
// from the same chip/bar classes as the real app so it can't drift from it.
const STAGES = [
  ["Applied", 8],
  ["OA", 3],
  ["Interview", 2],
  ["Offer", 1],
  ["Rejected", 3],
];
const TOTAL = STAGES.reduce((n, [, c]) => n + c, 0);

const ROWS = [
  ["Stripe", "Backend Engineer Intern", "Summer", "Interview"],
  ["Jane Street", "Quant Trader Intern", "Summer", "OA"],
  ["GovTech", "Software Engineer Intern", "6-Month", "Offer"],
  ["Shopee", "Data Engineer Intern", "Fall", "Rejected"],
  ["Grab", "Frontend Engineer Intern", "Summer", "Applied"],
];

export default function LandingPreview({ className = "" }) {
  return (
    <div
      role="img"
      aria-label="Preview of the Trackly dashboard: a pipeline of 17 applications and a list of applications with their status"
      className={`select-none ${className}`}
    >
      <div className="rounded-xl border border-line bg-surface shadow-2xl shadow-black/10 overflow-hidden text-left">
        {/* Window bar */}
        <div className="flex items-center gap-1.5 px-4 h-9 border-b border-line bg-surface-2">
          <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
          <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
          <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
          <span className="ml-3 text-xs text-fg-muted">trackly / dashboard</span>
        </div>

        {/* Pipeline */}
        <div className="p-5 short:p-4 border-b border-line">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="text-base font-semibold text-fg">Pipeline</span>
            <span className="text-xs text-fg-muted">
              <span className="font-medium text-fg">9 of 17</span> heard back · <span className="font-medium text-fg">1 offer</span>
            </span>
          </div>
          <div className="mt-3 flex h-2 gap-0.5 overflow-hidden rounded-full">
            {STAGES.map(([s, c]) => (
              <div key={s} className={STATUS_BAR[s]} style={{ width: `${(c / TOTAL) * 100}%` }} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
            {STAGES.map(([s, c]) => (
              <div key={s} className="min-w-0">
                <span className={STATUS_STYLES[s]}>{s}</span>
                <div className="mt-1 text-lg font-semibold tabular-nums text-fg">{c}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications */}
        <ul className="divide-y divide-line text-sm">
          {ROWS.map(([company, role, cycle, status], i) => (
            <li key={company} className={`flex items-center gap-3 px-5 h-11 ${i >= 3 ? "short:hidden" : ""}`}>
              <span className="flex-1 sm:flex-none sm:w-24 min-w-0 font-medium text-fg truncate">{company}</span>
              <span className="hidden sm:block flex-1 min-w-0 text-fg-muted truncate">{role}</span>
              <span className={`hidden lg:inline-flex ${CYCLE_STYLES[cycle]}`}>{cycle}</span>
              <span className={`w-20 justify-center ${STATUS_STYLES[status]}`}>{status}</span>
              <MoreHorizontal aria-hidden="true" className="w-4 h-4 text-fg-muted shrink-0" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
