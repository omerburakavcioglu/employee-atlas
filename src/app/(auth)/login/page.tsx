import { Suspense } from "react";
import { Map, Search, ListChecks } from "lucide-react";
import { BrandMark, BrandLockup } from "@/components/brand/brand-logo";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

const VALUE_PROPS = [
  {
    icon: Map,
    title: "Map your workforce",
    body: "See every office, branch, and site on one live map, with headcount at a glance.",
  },
  {
    icon: Search,
    title: "Discover by skill and location",
    body: "Search and filter people across departments, skills, languages, and tenure.",
  },
  {
    icon: ListChecks,
    title: "Build project shortlists",
    body: "Assemble candidate lists for a project or role, then export and share them.",
  },
];

// Shared, tenant-neutral login. Tenant branding is applied after
// authentication, once the user's workspace is known.
export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Brand panel */}
      <div className="relative hidden w-[46%] flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        {/* Icon only: the wordmark is carried by the display type below.
            `self-start` keeps the flex column from stretching it to panel width. */}
        <BrandMark tone="white" priority className="h-11 w-auto self-start" />

        <div>
          <h1 className="font-heading text-5xl leading-[1.08] tracking-tight">
            Employee
            <br />
            Atlas
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-primary-foreground/75">
            Workforce intelligence for multi-location companies.
          </p>

          <ul className="mt-10 max-w-sm space-y-6">
            {VALUE_PROPS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3.5">
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15"
                >
                  <Icon className="size-4.5 text-primary-foreground/90" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-heading text-[14px] font-semibold leading-tight">
                    {title}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-primary-foreground/65">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Airports", "Telecom", "Retail", "Manufacturing", "Logistics"].map(
            (industry) => (
              <span
                key={industry}
                className="rounded border border-white/15 px-2 py-1 font-heading text-[11px] font-bold tracking-[0.1em] uppercase text-primary-foreground/75"
              >
                {industry}
              </span>
            ),
          )}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center justify-between">
            <BrandLockup tone="color" priority className="h-9 w-auto" />
            <span className="eyebrow">Sign in</span>
          </div>
          <h2 className="font-heading text-2xl text-primary">Welcome back</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in with your company account. Your workspace loads
            automatically.
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>

          <div className="mt-8 rounded-lg border border-dashed bg-card/50 p-4">
            <p className="eyebrow">Try the demo</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Use{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
                tav.manager@demo.com
              </code>{" "}
              or{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
                turkcell.manager@demo.com
              </code>{" "}
              with password{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
                AtlasDemo2026!
              </code>{" "}
              to explore either tenant workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
