"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Dist = { name: string; count: number }[];

// Tenant chart palette: primary, sky, then secondary accents (set per
// tenant by TenantThemeProvider; SVG resolves the CSS variables).
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="gap-3 py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle className="eyebrow">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-56 px-2">{children}</CardContent>
    </Card>
  );
}

function HBar({ data, color = "var(--chart-1)" }: { data: Dist; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={148}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
        />
        <Tooltip
          cursor={{ fill: "color-mix(in srgb, var(--primary) 4%, transparent)" }}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid var(--border)",
            fontSize: 12,
            boxShadow: "0 4px 16px color-mix(in srgb, var(--primary) 8%, transparent)",
          }}
        />
        <Bar dataKey="count" fill={color} radius={[0, 4, 4, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AnalyticsCharts({
  kpis,
  departmentDist,
  educationDist,
  topSkills,
  topCerts,
  languageDist,
  topLocations,
}: {
  kpis: {
    employees: number;
    locations: number;
    departments: number;
    completeness: number;
  };
  departmentDist: Dist;
  educationDist: Dist;
  topSkills: Dist;
  topCerts: Dist;
  languageDist: Dist;
  topLocations: Dist;
}) {
  const kpiItems = [
    { label: "Employees", value: kpis.employees },
    { label: "Locations", value: kpis.locations },
    { label: "Departments", value: kpis.departments },
    { label: "Avg. profile completeness", value: `${kpis.completeness}%` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpiItems.map((k) => (
          <div key={k.label} className="rounded-lg border bg-card px-4 py-4">
            <div className="eyebrow">{k.label}</div>
            <div className="mt-1.5 font-heading text-3xl font-bold text-primary tabular-nums">
              {k.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Employees by location">
          <HBar data={topLocations} />
        </Panel>
        <Panel title="Department distribution">
          <HBar data={departmentDist} color="var(--chart-2)" />
        </Panel>
        <Panel title="Most common skills">
          <HBar data={topSkills} />
        </Panel>
        <Panel title="Most common certifications">
          <HBar data={topCerts} color="var(--chart-2)" />
        </Panel>
        <Panel title="Language distribution">
          <HBar data={languageDist} />
        </Panel>
        <Panel title="Education levels">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={educationDist}
                dataKey="count"
                nameKey="name"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
                label={(props) => `${props.name} (${props.value})`}
                labelLine={false}
                fontSize={11}
              >
                {educationDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}
