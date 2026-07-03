import { Suspense } from "react";
import {
  searchDirectory,
  getFilterOptions,
  type DirectoryFilters,
} from "@/lib/queries/directory";
import { getSessionProfile } from "@/lib/queries/session";
import { getMyShortlists } from "@/lib/queries/shortlists";
import { FilterBar } from "./filter-bar";
import { DirectoryResults } from "./directory-results";
import { ViewSwitcher, type ViewKey } from "@/components/view-switcher";

export const metadata = { title: "Directory" };

type SearchParams = { [key: string]: string | string[] | undefined };

function str(v: string | string[] | undefined): string | undefined {
  return typeof v === "string" && v !== "" ? v : undefined;
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const view = (str(params.view) ?? "cards") as Exclude<ViewKey, "map">;
  const filters: DirectoryFilters = {
    q: str(params.q),
    location: str(params.location),
    country: str(params.country),
    department: str(params.department),
    skill: str(params.skill),
    language: str(params.language),
    hobby: str(params.hobby),
    certification: str(params.certification),
    education: str(params.education),
    minYears: str(params.minYears) ? Number(str(params.minYears)) : undefined,
  };

  const [employees, options, session, myShortlists] = await Promise.all([
    searchDirectory(filters),
    getFilterOptions(),
    getSessionProfile(),
    getMyShortlists(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">Talent inventory</div>
          <h1 className="mt-1 font-heading text-2xl text-primary">
            Employee directory
          </h1>
        </div>
        <Suspense>
          <ViewSwitcher current={view} />
        </Suspense>
      </div>

      <Suspense>
        <FilterBar options={options} />
      </Suspense>

      <p className="text-sm text-muted-foreground">
        {employees.length} employee{employees.length === 1 ? "" : "s"} found
      </p>

      <DirectoryResults
        employees={employees}
        view={view}
        shortlists={myShortlists}
        userId={session.userId}
      />
    </div>
  );
}
