"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  Users,
  ListChecks,
  BarChart3,
  Settings2,
  LayoutList,
  LayoutDashboard,
  Flag,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  indent?: boolean;
};

const NAV: NavItem[] = [
  { href: "/", label: "Map", icon: Map, exact: true },
  { href: "/directory", label: "Directory", icon: Users },
  { href: "/shortlists", label: "Shortlists", icon: ListChecks },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

// Grup 43 is a bootcamp documentation workspace: its sidebar replaces the
// standard product nav with the Turkish sprint menu.
const GRUP43_NAV: NavItem[] = [
  { href: "/sprints", label: "Sprintler", icon: LayoutList, exact: true },
  { href: "/sprints/genel-board", label: "Sprint Planı", icon: LayoutDashboard },
  { href: "/sprints/sprint-1", label: "Sprint 1", icon: Flag, indent: true },
  { href: "/sprints/sprint-2", label: "Sprint 2", icon: Flag, indent: true },
  { href: "/sprints/sprint-3", label: "Sprint 3", icon: Flag, indent: true },
  { href: "/sprints/dokumantasyon", label: "Dokümantasyon", icon: FileText },
];

export function AppSidebar({
  role,
  tenantName,
  tenantSlug,
}: {
  role: AppRole;
  tenantName: string;
  tenantSlug: string | null;
}) {
  const pathname = usePathname();
  const isBootcamp = tenantSlug === "grup-43";

  let items: NavItem[];
  if (isBootcamp) {
    items = GRUP43_NAV;
  } else {
    items =
      role === "super_admin" || role === "tenant_admin" || role === "hr"
        ? [...NAV, { href: "/admin", label: "Admin", icon: Settings2 }]
        : NAV;
  }

  return (
    <aside className="flex w-14 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:w-[216px]">
      <div className="px-3 pb-6 pt-6 lg:px-5">
        <Link href="/" className="block">
          <span className="hidden font-heading text-[17px] font-bold tracking-tight text-white lg:block">
            Employee Atlas
          </span>
          <span className="block text-center font-heading text-[15px] font-bold text-white lg:hidden">
            EA
          </span>
          <span className="mt-0.5 hidden font-heading text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/90 lg:block">
            {tenantName}
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ href, label, icon: Icon, exact, indent }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "relative flex items-center justify-center gap-3 rounded-md px-3 py-2 font-heading text-[13px] font-semibold tracking-wide transition-colors lg:justify-start",
                "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-sidebar-primary before:transition-opacity lg:before:-left-3",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
                indent && "lg:pl-8",
                active
                  ? "bg-white/10 text-white before:opacity-100"
                  : "text-sidebar-foreground before:opacity-0 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hidden px-5 py-5 lg:block">
        <p className="text-[10px] leading-relaxed text-sidebar-foreground/70">
          Employee Atlas · MVP
        </p>
      </div>
    </aside>
  );
}
