"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { DirectoryEmployee, LocationWithCount } from "@/lib/types";
import { EmployeeCard } from "@/components/employee-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Fetches and renders the employee list for one location. Keyed by
// location.id from the parent so React remounts (fresh state) on location
// change, instead of resetting state imperatively inside the effect.
function LocationEmployeeList({ location }: { location: LocationWithCount }) {
  const [employees, setEmployees] = useState<DirectoryEmployee[] | null>(null);

  useEffect(() => {
    if (!location.id || !location.tenant_id) return;
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("employee_directory")
      .select("*")
      // location is already tenant-scoped by the server query that produced
      // it; tenant_id here is defense in depth, consistent with the rest of
      // the query layer.
      .eq("location_id", location.id)
      .eq("tenant_id", location.tenant_id)
      .order("last_name")
      .then(({ data }) => {
        if (!cancelled) setEmployees(data ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [location.id, location.tenant_id]);

  if (employees === null) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  if (employees.length === 0) {
    return (
      <p className="pt-8 text-center text-sm text-muted-foreground">
        No employees recorded here yet. Add them from the admin panel.
      </p>
    );
  }

  const byDepartment = new Map<string, number>();
  for (const e of employees) {
    const name = e.department_name ?? "Unassigned";
    byDepartment.set(name, (byDepartment.get(name) ?? 0) + 1);
  }
  const departments = [...byDepartment.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      {departments.length > 1 && (
        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="eyebrow">Department breakdown</p>
          <ul className="mt-2 space-y-1.5">
            {departments.map(([name, count]) => (
              <li key={name} className="flex items-center gap-2 text-xs">
                <span className="min-w-0 flex-1 truncate text-foreground">{name}</span>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(count / employees.length) * 100}%` }}
                  />
                </div>
                <span className="w-5 shrink-0 text-right font-medium tabular-nums text-muted-foreground">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {employees.map((e) => (
        <EmployeeCard key={e.id} employee={e} compact />
      ))}
    </div>
  );
}

export function LocationSheet({
  location,
  onClose,
}: {
  location: LocationWithCount | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!location} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="code-chip">{location?.code}</span>
            <span className="eyebrow">
              {location?.city}, {location?.country}
            </span>
          </div>
          <SheetTitle className="font-heading text-lg text-primary">
            {location?.name}
          </SheetTitle>
          <SheetDescription>
            {location?.employee_count ?? 0} employee
            {(location?.employee_count ?? 0) === 1 ? "" : "s"} at this location
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {location && <LocationEmployeeList key={location.id} location={location} />}
        </div>
        {location && (
          <div className="border-t p-4">
            <Button asChild variant="outline" className="w-full">
              <Link href={`/directory?location=${location.id}`}>
                Open in directory
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
