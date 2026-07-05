import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SPRINTS } from "@/lib/bootcamp/sprints";

export const metadata = { title: "Dokümantasyon" };

export default function DokumantasyonPage() {
  return (
    <div className="space-y-4">
      <div>
        <div className="eyebrow">Grup 43 · Bootcamp</div>
        <h1 className="mt-1 font-heading text-2xl text-primary">Dokümantasyon</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Grup 43 bootcamp projesinin dokümantasyon alanı. Sprint panoları ve
          proje notları buradan takip edilir.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-5">
        <h2 className="font-heading text-sm font-semibold text-foreground">
          Proje hakkında
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Bu çalışma alanı, <strong className="text-foreground">Employee Atlas</strong>{" "}
          projesi kapsamında Grup 43 ekibinin bootcamp çalışmalarını belgeler.
          Her sprint&rsquo;in hedefleri, görevleri ve tamamlanma durumu sprint
          panolarında salt okunur olarak sunulur.
        </p>
      </div>

      <div>
        <h2 className="eyebrow mb-2 px-1">Sprint panoları</h2>
        <div className="divide-y rounded-lg border bg-card">
          {SPRINTS.map((sprint) => (
            <Link
              key={sprint.slug}
              href={`/sprints/${sprint.slug}`}
              className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accent/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm font-semibold text-foreground">
                  {sprint.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {sprint.goal}
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
