import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  SPRINTS,
  BACKLOG_TASKS,
  summarize,
  getPlanningBoardSummary,
  getBacklogSummary,
  PRIORITY_LABELS,
  PRIORITY_DOT,
  type Sprint,
  type SprintTask,
} from "@/lib/bootcamp/sprints";

export const metadata = { title: "Sprint Planı" };

const STATE_LABELS: Record<Sprint["state"], string> = {
  completed: "Tamamlandı",
  active: "Aktif",
  planned: "Planlandı",
};

type ColumnVariant = "completed" | "planned" | "backlog";

const COLUMN_ACCENT: Record<ColumnVariant, string> = {
  completed: "var(--chart-4, #10b981)",
  planned: "var(--primary)",
  backlog: "var(--muted-foreground)",
};

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/40 px-3 py-2.5">
      <div className="eyebrow">{label}</div>
      <div className="mt-1 font-heading text-2xl font-bold text-primary tabular-nums">
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PriorityTag({ priority }: { priority: SprintTask["priority"] }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground"
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

function PlanningTaskCard({
  task,
  variant,
}: {
  task: SprintTask;
  variant: ColumnVariant;
}) {
  return (
    <article
      className={cn(
        "rounded-lg border bg-card p-3 shadow-xs",
        variant === "backlog" && "border-dashed bg-muted/20",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="code-chip">{task.code}</span>
        <PriorityTag priority={task.priority} />
      </div>

      <h3 className="mt-2 font-heading text-sm font-semibold leading-snug text-foreground">
        {task.title}
      </h3>

      {task.category && (
        <Badge variant="outline" className="mt-2 font-normal text-muted-foreground">
          {task.category}
        </Badge>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 border-t pt-2.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className="grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-[9px] font-bold text-secondary-foreground"
            aria-hidden
          >
            {task.responsible === "TBD" ? "?" : initials(task.responsible)}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {task.responsible === "TBD" ? "Atanmadı" : task.responsible}
          </span>
        </div>
        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
          {task.storyPoints} SP
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={task.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${task.code} ilerlemesi`}
        >
          <div
            className={cn(
              "h-full rounded-full",
              task.progress === 100 ? "bg-[var(--chart-4,#10b981)]" : "bg-primary",
            )}
            style={{ width: `${task.progress}%` }}
          />
        </div>
        <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
          %{task.progress}
        </span>
      </div>
    </article>
  );
}

function PlanningColumn({
  title,
  stateLabel,
  variant,
  dateLabel,
  tasks,
  progress,
}: {
  title: string;
  stateLabel: string;
  variant: ColumnVariant;
  dateLabel: string;
  tasks: SprintTask[];
  /** null hides the progress row entirely (used for the backlog column). */
  progress: number | null;
}) {
  const points = tasks.reduce((sum, t) => sum + t.storyPoints, 0);

  return (
    <div className="flex w-72 shrink-0 flex-col lg:w-80">
      <header
        className="mb-2 space-y-1.5 rounded-t-lg border-t-2 bg-card px-3 py-2.5"
        style={{ borderTopColor: COLUMN_ACCENT[variant] }}
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-sm font-semibold tracking-wide text-foreground">
            {title}
          </h2>
          <Badge
            variant={variant === "completed" ? "secondary" : "outline"}
            className={variant !== "completed" ? "text-muted-foreground" : undefined}
          >
            {stateLabel}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{dateLabel}</span>
          <span className="tabular-nums">
            {tasks.length} görev · {points} SP
          </span>
        </div>
        {progress !== null && (
          <div className="flex items-center gap-2 pt-0.5">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full",
                  progress === 100 ? "bg-[var(--chart-4,#10b981)]" : "bg-primary",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="shrink-0 text-[11px] font-semibold tabular-nums text-primary">
              %{progress}
            </span>
          </div>
        )}
      </header>

      <div className="min-h-32 flex-1 space-y-2 rounded-b-xl bg-muted/40 p-2">
        {tasks.length === 0 ? (
          <div className="flex h-28 items-center justify-center rounded-lg border border-dashed text-center">
            <p className="px-4 text-xs text-muted-foreground">Görev yok</p>
          </div>
        ) : (
          tasks.map((task) => (
            <PlanningTaskCard key={task.code} task={task} variant={variant} />
          ))
        )}
      </div>
    </div>
  );
}

export default function SprintPlaniPage() {
  const board = getPlanningBoardSummary();
  const backlog = getBacklogSummary();

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Grup 43 · Bootcamp</div>
        <h1 className="mt-1 font-heading text-2xl text-primary">Sprint Planı</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Sprint 1, Sprint 2, Sprint 3 ve proje backlog&rsquo;unu tek bir
          planlama panosunda gösterir. Görevler sprintlere göre gruplanır.
          Salt okunurdur.
        </p>
      </div>

      {/* Genel Durum Özeti */}
      <section className="space-y-3">
        <h2 className="eyebrow px-1">Genel Durum Özeti</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          <StatTile label="Toplam Sprint" value={board.totalSprints} />
          <StatTile label="Tamamlanan Sprint" value={board.completedSprints} />
          <StatTile label="Planlanan Sprint" value={board.plannedSprints} />
          <StatTile
            label="Toplam Bilinen SP"
            value={`${board.totalKnownPoints} SP`}
          />
          <StatTile label="Tamamlanan SP" value={`${board.completedPoints} SP`} />
          <StatTile label="Kalan Planlı SP" value={`${board.remainingPoints} SP`} />
          <StatTile label="Genel İlerleme" value={`%${board.progress}`} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {board.perSprintPoints.map((s) => (
            <span key={s.slug}>
              <span className="font-medium text-foreground">{s.name}:</span>{" "}
              {s.points} SP
            </span>
          ))}
          <span>
            <span className="font-medium text-foreground">Backlog:</span>{" "}
            {backlog.storyPoints} SP{" "}
            <span className="italic">(sprint dışı, ilerlemeye dahil değil)</span>
          </span>
        </div>
      </section>

      {/* Planning board */}
      <section className="space-y-3">
        <h2 className="eyebrow px-1">Planlama Panosu</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {SPRINTS.map((sprint) => {
            const tasks = sprint.tasks ?? [];
            const summary = summarize(tasks);
            const variant: ColumnVariant =
              sprint.state === "completed" ? "completed" : "planned";
            return (
              <PlanningColumn
                key={sprint.slug}
                title={sprint.name}
                stateLabel={STATE_LABELS[sprint.state]}
                variant={variant}
                dateLabel={`${sprint.startDate} – ${sprint.endDate}`}
                tasks={tasks}
                progress={summary.progress}
              />
            );
          })}
          <PlanningColumn
            title="Backlog"
            stateLabel="Sprint dışı"
            variant="backlog"
            dateLabel="Gelecek işler"
            tasks={BACKLOG_TASKS}
            progress={null}
          />
        </div>
      </section>

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
    </div>
  );
}
