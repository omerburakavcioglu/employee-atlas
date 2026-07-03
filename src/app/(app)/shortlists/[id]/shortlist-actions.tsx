"use client";

import { useTransition } from "react";
import { Download, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { deleteShortlist, removeFromShortlist } from "@/lib/actions/shortlists";
import { tenure, type DirectoryEmployee, type Shortlist } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function ShortlistActions({
  shortlist,
  canManage,
}: {
  shortlist: Shortlist & { employees: DirectoryEmployee[] };
  canManage: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function exportCsv() {
    const header = [
      "First name", "Last name", "Title", "Department", "Location",
      "Country", "Email", "Phone", "Tenure", "Skills", "Languages",
    ];
    const rows = shortlist.employees.map((e) => [
      e.first_name, e.last_name, e.title, e.department_name,
      e.location_name, e.location_country, e.email, e.phone,
      tenure(e.start_date) ?? "",
      (e.skill_names ?? []).join("; "),
      (e.language_names ?? []).join("; "),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map(csvEscape).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${shortlist.name.replace(/[^\w-]+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Shortlist exported as CSV");
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={exportCsv} disabled={shortlist.employees.length === 0}>
        <Download className="size-4" />
        Export CSV
      </Button>
      {canManage && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              <Trash2 className="size-4" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete this shortlist?</DialogTitle>
              <DialogDescription>
                “{shortlist.name}” will be removed for everyone. Employee
                records are not affected.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteShortlist(shortlist.id);
                  })
                }
              >
                Delete shortlist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export function RemoveMemberButton({
  shortlistId,
  employeeId,
}: {
  shortlistId: string;
  employeeId: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Remove from shortlist"
      className="text-muted-foreground hover:text-destructive"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await removeFromShortlist(shortlistId, employeeId);
          toast.success("Removed from shortlist");
        })
      }
    >
      <X className="size-4" />
    </Button>
  );
}
