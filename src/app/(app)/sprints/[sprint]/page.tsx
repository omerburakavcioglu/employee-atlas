import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileClock } from "lucide-react";
import { getSprint, SPRINTS } from "@/lib/bootcamp/sprints";
import { SprintBoardView } from "../sprint-board-view";

export function generateStaticParams() {
  return SPRINTS.map((s) => ({ sprint: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sprint: string }>;
}) {
  const { sprint } = await params;
  const found = getSprint(sprint);
  return { title: found ? `${found.name} — Sprint Panosu` : "Sprint" };
}

export default async function SprintDetailPage({
  params,
}: {
  params: Promise<{ sprint: string }>;
}) {
  const { sprint: slug } = await params;
  const sprint = getSprint(slug);
  if (!sprint) notFound();

  return (
    <div className="space-y-4">
      <Link
        href="/sprints"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Sprintler
      </Link>

      <div>
        <div className="eyebrow">Grup 43 · Sprint Panosu</div>
        <h1 className="mt-1 font-heading text-2xl text-primary">
          Sprint Board — {sprint.name}
        </h1>
      </div>

      {sprint.tasks ? (
        <SprintBoardView sprint={sprint} tasks={sprint.tasks} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-card py-20 text-center">
          <FileClock className="size-8 text-muted-foreground/60" aria-hidden />
          <p className="font-heading text-base font-semibold text-primary">
            {sprint.placeholder}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Bu sprint için görevler ve pano henüz hazırlanmadı. Sprint
            başladığında burada yer alacak.
          </p>
        </div>
      )}
    </div>
  );
}
