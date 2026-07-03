import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getShortlistDetail } from "@/lib/queries/shortlists";
import { getSessionProfile } from "@/lib/queries/session";
import { ShortlistActions, RemoveMemberButton } from "./shortlist-actions";
import { EmployeeCard } from "@/components/employee-card";

export const metadata = { title: "Shortlist" };

export default async function ShortlistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [shortlist, session] = await Promise.all([
    getShortlistDetail(id),
    getSessionProfile(),
  ]);
  if (!shortlist) notFound();

  const canManage =
    shortlist.created_by === session.userId ||
    session.role === "tenant_admin" ||
    session.role === "super_admin";

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <Link
        href="/shortlists"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Shortlists
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">
            Shortlist · by {shortlist.creator_name}
          </div>
          <h1 className="mt-1 font-heading text-2xl text-primary">
            {shortlist.name}
          </h1>
          {shortlist.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {shortlist.description}
            </p>
          )}
        </div>
        <ShortlistActions shortlist={shortlist} canManage={canManage} />
      </div>

      <p className="text-sm text-muted-foreground">
        {shortlist.employees.length} employee
        {shortlist.employees.length === 1 ? "" : "s"}
      </p>

      {shortlist.employees.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card py-16 text-center">
          <p className="font-heading text-sm font-semibold text-primary">
            This shortlist is empty
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add people from the{" "}
            <Link href="/directory" className="text-sky underline-offset-2 hover:underline">
              directory
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {shortlist.employees.map((e) => (
            <EmployeeCard
              key={e.id}
              employee={e}
              action={
                canManage ? (
                  <RemoveMemberButton shortlistId={shortlist.id} employeeId={e.id!} />
                ) : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
