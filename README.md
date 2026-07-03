# Employee Atlas

Employee Atlas is a multi-tenant B2B SaaS platform that helps large,
multi-location companies — holdings, airport operators, telecom companies,
retail chains, factories, and similar organizations — discover, manage, and
understand their workforce across cities, countries, offices, airports,
branches, and campuses.

Every company logs in through the same shared login page. After
authentication, users see only their own company's workspace: employees,
locations, branding, and role-based permissions. The map-first dashboard,
searchable directory, shortlists, and analytics all operate on the logged-in
user's tenant only.

Seeded demo tenants: **TAV Airports** (airport operations) and **Turkcell**
(telecommunications and technology).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui ·
Supabase (Postgres, Auth, Storage, RLS) · Leaflet/OpenStreetMap · Recharts

## Getting started

```bash
npm install
supabase start        # local Supabase stack (requires Docker)
supabase db reset     # apply migrations + seed data (local only — see below)
npm run dev           # http://localhost:3000
```

`supabase db reset` drops and recreates the **local** database, then reapplies
every migration in `supabase/migrations/` and reseeds from `supabase/seed.sql`.
It is safe to run repeatedly during development; it only ever touches the
Docker-hosted local Postgres instance started by `supabase start`, never a
remote/cloud project. Run it any time the schema or seed data changes, or to
reset demo data back to its original state.

`.env.local` points at the local Supabase stack. For a cloud project, replace
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY`, then run the migrations with `supabase db push`
(review the seed data before pushing — it is meant for local demos, not
production).

## Demo accounts (seeded)

Development-only password for every account: `AtlasDemo2026!`

| Email | Tenant | Role |
| --- | --- | --- |
| tav.admin@demo.com | TAV Airports | Tenant Admin |
| tav.hr@demo.com | TAV Airports | HR |
| tav.manager@demo.com | TAV Airports | Manager |
| turkcell.admin@demo.com | Turkcell | Tenant Admin |
| turkcell.hr@demo.com | Turkcell | HR |
| turkcell.manager@demo.com | Turkcell | Manager |
| superadmin@demo.com | — (platform) | Super Admin (development only) |

## Multi-tenancy

**Data model.** A `tenants` table holds company identity and theme tokens
(display name, industry, logo, primary/secondary/accent/background/text
colors). Every tenant-owned table — `profiles`, `employees`, `locations`,
`departments`, `skills`, `certifications`, `languages`, `hobbies`,
`shortlists`, `shortlist_employees`, `field_visibility_settings`,
`audit_logs` — carries a `tenant_id` foreign key.

**Isolation layers, defense in depth:**
1. **Row Level Security** is the primary boundary. Every table has RLS
   enabled; read/write policies check `tenant_id = current_tenant_id()`
   (a security-definer function reading the caller's profile). `super_admin`
   policies bypass the tenant check and can read/write any tenant directly at
   the database layer — this is deliberate platform-operator power, not a
   bug.
2. **Composite foreign keys** additionally prevent cross-tenant references
   regardless of RLS: an employee's `department_id`/`location_id` must belong
   to the same `tenant_id`, and `shortlist_employees` requires both the
   shortlist and the employee to share the link row's tenant. These held even
   against a direct superuser insert in testing (see QA results below).
3. **App-layer scoping.** Every query and server action additionally filters
   by `tenant_id` explicitly (via `getTenantContext()` in
   `src/lib/queries/session.ts`), so isolation does not depend on RLS alone.
   Server actions that use the Supabase service-role client (bulk import, tag
   vocabulary sync) — which bypasses RLS entirely — re-check role and tenant
   in the app layer before touching data.

**Tenant resolution.** Normal users' tenant comes from their `profiles` row
and cannot be changed by the user; a database trigger blocks tenant
reassignment by anyone except `super_admin`. `super_admin` has no tenant of
its own; in development only, it may pin a tenant context via a
non-production `ea-dev-tenant` cookie (no UI — this is a stopgap for testing,
not a real tenant switcher). Without a pinned tenant, `super_admin` can read
across all tenants but every write action is refused ("No tenant context").

**Theming.** `src/lib/tenant-config.ts` holds hand-tuned theme presets per
tenant slug; `src/lib/tenant-theme.ts` derives a theme from a tenant's stored
colors for any tenant without a preset. `TenantThemeProvider` renders the
active tenant's CSS variables as a `<style>` tag inside the authenticated
layout only — the shared login page always shows the neutral, tenant-less
default theme.

## Tenant details

### TAV Airports
- Industry: Airport Operations
- Theme: navy `#031F73` / sky blue `#307FE2` / amber `#FAA634` accent
  (Pantone 2748C / 2727C corporate palette)
- 10 locations: HQ (Istanbul) plus airports in Ankara, Izmir, Antalya,
  Bodrum, Tbilisi, Batumi, Skopje, Almaty, Madinah
- 8 departments, 50 employees, 2 demo shortlists
- Roles in use: Tenant Admin, HR, Manager

### Turkcell
- Industry: Telecommunications and Technology
- Theme: deep blue `#00457C` / sky `#0082CA` / signature yellow `#FFC900`
  accent (telecom enterprise dashboard feel; no official Turkcell logo —
  text-based tenant mark only)
- 14 locations: Küçükyalı HQ and Gebze data center (Istanbul area) plus
  regional offices in Ankara, Izmir, Bursa, Antalya, Adana, Trabzon,
  Diyarbakır, Erzurum, Gaziantep, Kayseri, Samsun, Konya
- 13 departments (Network Operations, Software/Backend/Frontend Engineering,
  Data & AI, Cybersecurity, Cloud Infrastructure, Customer Experience,
  Enterprise Sales, Product Management, HR, Finance, Field Operations)
- 80 employees with realistic Turkish names and telecom/software titles,
  varied skills (5G, RAN, Kubernetes, Java/Go/React, SOC operations, etc.),
  certifications, languages, and hobbies
- Roles in use: Tenant Admin, HR, Manager

## Features

- **Map dashboard** (default screen): location pins with employee counts;
  clicking a pin opens a panel with employee cards. Pin colors and the
  overall palette follow the active tenant's theme.
- **Directory**: full-text search + filters (location, country, department,
  skill, education, language, hobby, certification, tenure) with card / list /
  table views. Filter option lists are tenant-scoped — a TAV user never sees
  a Turkcell department or skill in a dropdown, and vice versa.
- **Employee profiles**: contact, education, skills, certifications,
  languages, projects, tools, hobbies — sections respect field-visibility
  settings. Opening another tenant's employee ID directly returns 404.
- **Shortlists**: any role can build project shortlists from the directory
  and export them as CSV. Shortlists and their membership are tenant-scoped;
  a cross-tenant shortlist URL returns 404, and adding a cross-tenant
  employee to a shortlist is rejected by both RLS and a database constraint.
- **Analytics**: workforce KPIs and distributions styled with the active
  tenant's chart palette.
- **Admin panel** (Tenant Admin/HR only): CRUD for employees, locations,
  departments, and tag vocabularies; CSV/Excel import with validation preview
  (see `sample-import.csv`); per-role field-visibility matrix. All writes are
  scoped to the acting user's own tenant.

## Roles & access

All roles operate within their own tenant only; no role can switch tenants.

| | Read directory | Manage shortlists | Manage data (admin panel) | Audit log |
| --- | --- | --- | --- | --- |
| Super Admin (platform, dev only) | ✓ (all tenants) | ✓ (all) | ✓ (with pinned tenant only) | ✓ (all tenants) |
| Tenant Admin | ✓ | ✓ (all in tenant) | ✓ | ✓ (own tenant) |
| HR | ✓ | ✓ (own) | ✓ | — |
| Manager | ✓ | ✓ (own) | — | — |
| Technical Coordinator | ✓ | ✓ (own) | — | — |

Employees do not log in during the MVP; they exist as profile records only.
Sensitive personal data (age, marital status, children, home address, salary,
performance, health) is deliberately not modeled.

## Known limitations

- **No production tenant switcher.** `super_admin`'s tenant pin is a
  development-only cookie with no UI; a real switcher (with audit trail) is
  planned for a later phase.
- **Storage bucket is not tenant-partitioned.** Employee photos share one
  public bucket; URLs aren't namespaced per tenant. Low risk today since
  photos are placeholder images, but should be revisited before real photo
  uploads are supported.
- **`super_admin` bypasses tenant checks at the RLS layer by design** — a
  raw API request with a super_admin token can read or write any tenant's
  data directly, even though the app's own UI and server actions add a
  stricter "must have a pinned tenant" guard for writes. This is intentional
  platform-operator capability, not a gap, but it means the RLS layer alone
  is not a boundary against a compromised super_admin credential.
- **New user signups without tenant metadata fail** the profile-creation
  trigger. There is no self-serve signup flow in this MVP, so this hasn't
  mattered yet, but it would need addressing before adding one.
- **Employee self-service is out of scope** for this MVP; employees are
  managed as records by tenant staff only.

## Next planned phases

- A real tenant switcher for `super_admin`, with audit logging of tenant
  context changes.
- Tenant-scoped storage paths for employee photos.
- Self-serve tenant signup / onboarding flow.
- Employee self-service accounts (optional, future).

## Brand

The product name is always **Employee Atlas**, regardless of tenant. Tenant
identity (logo or text mark, and color theme) is applied only inside the
authenticated app shell — the shared login page stays neutral. See
"Tenant details" above for each seeded tenant's palette.
