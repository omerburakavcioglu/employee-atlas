import Link from "next/link";
import { getAllShortlists } from "@/lib/queries/shortlists";
import { getSessionProfile } from "@/lib/queries/session";
import { NewShortlistButton } from "./new-shortlist-button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Shortlists" };

export default async function ShortlistsPage() {
  const [shortlists, session] = await Promise.all([
    getAllShortlists(),
    getSessionProfile(),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">Project staffing</div>
          <h1 className="mt-1 font-heading text-2xl text-primary">Shortlists</h1>
        </div>
        <NewShortlistButton />
      </div>

      {shortlists.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card py-16 text-center">
          <p className="font-heading text-sm font-semibold text-primary">
            No shortlists yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create one here, or add employees straight from the directory.
          </p>
        </div>
      ) : (
        <div className="divide-y rounded-lg border bg-card">
          {shortlists.map((s) => (
            <Link
              key={s.id}
              href={`/shortlists/${s.id}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent/50"
            >
              <div className="min-w-0 flex-1">
                <p className="font-heading text-[15px] font-semibold text-foreground">
                  {s.name}
                </p>
                {s.description && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {s.description}
                  </p>
                )}
              </div>
              {s.created_by === session.userId && (
                <Badge variant="outline" className="text-muted-foreground">
                  Mine
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                by {s.creator_name}
              </span>
              <span className="w-24 text-right font-heading text-sm font-bold text-primary tabular-nums">
                {s.member_count}{" "}
                <span className="font-sans text-xs font-normal text-muted-foreground">
                  people
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
