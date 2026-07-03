"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createShortlist } from "@/lib/actions/shortlists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function NewShortlistButton() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        New shortlist
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-primary">
              New shortlist
            </DialogTitle>
          </DialogHeader>
          <form
            action={(formData) => {
              startTransition(async () => {
                const res = await createShortlist(formData);
                if (res.error) toast.error(res.error);
                else {
                  toast.success("Shortlist created");
                  setOpen(false);
                }
              });
            }}
            className="space-y-3"
          >
            <Input name="name" placeholder="e.g. ADB expansion team" autoFocus required />
            <Input name="description" placeholder="Description (optional)" />
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
