"use client";

import { useRef, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteDepartment, upsertDepartment } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DepartmentsAdmin({
  departments,
}: {
  departments: { id: string; name: string; employee_count: number }[];
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="max-w-xl space-y-3">
      <form
        ref={formRef}
        action={(formData) =>
          startTransition(async () => {
            const res = await upsertDepartment(formData);
            if (res.error) toast.error(res.error);
            else {
              toast.success("Department added");
              formRef.current?.reset();
            }
          })
        }
        className="flex gap-2"
      >
        <Input name="name" placeholder="New department name" required className="h-9 bg-card" />
        <Button type="submit" disabled={pending}>
          <Plus className="size-4" />
          Add
        </Button>
      </form>

      <div className="divide-y rounded-lg border bg-card">
        {departments.map((d) => (
          <div key={d.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className="flex-1 text-sm font-medium">{d.name}</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {d.employee_count} employee{d.employee_count === 1 ? "" : "s"}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Delete ${d.name}`}
              className="text-muted-foreground hover:text-destructive"
              disabled={pending}
              onClick={() => {
                if (d.employee_count > 0) {
                  toast.error(`${d.name} still has employees assigned.`);
                  return;
                }
                if (!confirm(`Delete ${d.name}?`)) return;
                startTransition(async () => {
                  const res = await deleteDepartment(d.id);
                  if (res.error) toast.error(res.error);
                  else toast.success("Department deleted");
                });
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
