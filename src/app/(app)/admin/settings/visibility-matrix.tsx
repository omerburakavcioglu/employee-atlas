"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateVisibility } from "@/lib/actions/admin";
import { VISIBILITY_FIELDS } from "@/lib/visibility";
import { ROLE_LABELS, type AppRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROLES: AppRole[] = ["tenant_admin", "hr", "manager", "coordinator"];

export function VisibilityMatrix({
  settings,
}: {
  settings: { field_key: string; visible_to_roles: AppRole[] }[];
}) {
  const [pending, startTransition] = useTransition();
  const byKey = new Map(settings.map((s) => [s.field_key, s.visible_to_roles]));

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const res = await updateVisibility(formData);
          if (res.error) toast.error(res.error);
          else toast.success("Visibility settings saved");
        })
      }
      className="space-y-3"
    >
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Profile field</TableHead>
              {ROLES.map((r) => (
                <TableHead key={r} className="text-center">
                  {ROLE_LABELS[r]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {VISIBILITY_FIELDS.map(({ key, label }) => {
              const roles = byKey.get(key) ?? ROLES;
              return (
                <TableRow key={key}>
                  <TableCell className="font-medium">{label}</TableCell>
                  {ROLES.map((r) => (
                    <TableCell key={r} className="text-center">
                      <Checkbox
                        name={`${key}:${r}`}
                        defaultChecked={roles.includes(r)}
                        aria-label={`${label} visible to ${ROLE_LABELS[r]}`}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save visibility settings"}
      </Button>
    </form>
  );
}
