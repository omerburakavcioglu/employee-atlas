"use client";

import { useState, useTransition } from "react";
import { ListPlus, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { addToShortlist, createShortlist } from "@/lib/actions/shortlists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AddToShortlist({
  employeeId,
  shortlists,
}: {
  employeeId: string;
  shortlists: { id: string; name: string }[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function add(shortlistId: string, name: string) {
    startTransition(async () => {
      const res = await addToShortlist(shortlistId, employeeId);
      if (res.error) toast.error(res.error);
      else toast.success(`Added to “${name}”`, { icon: <Check className="size-4" /> });
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Add to shortlist"
            className="text-muted-foreground hover:text-primary"
          >
            <ListPlus className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Add to shortlist</DropdownMenuLabel>
          {shortlists.length > 0 && (
            <>
              {shortlists.map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  disabled={pending}
                  onClick={() => add(s.id, s.name)}
                >
                  {s.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            New shortlist…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-primary">
              New shortlist
            </DialogTitle>
          </DialogHeader>
          <form
            action={(formData) => {
              formData.set("employeeId", employeeId);
              startTransition(async () => {
                const res = await createShortlist(formData);
                if (res.error) toast.error(res.error);
                else {
                  toast.success("Shortlist created");
                  setDialogOpen(false);
                }
              });
            }}
            className="space-y-3"
          >
            <Input name="name" placeholder="e.g. ADB expansion team" autoFocus required />
            <Input name="description" placeholder="Description (optional)" />
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                Create & add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
