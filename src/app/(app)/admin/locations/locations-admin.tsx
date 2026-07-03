"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteLocation, upsertLocation } from "@/lib/actions/admin";
import type { LocationWithCount } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LocationsAdmin({ locations }: { locations: LocationWithCount[] }) {
  const [editing, setEditing] = useState<LocationWithCount | null | "new">(null);
  const [pending, startTransition] = useTransition();
  const current = editing === "new" ? null : editing;

  function submit(formData: FormData) {
    startTransition(async () => {
      const res = await upsertLocation(formData);
      if (res.error) toast.error(res.error);
      else {
        toast.success(editing === "new" ? "Location created" : "Location updated");
        setEditing(null);
      }
    });
  }

  function remove(l: LocationWithCount) {
    if ((l.employee_count ?? 0) > 0) {
      toast.error(`${l.name} still has ${l.employee_count} employees. Reassign them first.`);
      return;
    }
    if (!confirm(`Delete ${l.name}?`)) return;
    startTransition(async () => {
      const res = await deleteLocation(l.id!);
      if (res.error) toast.error(res.error);
      else toast.success("Location deleted");
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus className="size-4" />
          Add location
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Employees</TableHead>
              <TableHead className="w-24" aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((l) => (
              <TableRow key={l.id}>
                <TableCell>
                  <span className="code-chip">{l.code}</span>
                </TableCell>
                <TableCell className="font-heading font-semibold text-primary">
                  {l.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{l.city}</TableCell>
                <TableCell className="text-muted-foreground">{l.country}</TableCell>
                <TableCell className="capitalize text-muted-foreground">{l.type}</TableCell>
                <TableCell className="text-right tabular-nums">{l.employee_count}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label={`Edit ${l.name}`} onClick={() => setEditing(l)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${l.name}`}
                      className="text-muted-foreground hover:text-destructive"
                      disabled={pending}
                      onClick={() => remove(l)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-primary">
              {editing === "new" ? "Add location" : `Edit ${current?.name}`}
            </DialogTitle>
          </DialogHeader>
          <form action={submit} className="space-y-4">
            {current?.id && <input type="hidden" name="id" value={current.id} />}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="name" className="text-xs">Name</Label>
                <Input id="name" name="name" defaultValue={current?.name ?? ""} required className="h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="code" className="text-xs">Code (IATA-style)</Label>
                <Input id="code" name="code" defaultValue={current?.code ?? ""} required maxLength={8} className="h-8 text-sm uppercase" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs">Type</Label>
                <select
                  id="type"
                  name="type"
                  defaultValue={current?.type ?? "airport"}
                  className="h-8 w-full rounded-md border bg-transparent px-2 text-sm"
                >
                  <option value="airport">Airport</option>
                  <option value="office">Office</option>
                  <option value="hq">HQ</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-xs">City</Label>
                <Input id="city" name="city" defaultValue={current?.city ?? ""} required className="h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country" className="text-xs">Country</Label>
                <Input id="country" name="country" defaultValue={current?.country ?? ""} required className="h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lat" className="text-xs">Latitude</Label>
                <Input id="lat" name="lat" type="number" step="any" defaultValue={current?.lat ?? ""} required className="h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lng" className="text-xs">Longitude</Label>
                <Input id="lng" name="lng" type="number" step="any" defaultValue={current?.lng ?? ""} required className="h-8 text-sm" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {editing === "new" ? "Create location" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
