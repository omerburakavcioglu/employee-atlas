"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { ROLE_LABELS, type AppRole, type Tenant } from "@/lib/types";
import { BrandMark } from "@/components/brand/brand-logo";
import { TenantLogo } from "@/components/tenant/TenantLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader({
  fullName,
  email,
  role,
  tenant,
}: {
  fullName: string;
  email: string;
  role: AppRole;
  tenant: Tenant | null;
}) {
  const router = useRouter();
  const initials = fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="relative z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-card px-5 shadow-[0_1px_0_color-mix(in_srgb,var(--primary)_4%,transparent)]">
      {/* Product mark stays monochrome so it co-exists with any tenant palette. */}
      <span className="flex shrink-0 items-center gap-2">
        <BrandMark tone="navy" className="h-6 w-auto" />
        <span className="hidden font-heading text-[15px] font-bold tracking-tight text-primary md:block">
          Employee Atlas
        </span>
      </span>
      <div className="mx-1 hidden h-6 w-px bg-border md:block" />
      <TenantLogo tenant={tenant} className="shrink-0" />
      <div className="mx-2 h-6 w-px bg-border" />
      <form
        className="relative w-full max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          const qEl = e.currentTarget.elements.namedItem("q") as HTMLInputElement;
          router.push(`/directory?q=${encodeURIComponent(qEl.value)}`);
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          name="q"
          placeholder="Search people, skills, locations…"
          className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-input focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      </form>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden rounded-full border border-border bg-secondary px-2.5 py-0.5 font-heading text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary-foreground sm:block">
          {ROLE_LABELS[role]}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <Avatar className="size-8 border">
              <AvatarFallback className="bg-secondary font-heading text-[11px] font-bold text-primary">
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{fullName}</div>
              <div className="text-xs font-normal text-muted-foreground">
                {email}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/directory">Directory</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
