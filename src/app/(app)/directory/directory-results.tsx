import Link from "next/link";
import {
  fullName,
  initials,
  tenure,
  EDUCATION_LABELS,
  type DirectoryEmployee,
} from "@/lib/types";
import { EmployeeCard } from "@/components/employee-card";
import { AddToShortlist } from "@/components/add-to-shortlist";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  employees: DirectoryEmployee[];
  view: "cards" | "list" | "table";
  shortlists: { id: string; name: string }[];
  userId: string;
};

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed bg-card py-16 text-center">
      <p className="font-heading text-sm font-semibold text-primary">
        No employees match these filters
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Try removing a filter or broadening your search.
      </p>
    </div>
  );
}

export function DirectoryResults({ employees, view, shortlists }: Props) {
  if (employees.length === 0) return <EmptyState />;

  if (view === "cards") {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {employees.map((e) => (
          <EmployeeCard
            key={e.id}
            employee={e}
            action={<AddToShortlist employeeId={e.id!} shortlists={shortlists} />}
          />
        ))}
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="divide-y rounded-lg border bg-card">
        {employees.map((e) => (
          <div
            key={e.id}
            className="group relative flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent/50"
          >
            <Avatar className="size-9 border">
              {e.photo_url && <AvatarImage src={e.photo_url} alt="" />}
              <AvatarFallback className="bg-secondary font-heading text-[11px] font-bold text-primary">
                {initials(e)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <Link
                href={`/employees/${e.id}`}
                className="font-heading text-sm font-semibold hover:text-sky"
              >
                <span className="absolute inset-0" aria-hidden />
                {fullName(e)}
              </Link>
              <p className="truncate text-xs text-muted-foreground">
                {e.title} · {e.department_name}
              </p>
            </div>
            <span className="code-chip">{e.location_code}</span>
            <span className="hidden w-24 text-right text-xs text-muted-foreground tabular-nums sm:block">
              {tenure(e.start_date) ?? "—"}
            </span>
            <div className="relative z-10">
              <AddToShortlist employeeId={e.id!} shortlists={shortlists} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Education</TableHead>
            <TableHead>Tenure</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead aria-label="Actions" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                <Link
                  href={`/employees/${e.id}`}
                  className="font-heading font-semibold text-primary hover:text-sky"
                >
                  {fullName(e)}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{e.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {e.department_name}
              </TableCell>
              <TableCell>
                <span className="code-chip">{e.location_code}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {e.education_level ? EDUCATION_LABELS[e.education_level] : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {tenure(e.start_date) ?? "—"}
              </TableCell>
              <TableCell>
                <div className="flex max-w-56 flex-wrap gap-1">
                  {(e.skill_names ?? []).slice(0, 2).map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                  {(e.skill_names ?? []).length > 2 && (
                    <Badge variant="outline" className="font-normal text-muted-foreground">
                      +{(e.skill_names ?? []).length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <AddToShortlist employeeId={e.id!} shortlists={shortlists} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
