import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { fullName, initials, type DirectoryEmployee } from "@/lib/types";

export function EmployeeCard({
  employee,
  compact = false,
  action,
}: {
  employee: DirectoryEmployee;
  compact?: boolean;
  action?: React.ReactNode;
}) {
  const skills = employee.skill_names ?? [];
  const shown = skills.slice(0, compact ? 2 : 4);
  const more = skills.length - shown.length;

  return (
    <div className="group relative rounded-lg border bg-card p-4 transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_16px_color-mix(in_srgb,var(--primary)_8%,transparent)]">
      <div className="flex items-start gap-3">
        <Avatar className="size-11 border">
          {employee.photo_url && (
            <AvatarImage src={employee.photo_url} alt="" />
          )}
          <AvatarFallback className="bg-secondary font-heading text-xs font-bold text-primary">
            {initials(employee)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <Link
            href={`/employees/${employee.id}`}
            className="font-heading text-[15px] font-semibold text-foreground outline-none hover:text-sky focus-visible:text-sky"
          >
            {/* Stretched link: whole card clickable */}
            <span className="absolute inset-0" aria-hidden />
            {fullName(employee)}
          </Link>
          <p className="truncate text-[13px] text-muted-foreground">
            {employee.title}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {employee.location_code && (
              <span className="code-chip">{employee.location_code}</span>
            )}
            {employee.department_name && (
              <span className="text-xs text-muted-foreground">
                {employee.department_name}
              </span>
            )}
          </div>
        </div>
        {action && <div className="relative z-10">{action}</div>}
      </div>
      {shown.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {shown.map((s) => (
            <Badge
              key={s}
              variant="secondary"
              className="bg-secondary font-normal text-secondary-foreground"
            >
              {s}
            </Badge>
          ))}
          {more > 0 && (
            <Badge variant="outline" className="font-normal text-muted-foreground">
              +{more}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
