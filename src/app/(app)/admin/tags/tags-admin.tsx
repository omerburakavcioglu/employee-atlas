"use client";

import { useRef, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { addVocabItem, deleteVocabItem, type VocabTable } from "@/lib/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Item = { id: string; name: string };

const TABS: { table: VocabTable; label: string }[] = [
  { table: "skills", label: "Skills" },
  { table: "certifications", label: "Certifications" },
  { table: "languages", label: "Languages" },
  { table: "hobbies", label: "Hobbies" },
];

function VocabPanel({ table, items }: { table: VocabTable; items: Item[] }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="space-y-4">
      <form
        ref={formRef}
        action={(formData) =>
          startTransition(async () => {
            const res = await addVocabItem(table, String(formData.get("name") ?? ""));
            if (res.error) toast.error(res.error);
            else {
              toast.success("Tag added");
              formRef.current?.reset();
            }
          })
        }
        className="flex max-w-md gap-2"
      >
        <Input name="name" placeholder={`New ${table.slice(0, -1)}…`} required className="h-9 bg-card" />
        <Button type="submit" disabled={pending}>
          <Plus className="size-4" />
          Add
        </Button>
      </form>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item.id} variant="secondary" className="gap-1 py-1 pl-2.5 pr-1 font-normal">
            {item.name}
            <button
              type="button"
              aria-label={`Delete ${item.name}`}
              className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring"
              disabled={pending}
              onClick={() => {
                if (!confirm(`Delete “${item.name}”? It will be removed from all employees.`)) return;
                startTransition(async () => {
                  const res = await deleteVocabItem(table, item.id);
                  if (res.error) toast.error(res.error);
                });
              }}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No tags yet.</p>
        )}
      </div>
    </div>
  );
}

export function TagsAdmin({
  vocabularies,
}: {
  vocabularies: Record<VocabTable, Item[]>;
}) {
  return (
    <Tabs defaultValue="skills">
      <TabsList>
        {TABS.map((t) => (
          <TabsTrigger key={t.table} value={t.table}>
            {t.label}
            <span className="ml-1 text-xs text-muted-foreground tabular-nums">
              {vocabularies[t.table].length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((t) => (
        <TabsContent key={t.table} value={t.table} className="pt-3">
          <VocabPanel table={t.table} items={vocabularies[t.table]} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
