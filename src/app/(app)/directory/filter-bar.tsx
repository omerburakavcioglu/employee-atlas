"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { smartSearch } from "@/lib/actions/ai-search";
import type { FilterOptions } from "@/lib/queries/directory";
import { EDUCATION_LABELS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CLEAR = "__all__";

function FilterSelect({
  param,
  placeholder,
  items,
}: {
  param: string;
  placeholder: string;
  items: { value: string; label: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(param) ?? "";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value === CLEAR) params.delete(param);
    else params.set(param, value);
    router.push(`/directory?${params.toString()}`);
  }

  return (
    <Select value={current} onValueChange={onChange}>
      <SelectTrigger
        size="sm"
        className="w-auto min-w-28 bg-card text-xs"
        aria-label={placeholder}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={CLEAR}>All {placeholder.toLowerCase()}</SelectItem>
        {items.map((i) => (
          <SelectItem key={i.value} value={i.value}>
            {i.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Natural-language search. The result is written into the same query string the
// manual filters use, so the chips below show exactly what was applied and the
// user can drop any one of them.
function SmartSearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();

  function run() {
    const query = value.trim();
    if (!query || pending) return;
    startTransition(async () => {
      const { filters, source, error } = await smartSearch(query);
      const params = new URLSearchParams();
      for (const [key, v] of Object.entries(filters)) {
        if (v !== undefined && v !== null && v !== "") params.set(key, String(v));
      }
      if (error) toast.error(error);
      else if (params.size === 0)
        toast.info("Bu sorgudan bir filtre çıkarılamadı.");
      else if (source === "rules")
        toast.success("Filtreler uygulandı (kural tabanlı).");
      router.push(`/directory?${params.toString()}`);
    });
  }

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles className="size-4 shrink-0 text-primary" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") run();
          }}
          disabled={pending}
          placeholder="Doğal dille ara: “İzmir'de 5G bilen kıdemli mühendis”"
          className="h-8 min-w-0 flex-1 bg-card text-xs"
          aria-label="Doğal dil araması"
        />
        <Button size="sm" className="h-8 text-xs" onClick={run} disabled={pending}>
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Sparkles className="size-3.5" />
          )}
          Akıllı ara
        </Button>
      </div>
    </div>
  );
}

const FILTER_LABELS: Record<string, string> = {
  q: "Search",
  location: "Location",
  country: "Country",
  department: "Department",
  skill: "Skill",
  language: "Language",
  hobby: "Hobby",
  certification: "Certification",
  education: "Education",
  minYears: "Tenure",
};

export function FilterBar({ options }: { options: FilterOptions }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const names = (arr: string[]) => arr.map((n) => ({ value: n, label: n }));

  // Resolve id-backed filters (location, department) to display labels.
  const valueLabel = (key: string, value: string): string => {
    if (key === "location")
      return options.locations.find((l) => l.id === value)?.name ?? value;
    if (key === "department")
      return options.departments.find((d) => d.id === value)?.name ?? value;
    if (key === "education")
      return EDUCATION_LABELS[value as keyof typeof EDUCATION_LABELS] ?? value;
    if (key === "minYears") return `${value}+ years`;
    return value;
  };

  const activeChips = [
    "q", "location", "country", "department", "skill",
    "language", "hobby", "certification", "education", "minYears",
  ]
    .map((key) => ({ key, value: searchParams.get(key) }))
    .filter((f): f is { key: string; value: string } => !!f.value);

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    router.push(`/directory?${params.toString()}`);
  }

  return (
    <div className="space-y-2">
      <SmartSearchBar />
      <div className="rounded-lg border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          defaultValue={q}
          key={q}
          placeholder="Search name, title, skill, project…"
          className="h-8 w-56 bg-card text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const params = new URLSearchParams(searchParams);
              const value = (e.target as HTMLInputElement).value.trim();
              if (value) params.set("q", value);
              else params.delete("q");
              router.push(`/directory?${params.toString()}`);
            }
          }}
        />
        <FilterSelect
          param="location"
          placeholder="Locations"
          items={options.locations.map((l) => ({
            value: l.id,
            label: `${l.code} — ${l.name}`,
          }))}
        />
        <FilterSelect
          param="country"
          placeholder="Countries"
          items={names(options.countries)}
        />
        <FilterSelect
          param="department"
          placeholder="Departments"
          items={options.departments.map((d) => ({ value: d.id, label: d.name }))}
        />
        <FilterSelect param="skill" placeholder="Skills" items={names(options.skills)} />
        <FilterSelect
          param="education"
          placeholder="Education"
          items={Object.entries(EDUCATION_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <FilterSelect
          param="language"
          placeholder="Languages"
          items={names(options.languages)}
        />
        <FilterSelect param="hobby" placeholder="Hobbies" items={names(options.hobbies)} />
        <FilterSelect
          param="certification"
          placeholder="Certifications"
          items={names(options.certifications)}
        />
        <FilterSelect
          param="minYears"
          placeholder="Tenure"
          items={[1, 3, 5, 10].map((y) => ({
            value: String(y),
            label: `${y}+ years`,
          }))}
        />
        {activeChips.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground"
            onClick={() => router.push("/directory")}
          >
            <X className="size-3.5" />
            Clear all
          </Button>
        )}
      </div>

      {activeChips.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t pt-2.5">
          {activeChips.map(({ key, value }) => (
            <button
              key={key}
              type="button"
              onClick={() => removeFilter(key)}
              className="group inline-flex items-center gap-1 rounded-full bg-secondary py-1 pl-2.5 pr-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
            >
              <span className="text-secondary-foreground/60">{FILTER_LABELS[key]}:</span>
              {valueLabel(key, value)}
              <X className="size-3 text-secondary-foreground/50 transition-colors group-hover:text-secondary-foreground" />
            </button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
