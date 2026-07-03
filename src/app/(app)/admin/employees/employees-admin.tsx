"use client";

import { useMemo, useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteEmployee, upsertEmployee } from "@/lib/actions/admin";
import {
  fullName,
  EDUCATION_LABELS,
  type DirectoryEmployee,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type Option = { id: string; name: string };

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className="h-8 text-sm"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs">
        {label}
      </Label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-8 w-full rounded-md border bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function EmployeesAdmin({
  employees,
  locations,
  departments,
}: {
  employees: DirectoryEmployee[];
  locations: (Option & { code: string })[];
  departments: Option[];
}) {
  const [editing, setEditing] = useState<DirectoryEmployee | null | "new">(null);
  const [search, setSearch] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) =>
      `${e.first_name} ${e.last_name} ${e.title} ${e.department_name}`
        .toLowerCase()
        .includes(q),
    );
  }, [employees, search]);

  const current = editing === "new" ? null : editing;

  function submit(formData: FormData) {
    startTransition(async () => {
      const res = await upsertEmployee(formData);
      if (res.error) toast.error(res.error);
      else {
        toast.success(editing === "new" ? "Employee created" : "Employee updated");
        setEditing(null);
      }
    });
  }

  function remove(e: DirectoryEmployee) {
    if (!confirm(`Delete ${fullName(e)}? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await deleteEmployee(e.id!);
      if (res.error) toast.error(res.error);
      else toast.success("Employee deleted");
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter employees…"
          className="h-8 w-64 bg-card text-sm"
        />
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus className="size-4" />
          Add employee
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-24" aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-heading font-semibold text-primary">
                  {fullName(e)}
                </TableCell>
                <TableCell className="text-muted-foreground">{e.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {e.department_name ?? "—"}
                </TableCell>
                <TableCell>
                  {e.location_code ? (
                    <span className="code-chip">{e.location_code}</span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {e.email ?? "—"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${fullName(e)}`}
                      onClick={() => setEditing(e)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${fullName(e)}`}
                      className="text-muted-foreground hover:text-destructive"
                      disabled={pending}
                      onClick={() => remove(e)}
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
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-primary">
              {editing === "new" ? "Add employee" : `Edit ${current ? fullName(current) : ""}`}
            </DialogTitle>
          </DialogHeader>
          <form action={submit} className="space-y-4">
            {current?.id && <input type="hidden" name="id" value={current.id} />}
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" name="first_name" defaultValue={current?.first_name} required />
              <Field label="Last name" name="last_name" defaultValue={current?.last_name} required />
              <Field label="Title" name="title" defaultValue={current?.title} />
              <SelectField
                label="Department"
                name="department_id"
                defaultValue={current?.department_id}
                options={departments.map((d) => ({ value: d.id, label: d.name }))}
              />
              <SelectField
                label="Location"
                name="location_id"
                defaultValue={current?.location_id}
                options={locations.map((l) => ({ value: l.id, label: `${l.code} — ${l.name}` }))}
              />
              <Field label="Email" name="email" type="email" defaultValue={current?.email} />
              <Field label="Phone" name="phone" defaultValue={current?.phone} />
              <Field label="Internal extension" name="internal_ext" defaultValue={current?.internal_ext} />
              <Field label="Manager name" name="manager_name" defaultValue={current?.manager_name} />
              <Field label="Start date" name="start_date" type="date" defaultValue={current?.start_date} />
              <SelectField
                label="Education level"
                name="education_level"
                defaultValue={current?.education_level}
                options={Object.entries(EDUCATION_LABELS).map(([value, label]) => ({ value, label }))}
              />
              <Field label="School" name="school" defaultValue={current?.school} />
              <Field label="Master's / PhD info" name="graduate_info" defaultValue={current?.graduate_info} />
              <Field label="Photo URL" name="photo_url" defaultValue={current?.photo_url} />
            </div>
            <div className="space-y-3">
              {(
                [
                  ["Skills", "skills", current?.skill_names],
                  ["Certifications", "certifications", current?.certification_names],
                  ["Languages", "languages", current?.language_names],
                  ["Hobbies", "hobbies", current?.hobby_names],
                  ["Expertise areas", "expertise_areas", current?.expertise_areas],
                  ["Tools & technologies", "tools_technologies", current?.tools_technologies],
                ] as const
              ).map(([label, name, values]) => (
                <div key={name} className="space-y-1.5">
                  <Label htmlFor={name} className="text-xs">
                    {label} <span className="text-muted-foreground">(comma-separated)</span>
                  </Label>
                  <Textarea
                    id={name}
                    name={name}
                    rows={2}
                    className="text-sm"
                    defaultValue={(values ?? []).join(", ")}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {editing === "new" ? "Create employee" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
