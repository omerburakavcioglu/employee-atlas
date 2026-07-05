import {
  SPRINT_COLUMNS,
  PRIORITY_DOT,
  PRIORITY_LABELS,
  summarize,
  type Sprint,
  type SprintTask,
} from "@/lib/bootcamp/sprints";

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-muted/40 px-3 py-2.5">
      <div className="eyebrow">{label}</div>
      <div className="mt-1 font-heading text-2xl font-bold text-primary tabular-nums">
        {value}
      </div>
    </div>
  );
}

function PriorityTag({ priority }: { priority: SprintTask["priority"] }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-muted-foreground"
      title={`${PRIORITY_LABELS[priority]} öncelik`}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ background: PRIORITY_DOT[priority] }}
        aria-hidden
      />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

function TaskCard({ task }: { task: SprintTask }) {
  return (
    <article className="rounded-lg border bg-card p-3 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="code-chip">{task.code}</span>
        <PriorityTag priority={task.priority} />
      </div>
      <h3 className="mt-2 font-heading text-sm font-semibold leading-snug text-foreground">
        {task.title}
      </h3>
      <div className="mt-3 flex items-center justify-end border-t pt-2.5">
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
          {task.storyPoints} SP
        </span>
      </div>
    </article>
  );
}

export function SprintBoardView({
  sprint,
  tasks,
}: {
  sprint: Sprint;
  tasks: SprintTask[];
}) {
  const summary = summarize(tasks);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="space-y-4 rounded-lg border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="eyebrow">
              {sprint.name} · {sprint.startDate} – {sprint.endDate}
            </div>
            <p className="mt-1 font-heading text-lg text-primary">{sprint.goal}</p>
          </div>
          <div className="text-right">
            <div className="font-heading text-3xl font-bold text-primary tabular-nums">
              %{summary.progress}
            </div>
            <div className="eyebrow">Tamamlandı</div>
          </div>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={summary.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Story point'e göre sprint ilerlemesi"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${summary.progress}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatTile label="Toplam görev" value={summary.totalTasks} />
          <StatTile label="Tamamlanan" value={summary.completedTasks} />
          <StatTile label="Devam eden" value={summary.inProgress} />
          <StatTile label="Story point" value={summary.totalPoints} />
          <StatTile label="Tamamlanan puan" value={summary.completedPoints} />
        </div>
      </div>

      {/* Priority legend */}
      <div className="flex flex-wrap items-center gap-4 px-1 text-xs text-muted-foreground">
        <span className="eyebrow">Öncelik</span>
        {(["high", "medium", "low"] as const).map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ background: PRIORITY_DOT[p] }}
              aria-hidden
            />
            {PRIORITY_LABELS[p]}
          </span>
        ))}
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {SPRINT_COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const pts = colTasks.reduce((sum, t) => sum + t.storyPoints, 0);
          return (
            <section
              key={col.id}
              aria-label={col.title}
              className="flex w-72 shrink-0 flex-col lg:w-80"
            >
              <header className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-[13px] font-semibold tracking-wide text-foreground">
                    {col.title}
                  </h2>
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
                    {colTasks.length}
                  </span>
                </div>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {pts} puan
                </span>
              </header>

              <div className="min-h-32 flex-1 space-y-2 rounded-xl bg-muted/40 p-2">
                {colTasks.length === 0 ? (
                  <div className="flex h-28 items-center justify-center rounded-lg border border-dashed text-center">
                    <p className="px-4 text-xs text-muted-foreground">
                      Bu kolonda görev yok
                    </p>
                  </div>
                ) : (
                  colTasks.map((task) => <TaskCard key={task.code} task={task} />)
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
