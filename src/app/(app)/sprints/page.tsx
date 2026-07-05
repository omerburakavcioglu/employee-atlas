import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SPRINTS, summarize } from "@/lib/bootcamp/sprints";

export const metadata = { title: "Sprintler" };

const STATE_LABELS: Record<string, string> = {
  completed: "Tamamlandı",
  active: "Aktif",
  planned: "Planlandı",
};

export default function SprintsOverviewPage() {
  return (
    <div className="space-y-4">
      <div>
        <div className="eyebrow">Grup 43 · Bootcamp</div>
        <h1 className="mt-1 font-heading text-2xl text-primary">Sprintler</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Grup 43 bootcamp projesinin sprint panosu. Her sprint&rsquo;in
          hedeflerini, görevlerini ve ilerlemesini buradan görüntüleyebilirsin.
        </p>
      </div>

      <div className="divide-y rounded-lg border bg-card">
        {SPRINTS.map((sprint) => {
          const summary = sprint.tasks ? summarize(sprint.tasks) : null;
          return (
            <Link
              key={sprint.slug}
              href={`/sprints/${sprint.slug}`}
              className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-heading text-[15px] font-semibold text-foreground">
                    {sprint.name}
                  </p>
                  <Badge
                    variant={sprint.state === "completed" ? "secondary" : "outline"}
                    className={
                      sprint.state === "planned"
                        ? "text-muted-foreground"
                        : undefined
                    }
                  >
                    {STATE_LABELS[sprint.state]}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {sprint.goal}
                </p>
              </div>

              {summary ? (
                <div className="text-right">
                  <div className="font-heading text-sm font-bold text-primary tabular-nums">
                    %{summary.progress}
                  </div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">
                    {summary.completedTasks}/{summary.totalTasks} görev
                  </div>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Doküman bekleniyor
                </span>
              )}

              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
