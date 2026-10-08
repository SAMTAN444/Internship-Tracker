import { STATUS_STYLES, STATUS_BAR } from "./statusStyles";

const STAGES = ["Applied", "OA", "Interview", "Offer", "Rejected"];

function Skeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="h-4 w-64 max-w-full rounded-md bg-surface-2" />
      <div className="mt-5 h-2 rounded-full bg-surface-2" />
      <div className="mt-6 grid grid-cols-3 md:grid-cols-5 gap-4">
        {STAGES.map((s) => (
          <div key={s} className="h-12 rounded-lg bg-surface-2" />
        ))}
      </div>
    </div>
  );
}

// Where the active applications currently sit, stage by stage.
export default function PipelineCard({ stats }) {
  const total = stats?.total ?? 0;
  const pct = total ? Math.round((stats.heardBack / total) * 100) : 0;

  return (
    <section aria-labelledby="pipeline-heading" className="w-full bg-surface border border-line rounded-xl p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="pipeline-heading" className="text-xl font-semibold text-fg">
          Pipeline
        </h2>
        <span className="text-sm text-fg-muted">Active applications</span>
      </div>

      <div className="mt-4">
        {!stats ? (
          <Skeleton />
        ) : total === 0 ? (
          <p className="text-sm text-fg-muted">
            Your pipeline shows up here once you add applications: how many are waiting, in progress, and done.
          </p>
        ) : (
          <>
            <p className="text-sm text-fg-muted">
              <span className="font-medium text-fg">
                {stats.heardBack} of {total}
              </span>{" "}
              heard back ({pct}%) ·{" "}
              <span className="font-medium text-fg">
                {stats.offers} {stats.offers === 1 ? "offer" : "offers"}
              </span>
            </p>

            <div
              role="img"
              aria-label={STAGES.map((s) => `${s}: ${stats.byStatus[s]}`).join(", ")}
              className="mt-4 flex h-2 gap-0.5 overflow-hidden rounded-full bg-surface-2"
            >
              {STAGES.filter((s) => stats.byStatus[s] > 0).map((s) => (
                <div
                  key={s}
                  className={`h-full ${STATUS_BAR[s]}`}
                  style={{ width: `${(stats.byStatus[s] / total) * 100}%` }}
                />
              ))}
            </div>

            <dl className="mt-5 grid grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-4">
              {STAGES.map((s) => (
                <div key={s} className="min-w-0">
                  <dt>
                    <span className={STATUS_STYLES[s]}>
                      {s}
                    </span>
                  </dt>
                  <dd className="mt-1.5 text-2xl font-semibold tabular-nums text-fg">{stats.byStatus[s]}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>
    </section>
  );
}
